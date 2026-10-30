import {
  validateEmail,
  validateLoginForm,
  validatePassword,
} from '../src/viewmodels/loginValidation';

describe('login validation', () => {
  describe('validateEmail', () => {
    it('accepts a valid address and ignores surrounding whitespace', () => {
      expect(validateEmail('  resident@neighbr.app  ')).toBeUndefined();
    });

    it('requires an email address', () => {
      expect(validateEmail('')).toBe('Enter your email address.');
      expect(validateEmail('   ')).toBe('Enter your email address.');
    });

    it('rejects malformed addresses', () => {
      expect(validateEmail('resident')).toBe('Enter a valid email address.');
      expect(validateEmail('resident@neighbr')).toBe(
        'Enter a valid email address.',
      );
      expect(validateEmail('resident @neighbr.app')).toBe(
        'Enter a valid email address.',
      );
    });

    it('rejects addresses longer than the API limit', () => {
      expect(validateEmail(`${'a'.repeat(250)}@neighbr.app`)).toBe(
        'Email address must be 255 characters or fewer.',
      );
    });
  });

  describe('validatePassword', () => {
    it('requires a password', () => {
      expect(validatePassword('')).toBe('Enter your password.');
    });

    it('accepts a password within the API limit', () => {
      expect(validatePassword('correct horse battery staple')).toBeUndefined();
    });

    it('rejects passwords longer than the API limit', () => {
      expect(validatePassword('a'.repeat(73))).toBe(
        'Password must be 72 characters or fewer.',
      );
    });
  });

  describe('validateLoginForm', () => {
    it('returns both field errors for an empty form', () => {
      expect(validateLoginForm({email: '', password: ''})).toEqual({
        email: 'Enter your email address.',
        password: 'Enter your password.',
      });
    });

    it('returns no errors for a complete form', () => {
      expect(
        validateLoginForm({
          email: 'resident@neighbr.app',
          password: 'correct horse battery staple',
        }),
      ).toEqual({});
    });
  });
});
