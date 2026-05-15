import { PartialType } from "@nestjs/swagger";
import { CreateItemInventory } from "./create-item-dto";
import { CreateInventoryDto } from "./create-inventory.dto";

export class EditItemInventory extends PartialType(CreateInventoryDto) {

}