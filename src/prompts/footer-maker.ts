import { Rules } from '@commitlint/load';
import { DistinctQuestion, Answers } from 'inquirer';
import { valueFromRule } from '../utils';
import { PromptAnswers } from '../commit-template';
import { validate, maxLengthValidator, minLengthValidator } from '../validators';

export function validatorFactory(rules: Rules) {
  return (value: string) =>
    validate([
      {
        value,
        rule: rules['footer-max-length'],
        validator: maxLengthValidator,
        message: length => `Body maximum length of ${length} has been exceeded`
      },
      {
        value,
        rule: rules['footer-min-length'],
        validator: minLengthValidator,
        message: length => `Subject minimum length of ${length} has not been met`
      }
    ]);
}

function breakingChangeMessageFactory(rules: Rules) {
  return (answers: Answers) => {
    const maxLength = valueFromRule(rules['footer-max-length']);

    if (!maxLength) {
      return `Describe the breaking changes:\n:\n`;
    }

    return `Describe the breaking changes:\n (max ${maxLength} chars):\n`;
  };
}

export function footerMaker(questions: DistinctQuestion[], rules: Rules): DistinctQuestion[] {
  const breakingQuestions: DistinctQuestion<PromptAnswers>[] = [
    {
      type: 'confirm',
      name: 'isBreaking',
      message: 'Are there any breaking changes?',
      default: false
    },
    {
      type: 'input',
      name: 'beaking',
      message: breakingChangeMessageFactory(rules),
      when: answers => !!answers.isBreaking,
      validate: validatorFactory(rules)
    }
  ];

  return [...questions, ...breakingQuestions];
}
