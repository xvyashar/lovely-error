import { ConsoleColor } from './console-color.constants';
import {
  LovelyLogOptions,
  LovelyStackOptions,
  RequiredOptional,
} from '../types';

export const DEFAULT_LOVELY_LOG_OPTIONS: RequiredOptional<LovelyLogOptions> = {
  logger: console.log,
  colorize: true,
  verbose: true,
  colorPalette: {
    exception: {
      foreground: ConsoleColor.TEXT_BLACK,
      background: ConsoleColor.BACKGROUND_RED,
    },
    message: {
      foreground: ConsoleColor.TEXT_RED,
    },
    treeArrow: {
      foreground: ConsoleColor.TEXT_YELLOW,
    },
    packageTrace: {
      foreground: ConsoleColor.TEXT_GRAY,
    },
    projectTrace: {
      foreground: ConsoleColor.TEXT_WHITE,
    },
    nodeTrace: {
      foreground: ConsoleColor.TEXT_GRAY,
    },
  },
};

export const DEFAULT_LOVELY_ERROR_STACK_OPTIONS: RequiredOptional<LovelyStackOptions> =
  {
    includePackageTrace: false,
    includeProjectTrace: true,
    includeNodeTrace: false,
    provideSupplementaryTrace: true,
    traceLimit: 10,
  };
