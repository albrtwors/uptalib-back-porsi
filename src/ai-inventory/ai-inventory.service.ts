// ai-inventory.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatGroq } from '@langchain/groq';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';
import { InventoryExtractionSchema, InventoryExtractionResult } from './inventory-extraction.schema';

@Injectable()
export class AiInventoryService implements OnModuleInit {
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

        this.modelWithStructuredOutput = model.withStructuredOutput(InventoryExtractionSchema, {
            name: 'inventory_extraction',
        });
    }

    async processInventoryIntent(userInput: string, currentItemData?: any): Promise<InventoryExtractionResult> {

        // 💡 NORMALIZACIÓN: Forzamos a que el contexto tenga exactamente la misma estructura que el schema (name, code, description, stock, typeName)
        let normalizedContext = null;
        if (currentItemData) {
            normalizedContext = {
                name: currentItemData.name || null,
                code: currentItemData.code || null,
                description: currentItemData.description || null,
                stock: currentItemData.totalStock?.toString() || '0', // Mapeado a 'stock' para que la IA lo entienda
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
                new SystemMessage(systemPrompt),
                new HumanMessage(userInput),
            ]);
        } catch (error) {
            console.error('Error en AI Inventory:', error);
            return {
                message: 'No se pudo procesar la solicitud del inventario de forma automatizada.',
                extractedData: { name: null, code: null, description: null, stock: null, typeName: null }
            };
        }
    }
}