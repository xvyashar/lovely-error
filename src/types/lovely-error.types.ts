export type LoggerFunction = (message: string, ...params: any[]) => void;

export type LovelyErrorOptions = {
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

export type LovelyTreeElement = ElementMethodSegment & ElementPathSegment;

export type ExtractedTrace = {
  trace?: LovelyTreeElement[];
  packageTrace?: LovelyTreeElement[];
  projectTrace?: LovelyTreeElement[];
  nodeTrace?: LovelyTreeElement[];
  stringTrace?: string;
};

export type LovelyStack = ExtractMessageOutput & ExtractedTrace;

// utility types
export type RequiredOptional<T> = {
  [K in keyof T]-?: T[K] extends undefined ? never : T[K];
};
