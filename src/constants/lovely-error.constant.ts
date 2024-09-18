import {
  LovelyErrorOptions,
  LovelyStackOptions,
  RequiredOptional,
} from '../types';

export const DEFAULT_LOVELY_ERROR_OPTIONS: RequiredOptional<LovelyErrorOptions> =
  {
    logger: console.log,
  };

export const DEFAULT_LOVELY_ERROR_STACK_OPTIONS: RequiredOptional<LovelyStackOptions> =
  {
    includePackageTrace: false,
    includeProjectTrace: true,
    includeNodeTrace: false,
    provideSupplementaryTrace: true,
    traceLimit: 10,
  };
