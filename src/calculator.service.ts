import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  UnprocessableEntityException,
} from '@nestjs/common';
import { join } from 'path';
import { Worker } from 'worker_threads';
import { filter, firstValueFrom, fromEvent, map, Observable } from 'rxjs';
import { randomUUID } from 'node:crypto';

@Injectable()
export class CalculatorService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private worker: Worker;
  private messages$: Observable<{ id: string; result: number }>;

  onApplicationBootstrap() {
    this.worker = new Worker(join(__dirname, './workers/calculator.worker.js'));
    this.messages$ = fromEvent(this.worker, 'message') as Observable<{
      id: string;
      result: number;
    }>;
  }

  async onApplicationShutdown() {
    await this.worker.terminate();
  }

  async evaluateExpression(expression: string): Promise<number> {
    const uniqueId = randomUUID(); // Generating a unique ID for the task
    // Sending a message to the worker thread with the input number and unique ID
    this.worker.postMessage({ expression, id: uniqueId });

    // Returning a promise that resolves with the result of the Fibonacci calculation
    const value = await firstValueFrom(
      // Convert the observable to a promise
      this.messages$.pipe(
        // Filter messages to only include those with the matching unique ID
        filter(({ id }) => id === uniqueId),
        // Extract the result from the message
        map(({ result }) => result),
      ),
    );

    if (value == null || Number.isNaN(value)) {
      throw new UnprocessableEntityException('Invalid expression');
    }

    return value;
  }
}
