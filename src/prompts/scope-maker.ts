import type { QualifiedRules } from '@commitlint/types';
import { RuleConfigSeverity } from '@commitlint/types';
import type { ChoiceOptions } from 'inquirer';
import { whenFactory } from '../when';
import { caseValidator, emptyValidator, maxLengthValidator, minLengthValidator, validate } from '../validators';
import { wordCaseFilter } from '../filters';
import type { Question } from '../commit-template';

export function validatorFactory(rules: QualifiedRules): (value: string) => string | true {
  return (value: string) => {
    return validate([
      {
        value,
        rule: rules['scope-max-length'],
        validator: maxLengthValidator,
        message: length => `Scope maximum length of ${length} has been exceeded`,
      },
      {
        value,
        rule: rules['scope-min-length'],
        validator: minLengthValidator,
        message: length => `Scope minimum length of ${length} has not been met`,
      },
      {
        value,
        rule: rules['scope-empty'],
        validator: emptyValidator,
        message: () => 'Scope cannot be empty',
      },
      {
        value,
        rule: rules['scope-case'],
        validator: caseValidator,
        message: (ruleValue, applicable) => `Scope must ${applicable == 'never' ? 'not ' : ''}be in ${ruleValue}`,
      },
    ]);
  };
}

function parseEmptyScopeRule(rule: QualifiedRules['scope-empty']): [boolean, ChoiceOptions | undefined] {
  const skipChoice: ChoiceOptions = { name: ':skip', value: '' };
  if (rule !== undefined) {
    const [level, applicability] = rule;
    if (level === RuleConfigSeverity.Error) {
      if (applicability === 'always') {
        return [true, skipChoice];
      }
      return [false, undefined];
    }
  }
  return [true, skipChoice];
}

function parseScopeEnumRule(rule: QualifiedRules['scope-enum']): [boolean, ChoiceOptions[] | undefined] {
  if (rule !== undefined) {
    const [, , scopeEnum] = rule;
    return [true, (scopeEnum ?? []).map(scope => ({ name: scope, value: scope }))];
  }
  return [false, undefined];
}

export function choicesFactory(rules: QualifiedRules): ChoiceOptions[] | undefined {
  const choices: ChoiceOptions[] = [];

  const [containsSkipChoice, skipChoice] = parseEmptyScopeRule(rules['scope-empty']);
  if (containsSkipChoice) {
    choices.push(skipChoice as ChoiceOptions);
  }

  const [containsScopeEnumChoices, scopeEnumChoices] = parseScopeEnumRule(rules['scope-enum']);
  if (containsScopeEnumChoices) {
    choices.unshift(...(scopeEnumChoices as ChoiceOptions[]));
  }

  return choices;
}

export function filterFactory(rules: QualifiedRules): (value: string) => string {
  return (value: string) => wordCaseFilter(value, rules['scope-case']);
}

export function scopeMaker(questions: Question[], rules: QualifiedRules): Question[] {
  const name = 'scope';
  const message = 'What is the scope of this change:\n';
  const when = whenFactory(rules['scope-enum'], rules['scope-empty']);
  const choices = choicesFactory(rules);

  let question: Question;
  if (choices) {
    question = {
      name,
      message,
      when,
      validate: validatorFactory(rules),
      filter: filterFactory(rules),
      choices,
      type: 'list',
    };
  } else {
    question = {
      name,
      message,
      when,
      validate: validatorFactory(rules),
      filter: filterFactory(rules),
      type: 'input',
    };
  }

  return [...questions, question];
}
