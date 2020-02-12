declare module '@commitlint/load' {
  export const enum Level {
    Disable = 0,
    Warn = 1,
    Error = 2
  }

  export type Case =
    | 'lower-case'
    | 'lowercase'
    | 'lowerCase'
    | 'upper-case'
    | 'uppercase'
    | 'camel-case'
    | 'kebab-case'
    | 'pascal-case'
    | 'sentence-case'
    | 'sentencecase'
    | 'start-case'
    | 'snake-case';

  export type Applicability = 'always' | 'never';

  export type Rule<T> = [Level, Applicability, T];

  export type Rules = {
    'body-leading-blank'?: Rule<undefined>;
    'body-max-length'?: Rule<number>;
    'body-max-line-length'?: Rule<number>;
    'body-min-length'?: Rule<number>;
    'footer-leading-blank'?: Rule<undefined>;
    'footer-max-length'?: Rule<number>;
    'footer-min-length'?: Rule<number>;
    'footer-max-line-length'?: Rule<number>;
    'header-case'?: Rule<Case>;
    'header-full-stop'?: Rule<string>;
    'header-max-length'?: Rule<number>;
    'header-min-length'?: Rule<number>;
    'references-empty'?: Rule<undefined>;
    'scope-enum'?: Rule<string[]>;
    'scope-case'?: Rule<Case>;
    'scope-empty'?: Rule<undefined>;
    'scope-max-length'?: Rule<number>;
    'scope-min-length'?: Rule<number>;
    'subject-case'?: Rule<Case | Case[]>;
    'subject-empty'?: Rule<undefined>;
    'subject-full-stop'?: Rule<string>;
    'subject-max-length'?: Rule<number>;
    'subject-min-length'?: Rule<number>;
    'type-enum'?: Rule<string[]>;
    'type-case'?: Rule<Case>;
    'type-empty'?: Rule<undefined>;
    'type-max-length'?: Rule<number>;
    'type-min-length'?: Rule<number>;
    'signed-off-by'?: Rule<string>;
  };

  export type CommitlintConfig = {
    extends?: string[];
    rules: Rules;
  };

  export default function commitlintLoad(): Promise<CommitlintConfig>;
}

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
