export type LoggerFunction = (message: string, ...params: any[]) => void;

export type LovelyLogOptions = {
  logger?: LoggerFunction | null;
};

export type LovelyStackOptions = {
  includePackageTrace?: boolean;
  includeProjectTrace?: boolean;
  includeNodeTrace?: boolean;
  provideSupplementaryTrace?: boolean;
  traceLimit?: number;
};

export type ExtractMessageOutput = {
  exception: string;
  message: string;
};

export type ElementMethodSegment = {
  method: {
    name: string;
    alias?: string;
    parent?: string;
  };
};

export type ElementPathSegment = {
  filePath: string;
  line: string;
  column: string;
};

export type LovelyTraceElement = ElementMethodSegment & ElementPathSegment;

export type ExtractedTrace = {
  trace?: LovelyTraceElement[];
  packageTrace?: LovelyTraceElement[];
  projectTrace?: LovelyTraceElement[];
  nodeTrace?: LovelyTraceElement[];
  stringTrace?: string;
};

export type LovelyStack = ExtractMessageOutput & ExtractedTrace;

export type CatchCallback = (stack: LovelyStack) => void;

// utility types
export type RequiredOptional<T> = {
  [K in keyof T]-?: T[K] extends undefined ? never : T[K];
};
