export type LovelyStackOptions = {
  includePackageTrace?: boolean;
  includeProjectTrace?: boolean;
  includeNodeTrace?: boolean;
  provideSupplementaryTrace?: boolean;
  traceLimit?: number;
};

export type ExtractedMessage = {
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

export type LovelyStack = ExtractedMessage & ExtractedTrace;

export type CatchCallback = (stack: LovelyStack) => void;

export type LoggerFunction = (message: any, ...params: any[]) => void;

export type ColorObject = { foreground: number; background?: number };

export type LogColorPalette = {
  exception?: ColorObject;
  message?: ColorObject;
  treeArrow?: ColorObject;
  packageTrace?: ColorObject;
  projectTrace?: ColorObject;
  nodeTrace?: ColorObject;
};

export type FilledLogColorPalette = {
  exception: ColorObject;
  message: ColorObject;
  treeArrow: ColorObject;
  packageTrace: ColorObject;
  projectTrace: ColorObject;
  nodeTrace: ColorObject;
};

export type LovelyLogOptions = {
  logger?: LoggerFunction | null;
  colorize?: boolean;
  verbose?: boolean;
  colorPalette?: LogColorPalette;
};

// utility types
export type RequiredOptional<T> = {
  [K in keyof T]-?: T[K] extends undefined ? never : T[K];
};
