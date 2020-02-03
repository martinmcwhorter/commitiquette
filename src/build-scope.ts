import { Rules } from '@commitlint/load';
import { DistinctQuestion } from 'inquirer';
import { whenFactory } from './when';
import { validate, emptyValidator, maxLengthValidator, minLengthValidator, caseValidator } from './validators';
import { wordCaseFilter } from './filters';

export function buildScope(rules: Rules, questions: DistinctQuestion[]): DistinctQuestion[] {
  let choices: string[] | undefined;
  if (rules['scope-enum']) {
    const [, , scopeEnum] = rules['scope-enum'];
    if (scopeEnum && scopeEnum.length > 0) {
      choices = scopeEnum;
    }
  }

  const validateScope = (value: string) => {
    return validate([
      {
        value,
        rule: rules['scope-empty'],
        validator: emptyValidator,
        message: () => 'Scope of commit must be supplied'
      },
      {
        value,
        rule: rules['scope-max-length'],
        validator: maxLengthValidator,
        message: length => `Scope maximum length of ${length} has been exceeded`
      },
      {
        value,
        rule: rules['scope-min-length'],
        validator: minLengthValidator,
        message: length => `Scope minimum length of ${length} has not been met`
      },
      {
        value,
        rule: rules['scope-empty'],
        validator: emptyValidator,
        message: () => 'Scope cannot be empty'
      },
      {
        value,
        rule: rules['type-case'],
        validator: caseValidator,
        message: (ruleValue, applicable) =>
          `Scope must ${applicable == 'never' ? 'not' : 'ruleValue'} be in ${ruleValue}`
      }
    ]);
  };

  const name = 'scope';
  const message = 'What is the scope of this change:\n';
  const when = whenFactory(rules['scope-enum'], rules['scope-empty']);
  const filter = (value: string) => wordCaseFilter(value, rules['scope-case']);

  let question: DistinctQuestion;
  if (choices) {
    question = {
      name,
      message,
      when,
      validate: validateScope,
      filter,
      choices,
      type: 'list'
    };
  } else {
    question = {
      name,
      message,
      when,
      validate: validateScope,
      filter,
      type: 'input'
    };
  }

  return [...questions, question];
}
