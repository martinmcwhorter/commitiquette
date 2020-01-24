declare module '@commitlint/load' {
  export const enum Level {
    Disable = 0,
    Warn = 1,
    Error = 2
  }

  export type Case =
    | 'lower-case'
    | 'upper-case'
    | 'camel-case'
    | 'kebab-case'
    | 'pascal-case'
    | 'sentence-case'
    | 'start-case';

  export type Applicability = 'always' | 'never';

  export type Rule<T> = [Level, Applicability, T];

  export type Rules = {
    'body-leading-blank'?: Rule<undefined>;
    'body-max-length'?: Rule<number>;
    'body-max-line-number'?: Rule<number>;
    'body-min-length'?: Rule<number>;
    'footer-leading-blank'?: Rule<void>;
    'footer-max-length'?: Rule<number>;
    'footer-min-length'?: Rule<number>;
    'header-case'?: Rule<Case | Case[]>;
    'header-full-stop'?: Rule<string>;
    'header-max-length'?: Rule<number>;
    'header-min-length'?: Rule<number>;
    'references-empty'?: Rule<void>;
    'scope-enum'?: Rule<string[]>;
    'scope-case'?: Rule<Case | Case[]>;
    'scope-empty'?: Rule<void>;
    'scope-max-length'?: Rule<number>;
    'scope-min-length'?: Rule<number>;
    'subject-case'?: Rule<Case>;
    'subject-empty'?: Rule<void>;
    'subject-full-stop'?: Rule<string>;
    'subject-max-length'?: Rule<number>;
    'subject-min-length'?: Rule<number>;
    'type-enum'?: Rule<string[]>;
    'type-case'?: Rule<Case | Case[]>;
    'type-empty'?: Rule<void>;
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

// declare module 'inquirer' {

//   export type Choice = {
//     name: string,
//     value: string ,
//     short?: string
//   } | string | number;

//   export type Value = string | number | boolean | string[] | number[] | null;
//   export type Answers = Record<string, Value>;

//   export type Question<T extends Answers = {}, U extends Value = any> = {
//     type?: 'input' | 'number' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox' | 'password' | 'editor',
//     name: string,
//     message?: ((answers: T) => boolean) | string,
//     default?: Value | ((answers: T) => Value),
//     choices?: number[] | string[] | Choice[],
//     validate?: (value: U, answers: any) => boolean | string,
//     filter?: (value: U) => U,
//     transformer?: (value: U, answers: T) => U,
//     when?: (answers: any) => boolean
//   };

//   export type Prompt = <T extends Answers = {}>(questions: Question<T>[]) => Promise<T>;
//   export let prompt: Prompt;

//   export type Commit = (value: string) => void;
// }

declare module 'conventional-commit-types' {
  export type CommitType = Record<string, { title: string; description: string }>;

  export const types: CommitType;
}
