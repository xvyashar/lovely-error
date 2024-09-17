export type LoggerFunction = (message: string, ...params: any[]) => void;

export type LovelyErrorOptions = {
  error?: Error | null;
  logger?: LoggerFunction;
};

export type LovelyStackOptions = {
  includePackageTrace?: boolean;
  logNodeTrace?: boolean;
  colorizeLog?: boolean;
};

export type LovelyTreeElement = {
  method: string;
  class: string;
  location: string;
  line: string;
  column: string;
};

export type ExtractMessageOutput = {
  exception: string;
  message: string;
};

export type ExtractTraceOutput = {
  trace: LovelyTreeElement[];
  packageTrace: LovelyTreeElement[];
  projectTrace: LovelyTreeElement[];
};

export type LovelyStack = ExtractMessageOutput &
  ExtractTraceOutput & {
    stringTrace?: string;
  };
