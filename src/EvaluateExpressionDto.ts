import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class EvaluateExpressionDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  expression: string;
}
