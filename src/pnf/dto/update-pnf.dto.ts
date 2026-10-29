import { PartialType } from '@nestjs/swagger';
import { CreatePnfDto } from './create-pnf.dto';

export class UpdatePnfDto extends PartialType(CreatePnfDto) {}
