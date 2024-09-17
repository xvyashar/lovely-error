import {
  ExtractMessageOutput,
  ExtractTraceOutput,
  LovelyErrorOptions,
  LovelyStack,
  LovelyTreeElement,
} from './types';

export class LovelyError {
  constructor(private options: LovelyErrorOptions) {}

  stack(): LovelyStack {
    let { error } = this.options;

    // handle null | undefined errors
    if (!error || error?.stack === undefined) {
      this.options.error = new Error('Unknown error occurred!');
      return this.stack();
    }

    const { exception, message } = this.extractErrorMessage(String(error));

    // extract stack
    const stringTrace = error.stack
      .substring(error.stack.indexOf('\n') + 1)
      .trim();

    const { trace, projectTrace, packageTrace } =
      this.extractStackTrace(stringTrace);

    const stack: LovelyStack = {
      exception,
      message,
      trace,
      projectTrace,
      packageTrace,
      stringTrace,
    };

    return stack;
  }

  // static functions
  static stack(options: LovelyErrorOptions) {
    return new LovelyError(options).stack();
  }

  //private utility functions
  private extractErrorMessage(message: string): ExtractMessageOutput {
    return {
      exception:
        message.substring(0, message.indexOf(':')).trim().split(' ')[0] ||
        'Error',
      message:
        message.substring(message.indexOf(':') + 1).trim() ||
        'Unknown error occurred!',
    };
  }

  private extractStackTrace(stringTrace: string): ExtractTraceOutput {
    const lines = stringTrace.split('\n');

    const projectTrace: LovelyTreeElement[] = [];
    const packageTrace: LovelyTreeElement[] = [];

    // for (const line of lines) {
    // }

    return {
      trace: [...packageTrace, ...projectTrace],
      packageTrace,
      projectTrace,
    };
  }
}
