import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdatePhysicalBookDto } from "./update-physical-book.dto";

/**
 * Registro del lote. El `id` es opcional: sin id se crea, con id se actualiza.
 */
export class BulkPhysicalBookRecordDto extends UpdatePhysicalBookDto {

    @IsOptional()
    @IsString({ message: 'El ID del registro debe ser una cadena de texto' })
    id?: string;
}

export class BulkPhysicalBookDto {

    @IsArray({ message: 'Los registros deben ser un arreglo' })
    @ArrayNotEmpty({ message: 'Debes incluir al menos un registro' })
    @ValidateNested({ each: true })
    @Type(() => BulkPhysicalBookRecordDto)
    records: BulkPhysicalBookRecordDto[];
}
