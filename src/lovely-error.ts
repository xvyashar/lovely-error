import {
  ElementMethodSegment,
  ElementPathSegment,
  ExtractedTrace,
  LovelyErrorOptions,
  LovelyStack,
  LovelyStackOptions,
  LovelyTreeElement,
  RequiredOptional,
} from './types';

import {
  DEFAULT_LOVELY_ERROR_OPTIONS,
  DEFAULT_LOVELY_ERROR_STACK_OPTIONS,
} from './constants';

export class LovelyError {
  constructor(
    private error: Error | null | undefined,
    private options?: LovelyErrorOptions,
  ) {
    this.options = this.fillOptions(options, DEFAULT_LOVELY_ERROR_OPTIONS);
  }

  stack(options?: LovelyStackOptions): LovelyStack {
    options = this.fillOptions(options, DEFAULT_LOVELY_ERROR_STACK_OPTIONS);

    let { error } = this;

    // handle null | undefined errors
    if (!error) {
      this.error = new Error('Unknown error occurred!');
      return this.stack(options);
    }

    const { name: exception, message } = error;

    // extract trace
    if (error.stack === undefined) {
      // trace is not provided
      return {
        exception,
        message,
      };
    }

    let rawTrace = this.extractRawTrace(error as RequiredOptional<Error>);

    const { trace, packageTrace, projectTrace, nodeTrace, stringTrace } =
      this.extractStackTrace(
        rawTrace,
        options as RequiredOptional<LovelyStackOptions>,
      );

    return {
      exception,
      message,
      trace,
      packageTrace,
      projectTrace,
      nodeTrace,
      stringTrace,
    };
  }

  // static functions
  static stack(
    error: Error | null | undefined,
    options?: LovelyErrorOptions,
    stackOptions?: LovelyStackOptions,
  ) {
    return new LovelyError(error, options).stack(stackOptions);
  }

  // private utility functions
  private fillOptions<T extends object>(
    optionsInput: T | undefined,
    defaultOptions: RequiredOptional<T>,
  ): RequiredOptional<T> {
    if (optionsInput) {
      for (const key in defaultOptions)
        if (optionsInput[key] === undefined)
          optionsInput[key] = defaultOptions[key];
    } else return defaultOptions;

    return optionsInput as RequiredOptional<T>;
  }

  private extractRawTrace(error: RequiredOptional<Error>): string {
    let rawTrace = error.stack
      .substring(error.stack.indexOf(error.message) + error.message.length)
      .trim();

    if (!rawTrace.startsWith('at'))
      rawTrace = rawTrace.substring(rawTrace.indexOf('\n') + 1);

    return rawTrace;
  }

  private extractStackTrace(
    rawTrace: string,
    {
      includePackageTrace,
      includeProjectTrace,
      includeNodeTrace,
      provideSupplementaryTrace,
      traceLimit,
    }: RequiredOptional<LovelyStackOptions>,
  ): ExtractedTrace {
    const lines = rawTrace.split('\n');

    const trace: LovelyTreeElement[] = [];
    const packageTrace: LovelyTreeElement[] = [];
    const projectTrace: LovelyTreeElement[] = [];
    const nodeTrace: LovelyTreeElement[] = [];
    let stringTrace = '';

    for (let i = 0; i < lines.length; i++) {
      if (i > traceLimit - 1) break; // exceeded trace limit
      if (!lines[i].trim().startsWith('at')) continue; // ignore bad trace syntax

      let line = lines[i].substring(lines[i].indexOf('at') + 3); // remove 'at' prefix

      // ignore not needed trace
      if (line.includes('_LovelyError')) {
        traceLimit++;
        continue;
      } else if (line.includes('node_modules') && !includePackageTrace)
        continue;
      else if (line.includes('node:internal') && !includeNodeTrace) continue;
      else if (!includeProjectTrace) continue;

      let treeElement: LovelyTreeElement;

      // parse line
      // line can has be splitted in two segments:
      // - method segment -> parent, method, constructor signature and some messy details in some cases
      // - path segment -> filePath, line and column

      // check if method segment is provided or not
      if (line.split(' ')[0].includes('/') || line.split(' ')[0].includes('\\'))
        treeElement = {
          method: {
            name: '<anonymous_function>',
            alias: undefined,
            parent: undefined,
          },
          ...this.parsePathSegment(line),
        };
      else {
        // method segment is provided
        const pathSegment = line.substring(
          line.indexOf('(') + 1,
          line.lastIndexOf(')'),
        );
        const parsedPathSegment = this.parsePathSegment(pathSegment);
        const methodSegment = line.substring(0, line.indexOf('('));
        const parsedMethodSegment = this.parseMethodSegment(methodSegment);

        treeElement = { ...parsedMethodSegment, ...parsedPathSegment };
      }

      // push to traces
      trace.push(treeElement);
      stringTrace += `${lines[i]}\n`;

      if (treeElement.filePath.includes('node_modules'))
        packageTrace.push(treeElement);
      else if (treeElement.filePath.includes('node:internal'))
        nodeTrace.push(treeElement);
      else projectTrace.push(treeElement);
    }

    // check for bad limited trace
    if (
      projectTrace.length === 0 &&
      includeProjectTrace &&
      provideSupplementaryTrace &&
      traceLimit - lines.length > 0
    ) {
      const previousTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = traceLimit - lines.length + 4;

      // append supplement trace if project trace is not provided
      const supplementTrace = this.extractStackTrace(
        this.extractRawTrace(new Error() as RequiredOptional<Error>),
        {
          includePackageTrace,
          includeProjectTrace,
          includeNodeTrace,
          provideSupplementaryTrace,
          traceLimit: traceLimit - lines.length,
        },
      );

      if (supplementTrace.trace) trace.push(...supplementTrace.trace);
      if (supplementTrace.packageTrace)
        packageTrace.push(...supplementTrace.packageTrace);
      if (supplementTrace.projectTrace)
        projectTrace.push(...supplementTrace.projectTrace);
      if (supplementTrace.nodeTrace)
        nodeTrace.push(...supplementTrace.nodeTrace);
      if (supplementTrace.stringTrace)
        stringTrace += `${
          supplementTrace.stringTrace.startsWith(' ') ? '' : '\t'
        }${supplementTrace.stringTrace}`;

      Error.stackTraceLimit = previousTraceLimit;
    }

    return {
      trace,
      packageTrace: includePackageTrace ? packageTrace : undefined,
      projectTrace: includeProjectTrace ? projectTrace : undefined,
      nodeTrace: includeNodeTrace ? nodeTrace : undefined,
      stringTrace,
    };
  }

  private parsePathSegment(pathSegment: string): ElementPathSegment {
    const column = pathSegment.substring(pathSegment.lastIndexOf(':') + 1);
    pathSegment = pathSegment.substring(0, pathSegment.lastIndexOf(':'));
    const line = pathSegment.substring(pathSegment.lastIndexOf(':') + 1);
    pathSegment = pathSegment.substring(0, pathSegment.lastIndexOf(':'));

    return {
      filePath: pathSegment,
      line,
      column,
    };
  }

  private parseMethodSegment(methodSegment: string): ElementMethodSegment {
    const splittedSegment = methodSegment.split(' ');

    let name: string;
    let alias: string | undefined;
    let parent: string | undefined;
    if (splittedSegment[0] === 'new') {
      name = 'constructor';
      parent = splittedSegment[1];

      if (splittedSegment[2] === '[as')
        alias = splittedSegment[3].substring(0, splittedSegment[3].length - 1);
    } else {
      const [parentStr, nameStr] = splittedSegment[0].split('.');
      if (nameStr) {
        parent = parentStr;
        name = nameStr === '<anonymous>' ? '<anonymous_function>' : nameStr;
      } else {
        name = parentStr;
      }

      if (splittedSegment[1] === '[as')
        alias = splittedSegment[2].substring(0, splittedSegment[2].length - 1);
    }

    return {
      method: { name, alias, parent },
    };
  }
}
