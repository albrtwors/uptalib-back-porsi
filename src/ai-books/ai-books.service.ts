import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGroq } from '@langchain/groq';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { PrismaService } from '../../prisma/prisma.service';
import { BookExtractionSchema, BookExtractionResult } from './book-extraction.schema';
import { BulkBookActionSchema, BulkBookActionResult } from './book-extraction.schema';

@Injectable()
export class AiBooksService implements OnModuleInit {
    private modelWithStructuredOutput: any;
    private bulkModelWithStructuredOutput: any;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) { }

    onModuleInit() {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        if (!apiKey) throw new Error('Falta la variable de entorno GROQ_API_KEY');

        const model = new ChatGroq({
            apiKey: apiKey,
            model: 'openai/gpt-oss-120b',
            temperature: 0.1,
        });

        // 💡 Inicialización del modelo unitario
        this.modelWithStructuredOutput = model.withStructuredOutput(BookExtractionSchema, {
            name: 'book_extraction',
        });

        // 💡 LA LÍNEA QUE FALTABA: Inicialización del modelo masivo (bulk)
        this.bulkModelWithStructuredOutput = model.withStructuredOutput(BulkBookActionSchema, {
            name: 'bulk_book_execution',
        });
    }

    async processBookIntent(userInput: string, currentBookData?: any): Promise<any> {
        const systemPrompt = `
      Eres un asistente experto de la Biblioteca Raúl Castillo en la UPT de Aragua.
      Analiza el mensaje del usuario y rellena los datos correspondientes.
      
      Reglas:
      1. Extrae los PNFs válidos: GENERAL, INFORMATICA, ELECTRONICA, MANTENIMIENTO, CONTADURIA, ADMINISTRACION, ELECTRICIDAD, MECANICA, INSTRUMENTACION, TELECOMUNICACIONES.
      2. Extrae los nombres de los autores en 'authors'.
      3. Si el usuario no menciona un campo de texto, ponlo como null. Si no menciona arreglos, ponlos como [].
    `;

        try {
            const response = await this.modelWithStructuredOutput.invoke([
                new SystemMessage(systemPrompt),
                new HumanMessage(userInput),
            ]);

            const result = response as BookExtractionResult;

            // 💡 LIMPIEZA DINÁMICA: Creamos el payload final ignorando los campos 'null'
            const cleanedPayload: any = {};

            if (result.extractedData.title !== null) cleanedPayload.title = result.extractedData.title;
            if (result.extractedData.description !== null) cleanedPayload.description = result.extractedData.description;
            if (result.extractedData.routepdf !== null) cleanedPayload.routepdf = result.extractedData.routepdf;
            if (result.extractedData.routeimg !== null) cleanedPayload.routeimg = result.extractedData.routeimg;

            // Solo pasamos los PNFs si la IA realmente extrajo elementos
            if (result.extractedData.pnfs && result.extractedData.pnfs.length > 0) {
                cleanedPayload.pnfs = result.extractedData.pnfs;
            }

            // 💡 Procesamos la verificación/creación de autores solo si vienen nombres en el arreglo
            if (result.extractedData.authors && result.extractedData.authors.length > 0) {
                const resolvedAuthorIds: string[] = [];
                for (const authorName of result.extractedData.authors) {
                    const cleanedName = authorName.trim();
                    if (!cleanedName) continue;

                    let author = await this.prisma.author.findFirst({
                        where: { name: { equals: cleanedName, mode: 'insensitive' } }
                    });

                    if (!author) {
                        author = await this.prisma.author.create({ data: { name: cleanedName } });
                    }
                    resolvedAuthorIds.push(author.id);
                }
                cleanedPayload.authorIds = resolvedAuthorIds;
            }

            return {
                message: result.message,
                extractedData: cleanedPayload // 👈 Enviamos SOLO lo que mutó, libre de nulls
            };

        } catch (error) {
            console.error('Error procesando intención de IA unitaria:', error);
            return {
                message: 'Disculpa, ocurrió un inconveniente analizando la información.',
                extractedData: {}
            };
        }
    }

    async processBulkIntent(userInput: string): Promise<BulkBookActionResult> {
        const systemPrompt = `
      Eres el centro de mando inteligente de la Biblioteca Raúl Castillo en la UPT de Aragua.
      Procesas acciones múltiples (CREATE, UPDATE, DELETE). 
      Si un campo no viene explícito en la orden de un libro, no lo agregues en el JSON de ese registro.
    `;

        try {
            return await this.bulkModelWithStructuredOutput.invoke([
                new SystemMessage(systemPrompt),
                new HumanMessage(userInput),
            ]) as BulkBookActionResult;
        } catch (error) {
            console.error('Error procesando intención masiva con Groq:', error);
            return { message: 'No se pudo procesar el lote por IA debido a un inconveniente técnico.', extractedData: [] };
        }
    }
}