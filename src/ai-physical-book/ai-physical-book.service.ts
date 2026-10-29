import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGroq } from '@langchain/groq';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { PrismaService } from '../../prisma/prisma.service';
import { BookExtractionSchema, BookExtractionResult } from './book-extraction.schema';
import { normalizePnfName } from '../utils/pnf';

@Injectable()
export class AiPhysicalBookService implements OnModuleInit {
    private modelWithStructuredOutput;

    constructor(
        private configService: ConfigService,
        private prisma: PrismaService
    ) { }

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

    private toPnfNames(value: any): string[] {
        if (!value) return [];
        const list = Array.isArray(value) ? value : [value];
        return list
            .map((item: any) => normalizePnfName(typeof item === 'string' ? item : item?.name ?? item?.pnf ?? ''))
            .filter(Boolean);
    }

    async processBookIntent(userInput: string, currentBookData?: any): Promise<BookExtractionResult> {

        // 💡 NORMALIZACIÓN: Sincronizamos las propiedades relacionales complejas del front (author, category, pnfs) a valores planos
        let normalizedContext = null;
        if (currentBookData) {
            const authors = Array.isArray(currentBookData.authors) ? currentBookData.authors : (currentBookData.author ? [currentBookData.author] : []);
            const categories = Array.isArray(currentBookData.categories) ? currentBookData.categories : (currentBookData.category ? [currentBookData.category] : []);
            const pnfs = this.toPnfNames(currentBookData.pnfs ?? currentBookData.pnf ?? currentBookData.pnfNames);
            normalizedContext = {
                title: currentBookData.title || null,
                isbn: currentBookData.isbn || null,
                code: currentBookData.code || null,
                authorName: authors[0]?.name || authors[0] || null,
                categoryName: categories[0]?.name || categories[0] || null,
                pnfs: pnfs.length > 0 ? pnfs : null,
                yearOfPublication: currentBookData.yearOfPublication?.toString() || null,
                editorial: currentBookData.editorial || null,
                totalStock: currentBookData.availableStock?.toString() || '0' // Usamos el stock disponible actual como base
            };
        }

        const pnfs = await this.prisma.pnf.findMany({ orderBy: { name: 'asc' } });
        const pnfList = pnfs.map((p) => p.name).join(', ');

        const systemPrompt = `
      Eres el asistente inteligente de gestión de biblioteca de la plataforma UPTALib.
      Tu trabajo es procesar las solicitudes de los administradores en lenguaje natural para rellenar los datos de un libro físico en el formulario.

      Debes extraer las siguientes propiedades: title, isbn, code, authorName, categoryName, pnfs, yearOfPublication, editorial, totalStock.

      Reglas de los PNFs:
      1. 'pnfs' es un arreglo con uno o más Programas Nacionales de Formación. Los PNFs registrados en la biblioteca son: ${pnfList}.
      2. Si el administrador menciona un PNF que no está en la lista, devuélvelo igualmente normalizado en mayúsculas sin espacios extra (se creará al guardar).
      3. El 'isbn' es el identificador editorial internacional y el 'code' es el código asignado por la biblioteca; son campos distintos. No pongas el ISBN dentro de 'code' ni viceversa.

      ${normalizedContext ? `CONTEXTO DE EDICIÓN: El administrador está modificando un libro existente cuyos valores actuales son: ${JSON.stringify(normalizedContext)}.
      Modifica, incrementa, decrementa o actualiza los datos basándote estrictamente en esta estructura.
      Si el usuario pide cambiar el stock (ej: "Súmale 5 al stock" o "Cámbiale la cantidad a 10"), calcula el valor final relativo al stock actual y devuélvelo en la propiedad 'totalStock' como un string numérico.
      Si el usuario agrega o quita un PNF, devuelve en 'pnfs' la lista final completa.` : ''}

      Si el usuario no especifica un cambio en una propiedad y no hay contexto de edición, devuélvela como null (o [] en el caso de 'pnfs'). Si hay contexto de edición, mantén el valor original del contexto si no se solicita alterarlo.
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
                    title: null, isbn: null, code: null, authorName: null, categoryName: null,
                    pnfs: [], yearOfPublication: null, editorial: null, totalStock: null
                }
            };
        }
    }
}
