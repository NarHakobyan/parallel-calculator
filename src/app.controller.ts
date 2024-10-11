import { Body, Controller, Post } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { EvaluateExpressionDto } from './EvaluateExpressionDto';

@Controller()
export class AppController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('evaluate')
  async evaluateExpression(
    @Body() evaluateExpressionDto: EvaluateExpressionDto,
  ) {
    const result = await this.calculatorService.evaluateExpression(
      evaluateExpressionDto.expression,
    );

    return {
      result,
    };
  }
}
