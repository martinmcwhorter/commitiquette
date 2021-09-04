import { QualifiedRules, RuleConfigSeverity } from '@commitlint/types';
import { green, red } from 'chalk';
import {
  breakingChangeFilterFactory,
  breakingChangeMessageFactory,
  breakingTransformFactory,
  issueFilterFactory,
  issuesMessageFactory,
  issuesTransformerFactory,
} from './footer-maker';

describe('footerMaker', () => {
  describe('breakingChangeFilterFactory', () => {
    it('should break in footer when exceeding maximum specified line length', () => {
      const rules: QualifiedRules = { 'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 11] };
      const fixture = breakingChangeFilterFactory(rules, 'BREAKING CHANGE: ')!;

      const result = fixture('Lorem ipsum dolor sit amet, consectetur adipisicing elit.', {});

      expect(result).toBe(`BREAKING \nCHANGE: \nLorem ipsum \ndolor sit \namet, \nconsectetur \nadipisicing \nelit.`);
    });
  });

  describe('issueFilterFactory', () => {
    it('should add leading blank line before issue line if is breaking change', () => {
      const rules = {};

      const fixture = issueFilterFactory(rules)!;

      const result = fixture('Closes #123', { isBreaking: true });
      expect(result).toBe('\nCloses #123');
    });
  });

  describe('breakingChangeMessageFactory', () => {
    it('should show a message when footer has maximum length rule', () => {
      const rules: QualifiedRules = { 'footer-max-length': [RuleConfigSeverity.Error, 'always', 50] };

      const fixture = breakingChangeMessageFactory(rules);

      const result = fixture();
      expect(result).toBe('Describe the breaking changes (max 50 chars):\n');
    });
  });

  describe('issuesMessageFactory', () => {
    it('should show a message when footer has maximum length rule', () => {
      const rules: QualifiedRules = { 'footer-max-length': [RuleConfigSeverity.Error, 'always', 88] };

      const fixture = issuesMessageFactory(rules);

      const result = fixture();
      expect(result).toBe('Add issue references (e.g. "fix #123", "re #123".) (max 88 chars):\n');
    });
  });

  describe('breakingTransformFactory', () => {
    it('should show a message in red color when footer has maximum length rule', () => {
      const rules: QualifiedRules = { 'footer-max-length': [RuleConfigSeverity.Error, 'always', 88] };

      const fixture = breakingTransformFactory(rules, 'BREAKING CHANGE: ');

      const result = fixture(
        'The coverage has decreased with this PR, please add tests for the additional functions to at least bring the coverage to the same percentage.'
      );
      expect(result).toBe(
        red(
          '(141) The coverage has decreased with this PR, please add tests for the additional functions to at least bring the coverage to the same percentage.'
        )
      );
    });
  });

  describe('issuesTransformerFactory', () => {
    describe('with a breaking change', () => {
      it('should show a message in green color when footer has maximum length rule', () => {
        const rules: QualifiedRules = { 'footer-max-length': [RuleConfigSeverity.Error, 'always', 60] };

        const fixture = issuesTransformerFactory(rules);

        const result = fixture("If you haven't seen Game of Thrones, go watch it right now.", {
          isBreaking: true,
          breaking: 'Some big change',
        });
        expect(result).toBe(green("(59) If you haven't seen Game of Thrones, go watch it right now."));
      });
    });

    describe('without a breaking change', () => {
      it('should show a message in red color when footer has maximum length rule', () => {
        const rules: QualifiedRules = { 'footer-max-length': [RuleConfigSeverity.Error, 'always', 88] };

        const fixture = issuesTransformerFactory(rules);

        const result = fixture(
          "If you haven't seen Game of Thrones, go watch it right now. If you have then you'll totally get why this Hodor themed lorem ipsum generator is just brilliant.",
          { isBreaking: false }
        );
        expect(result).toBe(
          red(
            "(158) If you haven't seen Game of Thrones, go watch it right now. If you have then you'll totally get why this Hodor themed lorem ipsum generator is just brilliant."
          )
        );
      });
    });
  });
});
