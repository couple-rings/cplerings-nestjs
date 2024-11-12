import { Allow } from 'class-validator';

export class CoordinateDto {
  @Allow()
  latitude: number;

  @Allow()
  longitude: number;

  @Allow()
  orderId: number;
}
