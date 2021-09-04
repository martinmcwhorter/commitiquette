import { QualifiedRules, RuleConfigSeverity } from '@commitlint/types';
import { breakingChangeFilterFactory } from './footer-maker';

describe('footerMaker', () => {
  describe('breakingChangeFilterFactory', () => {
    it('should break in footer when exceeding maximum specified line length', () => {
      const rules: QualifiedRules = { 'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 11] };
      const fixture = breakingChangeFilterFactory(rules, 'BREAKING CHANGE: ')!;

      const result = fixture('Lorem ipsum dolor sit amet, consectetur adipisicing elit.', {});

      expect(result).toBe(`BREAKING \nCHANGE: \nLorem ipsum \ndolor sit \namet, \nconsectetur \nadipisicing \nelit.`);
    });
  });
});
