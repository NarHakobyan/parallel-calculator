import { Body, Controller, Post } from '@nestjs/common';
import { CalculatorService } from './calculator.service';
import { EvaluateExpressionDto } from './EvaluateExpressionDto';

@Controller()
export class AppController {
  constructor(private readonly calculatorService: CalculatorService) {}

  @Post('evaluate')
  getHello(@Body() evaluateExpressionDto: EvaluateExpressionDto) {
    return this.calculatorService.evaluateExpression(
      evaluateExpressionDto.expression,
    );
  }
}
