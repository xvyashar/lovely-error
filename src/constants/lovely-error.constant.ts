import {
  LovelyLogOptions,
  LovelyStackOptions,
  RequiredOptional,
} from '../types';

export const DEFAULT_LOVELY_LOG_OPTIONS: RequiredOptional<LovelyLogOptions> = {
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
