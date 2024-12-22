declare module '*.txt' {
  const text: string;
  export = text;
}

declare global {
  const input: string;

  interface Array2d<T> extends Array<T[]> {}
  interface Array3d<T> extends Array<T[][]> {}

  interface Point {
    x: number;
    y: number;
  }

  interface Point3d extends Point {
    z: number;
  }

  type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
  };

  interface Object {
    str: `${number},${number}`;
  }
}

export {};
