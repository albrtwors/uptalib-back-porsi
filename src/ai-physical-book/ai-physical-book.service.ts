import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGroq } from '@langchain/groq';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { BookExtractionSchema, BookExtractionResult } from './book-extraction.schema';

@Injectable()
export class AiPhysicalBookService implements OnModuleInit {
    private modelWithStructuredOutput;

    constructor(private configService: ConfigService) { }

    onModuleInit() {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        if (!apiKey) throw new Error('Falta GROQ_API_KEY');

        const model = new ChatGroq({
            apiKey,
            model: 'openai/gpt-oss-120b',
            temperature: 0.1,
        });

        this.modelWithStructuredOutput = model.withStructuredOutput(BookExtractionSchema, {
            name: 'book_extraction',
        });
    }

    async processBookIntent(userInput: string, currentBookData?: any): Promise<BookExtractionResult> {

        // 💡 NORMALIZACIÓN: Sincronizamos las propiedades relacionales complejas del front (author, category) a strings planos
        let normalizedContext = null;
        if (currentBookData) {
            normalizedContext = {
                title: currentBookData.title || null,
                isbn: currentBookData.isbn || null,
                authorName: currentBookData.author?.name || null,
                categoryName: currentBookData.category?.name || null,
                pnf: currentBookData.pnf || null,
                yearOfPublication: currentBookData.yearOfPublication?.toString() || null,
                editorial: currentBookData.editorial || null,
                totalStock: currentBookData.availableStock?.toString() || '0' // Usamos el stock disponible actual como base
            };
        }

        const systemPrompt = `
      Eres el asistente inteligente de gestión de biblioteca de la plataforma UPTALib.
      Tu trabajo es procesar las solicitudes de los administradores en lenguaje natural para rellenar los datos de un libro físico en el formulario.
      
      Debes extraer las siguientes propiedades: title, isbn, authorName, categoryName, pnf, yearOfPublication, editorial, totalStock.
      
      ${normalizedContext ? `CONTEXTO DE EDICIÓN: El administrador está modificando un libro existente cuyos valores actuales son: ${JSON.stringify(normalizedContext)}.
      Modifica, incrementa, decrementa o actualiza los datos basándote estrictamente en esta estructura.
      Si el usuario pide cambiar el stock (ej: "Súmale 5 al stock" o "Cámbiale la cantidad a 10"), calcula el valor final relativo al stock actual y devuélvelo en la propiedad 'totalStock' como un string numérico.` : ''}
      
      Si el usuario no especifica un cambio en una propiedad y no hay contexto de edición, devuélvela como null. Si hay contexto de edición, mantén el valor original del contexto si no se solicita alterarlo.
      Las propiedades 'yearOfPublication' y 'totalStock' deben ser retornadas siempre como un string numérico o null.
    `;

        try {
            return await this.modelWithStructuredOutput.invoke([
                new SystemMessage(systemPrompt),
                new HumanMessage(userInput),
            ]);
        } catch (error) {
            console.error('Error en AI Book Service:', error);
            return {
                message: 'No se pudo procesar la solicitud del libro de forma automatizada.',
                extractedData: {
                    title: null, isbn: null, authorName: null, categoryName: null,
                    pnf: null, yearOfPublication: null, editorial: null, totalStock: null
                }
            };
        }
    }
}