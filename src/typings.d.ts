declare module 'commitizen' {
  export namespace configLoader {
    export function load(): Options;
  }

  export type Options = {
    types: Record<string, { description: string }>;
  };

  export type Commit = (value: string) => void;
}

declare module 'conventional-commit-types' {
  export type CommitType = Record<string, { title: string; description: string }>;

  export const types: CommitType;
}
