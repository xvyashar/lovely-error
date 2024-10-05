import {
  CatchCallback,
  ColorObject,
  FilledLogColorPalette,
  LovelyLogOptions,
  LovelyStack,
  LovelyStackOptions,
  RequiredOptional,
} from './types';

import {
  DEFAULT_LOVELY_ERROR_STACK_OPTIONS,
  DEFAULT_LOVELY_LOG_OPTIONS,
} from './constants';

import { ColorUtils, HandyUtils, ParserUtils } from './utils';

export class LovelyError {
  static NO_EXCEPTION = 'NO_EXCEPTION';

  private _stack: LovelyStack;
  private utils: ParserUtils = ParserUtils.getInstance();

  constructor(
    private error: Error | null | undefined,
    private options?: LovelyStackOptions,
  ) {
    this.options = this.utils.fillOptions(
      this.options,
      DEFAULT_LOVELY_ERROR_STACK_OPTIONS,
    );
    this._stack = this.utils.parseError(
      error,
      this.options as RequiredOptional<LovelyStackOptions>,
    );
  }

  stack() {
    return this._stack;
  }

  catch(exception: string, callback: CatchCallback) {
    try {
      if (exception === LovelyError.NO_EXCEPTION) exception = 'Error';
      if (this.error?.name === exception) callback(this._stack);
    } catch (error) {
      new LovelyError(error as Error).log();
    }
  }

  log(options?: LovelyLogOptions) {
    const filledOptions = this.utils.fillOptions(
      options,
      DEFAULT_LOVELY_LOG_OPTIONS,
    );

    if (!filledOptions.logger) return;

    const { logger, colorize, verbose } = filledOptions;
    const colorPalette = filledOptions.colorPalette as FilledLogColorPalette;

    const { exception, message, trace } = this._stack;

    let log = `${
      colorize
        ? ColorUtils.colorize(`<${exception}>`, colorPalette.exception)
        : exception
    } ${
      colorize ? ColorUtils.colorize(message, colorPalette.message) : message
    }\n`;

    if (trace)
      for (const {
        method: { name, alias, parent },
        filePath,
        line,
        column,
      } of trace) {
        log += `\t${
          colorize ? ColorUtils.colorize('-> ', colorPalette.treeArrow) : '-> '
        }`;

        let elementColor: ColorObject;
        if (HandyUtils.isPackageTrace(filePath))
          elementColor = colorPalette.packageTrace;
        else if (HandyUtils.isInternalTrace(filePath))
          elementColor = colorPalette.internalTrace;
        else elementColor = colorPalette.projectTrace;

        log += `${
          colorize
            ? ColorUtils.colorize(
                `[${parent ? parent + '.' : ''}${
                  name === '<anonymous_function>'
                    ? ColorUtils.decorate(name, ColorUtils.STYLE_ITALIC) +
                      ColorUtils.getPrefix(elementColor)
                    : name
                }${alias ? ' -> ' + alias : ''}] ${
                  ColorUtils.decorate(
                    verbose
                      ? filePath
                      : '...' +
                          filePath.substring(
                            filePath.lastIndexOf('/') !== -1
                              ? filePath.lastIndexOf('/')
                              : filePath.lastIndexOf('\\'),
                          ),
                    ColorUtils.STYLE_UNDERLINE,
                  ) + ColorUtils.getPrefix(elementColor)
                } -> (${line}:${column})\n`,
                elementColor,
              )
            : `[${parent ? parent + '.' : ''}${name}${
                alias ? ' -> ' + alias : ''
              }] ${
                verbose
                  ? filePath
                  : '...' +
                    filePath.substring(
                      filePath.lastIndexOf('/') !== -1
                        ? filePath.lastIndexOf('/')
                        : filePath.lastIndexOf('\\'),
                    )
              } -> (${line}:${column})\n`
        }`;
      }

    logger(log);
  }

  // static functions
  static stack(
    error: Error | null | undefined,
    stackOptions?: LovelyStackOptions,
  ) {
    return new LovelyError(error, stackOptions).stack();
  }

  static catch(
    error: Error | null | undefined,
    exception: string,
    callback: CatchCallback,
    stackOptions?: LovelyStackOptions,
  ) {
    return new LovelyError(error, stackOptions).catch(exception, callback);
  }

  static log(
    error: Error | null | undefined,
    stackOptions?: LovelyStackOptions,
    logOptions?: LovelyLogOptions,
  ) {
    return new LovelyError(error, stackOptions).log(logOptions);
  }
}
