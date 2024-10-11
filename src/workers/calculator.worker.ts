import { parentPort } from 'worker_threads';

const operators = {
  '+': { precedence: 1 },
  '-': { precedence: 1 },
  '*': { precedence: 2 },
  '/': { precedence: 2 },
};

function isDigit(char: string): boolean {
  return /\d/.test(char);
}

function isOperator(char: string): char is keyof typeof operators {
  return Object.keys(operators).includes(char);
}

function infixToPostfix(expression: string): string[] {
  const output: string[] = [];
  const stack: string[] = [];
  let numberBuffer: string[] = [];

  for (const char of expression) {
    if (isDigit(char) || char === '.') {
      numberBuffer.push(char);
    } else {
      if (numberBuffer.length > 0) {
        output.push(numberBuffer.join(''));
        numberBuffer = [];
      }

      if (isOperator(char)) {
        while (
          stack.length > 0 &&
          isOperator(stack[stack.length - 1]) &&
          operators[char].precedence <=
            operators[stack[stack.length - 1]].precedence
        ) {
          output.push(stack.pop());
        }
        stack.push(char);
      } else if (char === '(') {
        stack.push(char);
      } else if (char === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          output.push(stack.pop());
        }
        stack.pop();
      }
    }
  }

  if (numberBuffer.length > 0) {
    output.push(numberBuffer.join(''));
  }

  while (stack.length > 0) {
    output.push(stack.pop());
  }

  return output;
}

function evaluatePostfix(postfix: string[]): number {
  const stack: number[] = [];

  for (const token of postfix) {
    if (isDigit(token[0]) || token.length > 1) {
      stack.push(parseFloat(token));
    } else if (isOperator(token)) {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) {
            return NaN;
          }
          stack.push(a / b);
          break;
      }
    }
  }

  return stack.pop();
}

parentPort.on('message', (data: { expression: string; id: string }) => {
  const { expression, id } = data;
  const postfix = infixToPostfix(expression.replace(/\s+/g, ''));
  const result = evaluatePostfix(postfix);

  parentPort.postMessage({ result, id });
});
