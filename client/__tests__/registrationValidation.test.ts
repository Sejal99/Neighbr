import {
  validateFullName,
  validateRegistrationForm,
  validateRegistrationPassword,
} from '../src/viewmodels/registrationValidation';

describe('registration validation', () => {
  describe('validateFullName', () => {
    it('accepts a normal name and ignores surrounding whitespace', () => {
      expect(validateFullName('  Ananya Sharma  ')).toBeUndefined();
    });

    it('requires a full name of at least two characters', () => {
      expect(validateFullName('')).toBe('Enter your full name.');
      expect(validateFullName('   ')).toBe('Enter your full name.');
      expect(validateFullName(' A ')).toBe(
        'Your full name must be at least 2 characters.',
      );
    });

    it('rejects names longer than the API limit', () => {
      expect(validateFullName('a'.repeat(151))).toBe(
        'Full name must be 150 characters or fewer.',
      );
    });
  });

  describe('validateRegistrationPassword', () => {
    it('requires a password', () => {
      expect(validateRegistrationPassword('')).toBe('Create a password.');
    });

    it('rejects passwords shorter than the API minimum', () => {
      expect(validateRegistrationPassword('1234567')).toBe(
        'Use at least 8 characters for your password.',
      );
    });

    it('accepts a password within the API limits', () => {
      expect(
        validateRegistrationPassword('correct horse battery staple'),
      ).toBeUndefined();
    });

    it('rejects passwords longer than the API limit', () => {
      expect(validateRegistrationPassword('a'.repeat(73))).toBe(
        'Password must be 72 characters or fewer.',
      );
    });
  });

  describe('validateRegistrationForm', () => {
    it('returns every field error for an empty form', () => {
      expect(
        validateRegistrationForm({fullName: '', email: '', password: ''}),
      ).toEqual({
        fullName: 'Enter your full name.',
        email: 'Enter your email address.',
        password: 'Create a password.',
      });
    });

    it('returns no errors for a valid form', () => {
      expect(
        validateRegistrationForm({
          fullName: 'Ananya Sharma',
          email: 'ananya@neighbr.app',
          password: 'correct horse battery staple',
        }),
      ).toEqual({});
    });
  });
});
