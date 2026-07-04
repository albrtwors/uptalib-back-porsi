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
exports.AiPhysicalBookService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_1 = require("@langchain/groq");
const messages_1 = require("@langchain/core/messages");
const book_extraction_schema_1 = require("./book-extraction.schema");
let AiPhysicalBookService = class AiPhysicalBookService {
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const apiKey = this.configService.get('GROQ_API_KEY');
        if (!apiKey)
            throw new Error('Falta GROQ_API_KEY');
        const model = new groq_1.ChatGroq({
            apiKey,
            model: 'openai/gpt-oss-120b',
            temperature: 0.1,
        });
        this.modelWithStructuredOutput = model.withStructuredOutput(book_extraction_schema_1.BookExtractionSchema, {
            name: 'book_extraction',
        });
    }
    async processBookIntent(userInput, currentBookData) {
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
                totalStock: currentBookData.availableStock?.toString() || '0'
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
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
        }
        catch (error) {
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
};
exports.AiPhysicalBookService = AiPhysicalBookService;
exports.AiPhysicalBookService = AiPhysicalBookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiPhysicalBookService);
//# sourceMappingURL=ai-physical-book.service.js.map