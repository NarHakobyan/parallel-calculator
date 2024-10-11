import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class EvaluateExpressionDto {
  @Expose()
  @IsString()
  expression: string;
}
