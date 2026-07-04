"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiBooksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_1 = require("@langchain/groq");
const messages_1 = require("@langchain/core/messages");
const prisma_service_1 = require("../../prisma/prisma.service");
const book_extraction_schema_1 = require("./book-extraction.schema");
const book_extraction_schema_2 = require("./book-extraction.schema");
let AiBooksService = class AiBooksService {
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
    }
    onModuleInit() {
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey)
            throw new Error('Falta la variable de entorno GROQ_API_KEY');
        const model = new groq_1.ChatGroq({
            apiKey: apiKey,
            model: 'openai/gpt-oss-120b',
            temperature: 0.1,
        });
        this.modelWithStructuredOutput = model.withStructuredOutput(book_extraction_schema_1.BookExtractionSchema, {
            name: 'book_extraction',
        });
        this.bulkModelWithStructuredOutput = model.withStructuredOutput(book_extraction_schema_2.BulkBookActionSchema, {
            name: 'bulk_book_execution',
        });
    }
    async processBookIntent(userInput, currentBookData) {
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
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
            const result = response;
            const cleanedPayload = {};
            if (result.extractedData.title !== null)
                cleanedPayload.title = result.extractedData.title;
            if (result.extractedData.description !== null)
                cleanedPayload.description = result.extractedData.description;
            if (result.extractedData.routepdf !== null)
                cleanedPayload.routepdf = result.extractedData.routepdf;
            if (result.extractedData.routeimg !== null)
                cleanedPayload.routeimg = result.extractedData.routeimg;
            if (result.extractedData.pnfs && result.extractedData.pnfs.length > 0) {
                cleanedPayload.pnfs = result.extractedData.pnfs;
            }
            if (result.extractedData.authors && result.extractedData.authors.length > 0) {
                const resolvedAuthorIds = [];
                for (const authorName of result.extractedData.authors) {
                    const cleanedName = authorName.trim();
                    if (!cleanedName)
                        continue;
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
                extractedData: cleanedPayload
            };
        }
        catch (error) {
            console.error('Error procesando intención de IA unitaria:', error);
            return {
                message: 'Disculpa, ocurrió un inconveniente analizando la información.',
                extractedData: {}
            };
        }
    }
    async processBulkIntent(userInput) {
        const systemPrompt = `
      Eres el centro de mando inteligente de la Biblioteca Raúl Castillo en la UPT de Aragua.
      Procesas acciones múltiples (CREATE, UPDATE, DELETE). 
      Si un campo no viene explícito en la orden de un libro, no lo agregues en el JSON de ese registro.
    `;
        try {
            return await this.bulkModelWithStructuredOutput.invoke([
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
        }
        catch (error) {
            console.error('Error procesando intención masiva con Groq:', error);
            return { message: 'No se pudo procesar el lote por IA debido a un inconveniente técnico.', extractedData: [] };
        }
    }
};
exports.AiBooksService = AiBooksService;
exports.AiBooksService = AiBooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], AiBooksService);
//# sourceMappingURL=ai-books.service.js.map