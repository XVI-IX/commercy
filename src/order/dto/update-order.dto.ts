import { PartialType } from '@nestjs/mapped-types';
import { CheckoutDto } from './checkout.dto';

export class UpdateOrderDto extends PartialType(CheckoutDto) {}
