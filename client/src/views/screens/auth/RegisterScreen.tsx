import {useRef} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type TextInputInstance,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../../navigation/types';
import {
  colors,
  fontFamilies,
  fontSizes,
  lineHeights,
  radii,
  spacing,
} from '../../../theme';
import {useRegisterViewModel} from '../../../viewmodels/useRegisterViewModel';
import {AuthTextField} from '../../components/auth/AuthTextField';

type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'Register'
>;

const RegisterScreen = ({navigation}: RegisterScreenProps) => {
  const {width, height} = useWindowDimensions();
  const emailInputRef = useRef<TextInputInstance | null>(null);
  const passwordInputRef = useRef<TextInputInstance | null>(null);
  const {
    values,
    errors,
    formError,
    isSubmitting,
    setFullName,
    setEmail,
    setPassword,
    handleBlur,
    submit,
  } = useRegisterViewModel();

  const isCompact = height < 720;
  const isNarrow = width < 360;
  const isTablet = width >= 768;
  const horizontalPadding = isNarrow
    ? spacing.lg
    : isTablet
      ? spacing.xxxl
      : spacing.xl;

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const result = await submit();

    if (!result) {
      return;
    }

    const separator = result.message.endsWith('.') ? ' ' : '. ';

    navigation.popTo('Login', {
      registrationSuccess: `${result.message}${separator}Sign in with ${result.user.email} to continue.`,
      registeredEmail: result.user.email,
    });
  };

  const goToLogin = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'right', 'bottom', 'left']}>
      <StatusBar barStyle="dark-content" />

      <View
        pointerEvents="none"
        style={styles.decorativeRing}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View
        pointerEvents="none"
        style={styles.decorativeGlow}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: isCompact ? spacing.md : spacing.lg,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.topBar}>
              <Pressable
                onPress={goToLogin}
                disabled={isSubmitting}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Go back to sign in"
                accessibilityHint="Returns to the sign in screen"
                accessibilityState={{disabled: isSubmitting}}
                style={({pressed}) => [
                  styles.backButton,
                  pressed && !isSubmitting && styles.backButtonPressed,
                  isSubmitting && styles.backButtonDisabled,
                ]}>
                <Ionicons name="arrow-back" size={19} color={colors.ink} />
              </Pressable>

              <View style={styles.brandLockup}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandGlyph}>n</Text>
                  <View style={styles.brandMarkDot} />
                </View>
                <Text style={styles.brandName}>neighbr</Text>
              </View>

              <View style={styles.topBarSpacer} />
            </View>

            <View style={[styles.hero, isCompact && styles.heroCompact]}>
              <View style={styles.eyebrowRow}>
                <View style={styles.eyebrowRule} />
                <Text style={styles.eyebrow}>RESIDENT REGISTRATION</Text>
              </View>
              <Text
                style={[styles.title, isCompact && styles.titleCompact]}
                accessibilityRole="header">
                Create account.
              </Text>
              <Text style={styles.subtitle}>
                Connect with the people and places that make your
                neighbourhood home.
              </Text>
            </View>

            <View style={[styles.card, isCompact && styles.cardCompact]}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderCopy}>
                  <Text style={styles.cardTitle}>Your details</Text>
                  <Text style={styles.cardSubtitle}>Use your real name.</Text>
                </View>
                <View style={styles.secureBadge}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={11}
                    color={colors.accentInk}
                  />
                  <Text style={styles.secureBadgeText}>PRIVATE</Text>
                </View>
              </View>

              {formError ? (
                <View
                  style={styles.formError}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite">
                  <Ionicons
                    name="alert-circle-outline"
                    size={18}
                    color={colors.error}
                  />
                  <Text style={styles.formErrorText}>{formError}</Text>
                </View>
              ) : null}

              <AuthTextField
                label="Full name"
                icon="person-outline"
                value={values.fullName}
                onChangeText={setFullName}
                onBlur={() => handleBlur('fullName')}
                placeholder="e.g. Ananya Sharma"
                error={errors.fullName}
                disabled={isSubmitting}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                returnKeyType="next"
                maxLength={150}
                accessibilityHint="Enter the full name you want your community to see"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />

              <AuthTextField
                label="Email address"
                icon="mail-outline"
                value={values.email}
                onChangeText={setEmail}
                onBlur={() => handleBlur('email')}
                placeholder="you@example.com"
                error={errors.email}
                disabled={isSubmitting}
                inputRef={emailInputRef}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                maxLength={255}
                accessibilityHint="Enter the email address you will use to sign in"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <AuthTextField
                label="Password"
                icon="lock-closed-outline"
                labelAccessory={
                  <Text style={styles.passwordHint}>8+ characters</Text>
                }
                value={values.password}
                onChangeText={setPassword}
                onBlur={() => handleBlur('password')}
                placeholder="Create a password"
                error={errors.password}
                disabled={isSubmitting}
                isPassword
                inputRef={passwordInputRef}
                autoComplete="new-password"
                textContentType="newPassword"
                returnKeyType="go"
                maxLength={72}
                accessibilityHint="Create a password of at least 8 characters"
                onSubmitEditing={handleSubmit}
              />

              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={
                  isSubmitting ? 'Creating your account' : 'Create account'
                }
                accessibilityHint="Creates your Neighbr account"
                accessibilityState={{
                  disabled: isSubmitting,
                  busy: isSubmitting,
                }}
                style={({pressed}) => [
                  styles.submitButton,
                  pressed && !isSubmitting && styles.submitButtonPressed,
                  isSubmitting && styles.submitButtonBusy,
                ]}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : null}
                <Text style={styles.submitText}>
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </Text>
                {!isSubmitting ? (
                  <View style={styles.submitArrow}>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={colors.white}
                    />
                  </View>
                ) : null}
              </Pressable>

              <View style={styles.trustRow}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={15}
                  color={colors.muted}
                />
                <Text style={styles.trustText}>
                  Your password is securely hashed
                </Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>Already have an account?</Text>
              <Pressable
                onPress={goToLogin}
                disabled={isSubmitting}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Sign in to your account"
                accessibilityHint="Returns to the sign in screen"
                accessibilityState={{disabled: isSubmitting}}
                style={({pressed}) => [
                  pressed && styles.linkPressed,
                  isSubmitting && styles.linkDisabled,
                ]}>
                <Text style={styles.footerLink}>Sign in</Text>
              </Pressable>
            </View>

            <View style={styles.spacer} />

            <View style={styles.metaRow}>
              <View style={styles.metaRule} />
              <Text style={styles.metaText}>NEIGHBR · COMMUNITY LIVING</Text>
              <View style={styles.metaRule} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    flexGrow: 1,
  },
  decorativeRing: {
    position: 'absolute',
    top: -120,
    right: -110,
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(28, 74, 56, 0.11)',
  },
  decorativeGlow: {
    position: 'absolute',
    bottom: -130,
    left: -110,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.accentSoft,
    opacity: 0.55,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.surfaceSunken,
    transform: [{scale: 0.97}],
  },
  backButtonDisabled: {
    opacity: 0.45,
  },
  brandLockup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  brandGlyph: {
    color: colors.white,
    fontFamily: fontFamilies.display,
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 25,
    marginTop: -2,
  },
  brandMarkDot: {
    position: 'absolute',
    top: 6,
    right: 7,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
  },
  brandName: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  topBarSpacer: {
    width: 42,
  },
  hero: {
    marginBottom: spacing.xl,
  },
  heroCompact: {
    marginBottom: spacing.md,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  eyebrowRule: {
    width: 24,
    height: StyleSheet.hairlineWidth * 2,
    backgroundColor: colors.accent,
    marginRight: spacing.xs,
  },
  eyebrow: {
    color: colors.accentInk,
    fontSize: fontSizes.micro,
    fontWeight: '700',
    letterSpacing: 1.55,
  },
  title: {
    color: colors.ink,
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.display,
    lineHeight: fontSizes.display * lineHeights.heading,
    fontWeight: '700',
    letterSpacing: -1.1,
  },
  titleCompact: {
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.muted,
    fontSize: fontSizes.body,
    lineHeight: fontSizes.body * lineHeights.body,
    marginTop: spacing.sm,
    maxWidth: 430,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(199, 206, 197, 0.6)',
    padding: spacing.xl,
    shadowColor: '#16241C',
    shadowOffset: {width: 0, height: 14},
    shadowOpacity: 0.07,
    shadowRadius: 28,
    elevation: 6,
  },
  cardCompact: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardHeaderCopy: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    color: colors.ink,
    fontSize: fontSizes.bodyLarge,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  cardSubtitle: {
    color: colors.muted,
    fontSize: fontSizes.caption,
    lineHeight: 18,
    marginTop: 3,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.xs + 1,
    paddingVertical: 5,
  },
  secureBadgeText: {
    color: colors.accentInk,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginLeft: 4,
  },
  formError: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.errorSoft,
    borderWidth: 1,
    borderColor: 'rgba(169, 58, 52, 0.18)',
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  formErrorText: {
    flex: 1,
    color: colors.errorDeep,
    fontSize: fontSizes.small,
    lineHeight: 19,
    marginLeft: spacing.xs,
  },
  passwordHint: {
    color: colors.mutedLight,
    fontSize: fontSizes.caption,
    fontWeight: '500',
  },
  submitButton: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brand,
    borderRadius: radii.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.brandDeep,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  submitButtonPressed: {
    backgroundColor: colors.brandDeep,
    transform: [{scale: 0.995}],
  },
  submitButtonBusy: {
    backgroundColor: colors.brandDeep,
    opacity: 0.9,
  },
  submitText: {
    color: colors.white,
    fontSize: fontSizes.body,
    fontWeight: '700',
    letterSpacing: 0.15,
    marginLeft: spacing.xs,
  },
  submitArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
  },
  trustText: {
    color: colors.muted,
    fontSize: fontSizes.caption,
    lineHeight: 17,
    marginLeft: spacing.xxs + 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
  },
  footerPrompt: {
    color: colors.muted,
    fontSize: fontSizes.small,
    marginRight: spacing.xxs + 2,
  },
  footerLink: {
    color: colors.brand,
    fontSize: fontSizes.small,
    fontWeight: '700',
  },
  linkPressed: {
    opacity: 0.55,
  },
  linkDisabled: {
    opacity: 0.4,
  },
  spacer: {
    flexGrow: 1,
    minHeight: spacing.xl,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  metaRule: {
    width: 24,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderStrong,
  },
  metaText: {
    color: colors.mutedLight,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.35,
    marginHorizontal: spacing.xs + 2,
  },
});

export default RegisterScreen;
