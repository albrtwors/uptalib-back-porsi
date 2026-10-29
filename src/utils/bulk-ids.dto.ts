import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, IsString } from "class-validator";

/**
 * IDs de los registros seleccionados en la interfaz para una operación masiva.
 */
export class BulkIdsDto {

    @IsArray({ message: 'Los IDs deben ser un arreglo' })
    @ArrayNotEmpty({ message: 'Debes seleccionar al menos un registro' })
    @IsString({ each: true, message: 'Cada ID debe ser una cadena de texto' })
    ids: string[];
}

/**
 * Variante para las entidades cuyo ID es numérico (libros digitales).
 */
export class BulkIntIdsDto {

    @Transform(({ value }: any) => Array.isArray(value) ? value.map((v) => parseInt(`${v}`)) : value)
    @IsArray({ message: 'Los IDs deben ser un arreglo' })
    @ArrayNotEmpty({ message: 'Debes seleccionar al menos un registro' })
    @IsInt({ each: true, message: 'Cada ID debe ser un número entero' })
    ids: number[];
}

