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
exports.AiInventoryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const groq_1 = require("@langchain/groq");
const messages_1 = require("@langchain/core/messages");
const inventory_extraction_schema_1 = require("./inventory-extraction.schema");
let AiInventoryService = class AiInventoryService {
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
        this.modelWithStructuredOutput = model.withStructuredOutput(inventory_extraction_schema_1.InventoryExtractionSchema, {
            name: 'inventory_extraction',
        });
    }
    async processInventoryIntent(userInput, currentItemData) {
        let normalizedContext = null;
        if (currentItemData) {
            normalizedContext = {
                name: currentItemData.name || null,
                code: currentItemData.code || null,
                description: currentItemData.description || null,
                stock: currentItemData.totalStock?.toString() || '0',
                typeName: currentItemData.type?.name || null
            };
        }
        const systemPrompt = `
      Eres el asistente de gestión de inventarios de la plataforma UPTALib.
      Tu trabajo es procesar las solicitudes de los administradores para rellenar los datos de insumos, equipos o herramientas.
      
      Debes extraer: name, code, description, stock y typeName (el tipo o categoría del item).
      
      ${normalizedContext ? `CONTEXTO DE EDICIÓN: El administrador está modificando un item existente cuyos valores actuales son: ${JSON.stringify(normalizedContext)}. 
      Modifica, incrementa, decrementa o actualiza los datos basándote estrictamente en esta estructura. 
      Si el usuario pide cambiar el stock (ej. "Ponle 15" o "Súmale 2"), calcula o define el valor final y devuélvelo en la propiedad 'stock' como un string numérico.` : ''}
      
      Si el usuario no especifica un cambio en una propiedad, devuélvelo como null (o mantén el valor original del contexto si es edición). El stock debe ser retornado siempre como string numérico.
    `;
        try {
            return await this.modelWithStructuredOutput.invoke([
                new messages_1.SystemMessage(systemPrompt),
                new messages_1.HumanMessage(userInput),
            ]);
        }
        catch (error) {
            console.error('Error en AI Inventory:', error);
            return {
                message: 'No se pudo procesar la solicitud del inventario de forma automatizada.',
                extractedData: { name: null, code: null, description: null, stock: null, typeName: null }
            };
        }
    }
};
exports.AiInventoryService = AiInventoryService;
exports.AiInventoryService = AiInventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiInventoryService);
//# sourceMappingURL=ai-inventory.service.js.map