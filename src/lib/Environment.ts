declare const global: any;
declare const module: any;
declare const process: any;

const Environment = {
  hasWindow: typeof window !== "undefined",
  hasDocument: typeof document !== "undefined",
  hasGlobal: typeof global !== "undefined",
  hasModule: typeof module !== "undefined",
  hasProcess: typeof process !== "undefined",
};

Object.assign(Environment, {
  isNodejs: Environment.hasGlobal && Environment.hasProcess && Environment.hasModule,
  isBrowser: Environment.hasWindow && Environment.hasDocument,
  isNwjs: Environment.hasGlobal && Environment.hasProcess && Environment.hasModule && Environment.hasWindow && Environment.hasDocument,
});

export default Environment as Record<string,boolean>;