import { QualifiedRules, RuleConfigSeverity } from '@commitlint/types';
import { breakingChangeFilterFactory, issueFilterFactory } from './footer-maker';

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
});
