import {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
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
import {useLoginViewModel} from '../../../viewmodels/useLoginViewModel';
import {AuthTextField} from '../../components/auth/AuthTextField';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen = ({navigation, route}: LoginScreenProps) => {
  const {width, height} = useWindowDimensions();
  const passwordInputRef = useRef<TextInputInstance | null>(null);
  const prefilledEmail = useRef<string | null>(null);
  const {
    values,
    errors,
    formError,
    isSubmitting,
    setEmail,
    setPassword,
    handleEmailBlur,
    handlePasswordBlur,
    submit,
  } = useLoginViewModel();

  const registeredEmail = route.params?.registeredEmail;
  const registrationSuccess = route.params?.registrationSuccess;

  useEffect(() => {
    if (!registeredEmail || prefilledEmail.current === registeredEmail) {
      return;
    }

    prefilledEmail.current = registeredEmail;
    setEmail(registeredEmail);
  }, [registeredEmail, setEmail]);

  const isCompact = height < 720;
  const isNarrow = width < 360;
  const isTablet = width >= 768;
  const horizontalPadding = isNarrow
    ? spacing.lg
    : isTablet
      ? spacing.xxxl
      : spacing.xl;

  const handleSubmit = () => {
    Keyboard.dismiss();
    submit();
  };

  const showPasswordResetInfo = () => {
    Alert.alert(
      'Password reset unavailable',
      'Password recovery is not supported by the Neighbr server yet. Please contact your society administrator to reset your password.',
      [{text: 'Understood'}],
    );
  };

  const showRegistration = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
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
              paddingTop: isCompact ? spacing.lg : spacing.xxl,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View
              style={[
                styles.brandRow,
                isCompact && styles.brandRowCompact,
              ]}>
              <View style={styles.brandMark}>
                <Text style={styles.brandGlyph}>n</Text>
                <View style={styles.brandMarkDot} />
              </View>
              <View>
                <Text style={styles.brandName}>neighbr</Text>
                <Text style={styles.brandTagline}>YOUR COMMUNITY, CONNECTED</Text>
              </View>
            </View>

            <View
              style={[
                styles.hero,
                isCompact && styles.heroCompact,
              ]}>
              <View style={styles.eyebrowRow}>
                <View style={styles.eyebrowRule} />
                <Text style={styles.eyebrow}>RESIDENT ACCESS</Text>
              </View>
              <Text
                style={[styles.title, isCompact && styles.titleCompact]}
                accessibilityRole="header">
                Welcome back.
              </Text>
              <Text style={styles.subtitle}>
                Sign in to stay close to the people and places that make your
                neighbourhood feel like home.
              </Text>
            </View>

            <View style={[styles.card, isCompact && styles.cardCompact]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Sign in to your account</Text>
                <View style={styles.secureBadge}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={11}
                    color={colors.accentInk}
                  />
                  <Text style={styles.secureBadgeText}>SECURE</Text>
                </View>
              </View>

              {registrationSuccess ? (
                <View
                  style={styles.successBanner}
                  accessibilityLiveRegion="polite">
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={18}
                    color={colors.success}
                  />
                  <Text style={styles.successText}>{registrationSuccess}</Text>
                </View>
              ) : null}

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
                label="Email address"
                icon="mail-outline"
                value={values.email}
                onChangeText={setEmail}
                onBlur={handleEmailBlur}
                placeholder="you@example.com"
                error={errors.email}
                disabled={isSubmitting}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                maxLength={255}
                accessibilityHint="Enter the email address linked to your Neighbr account"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />

              <AuthTextField
                label="Password"
                icon="lock-closed-outline"
                labelAccessory={
                  <Pressable
                    onPress={showPasswordResetInfo}
                    disabled={isSubmitting}
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel="Forgot password"
                    accessibilityHint="Shows information about password recovery"
                    accessibilityState={{disabled: isSubmitting}}
                    style={({pressed}) => [
                      pressed && styles.linkPressed,
                      isSubmitting && styles.linkDisabled,
                    ]}>
                    <Text style={styles.forgotLink}>Forgot password?</Text>
                  </Pressable>
                }
                value={values.password}
                onChangeText={setPassword}
                onBlur={handlePasswordBlur}
                placeholder="Enter your password"
                error={errors.password}
                disabled={isSubmitting}
                isPassword
                inputRef={passwordInputRef}
                autoComplete="current-password"
                textContentType="password"
                returnKeyType="go"
                maxLength={72}
                accessibilityHint="Enter your account password"
                onSubmitEditing={handleSubmit}
              />

              <Pressable
                onPress={handleSubmit}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel={
                  isSubmitting ? 'Signing in' : 'Sign in to your account'
                }
                accessibilityHint="Submits your email and password"
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
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
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
                  Encrypted session, stored securely on this device
                </Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerPrompt}>
                New to the neighbourhood?
              </Text>
              <Pressable
                onPress={showRegistration}
                disabled={isSubmitting}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel="Create an account"
                accessibilityHint="Opens the account registration screen"
                accessibilityState={{disabled: isSubmitting}}
                style={({pressed}) => [
                  pressed && styles.linkPressed,
                  isSubmitting && styles.linkDisabled,
                ]}>
                <Text style={styles.footerLink}>Create an account</Text>
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  brandRowCompact: {
    marginBottom: spacing.xl,
  },
  brandMark: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  brandGlyph: {
    color: colors.white,
    fontFamily: fontFamilies.display,
    fontSize: 29,
    fontWeight: '700',
    lineHeight: 34,
    marginTop: -2,
  },
  brandMarkDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  brandName: {
    color: colors.ink,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 23,
  },
  brandTagline: {
    color: colors.muted,
    fontSize: fontSizes.micro,
    fontWeight: '600',
    letterSpacing: 1.15,
    marginTop: 2,
  },
  hero: {
    marginBottom: spacing.xxl,
  },
  heroCompact: {
    marginBottom: spacing.xl,
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
    maxWidth: 410,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    flexShrink: 1,
    color: colors.ink,
    fontSize: fontSizes.bodyLarge,
    fontWeight: '700',
    letterSpacing: -0.2,
    marginRight: spacing.sm,
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
  successBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: 'rgba(42, 107, 79, 0.18)',
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  successText: {
    flex: 1,
    color: colors.success,
    fontSize: fontSizes.small,
    lineHeight: 19,
    marginLeft: spacing.xs,
  },
  forgotLink: {
    color: colors.brand,
    fontSize: fontSizes.caption,
    fontWeight: '600',
    letterSpacing: 0.1,
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

export default LoginScreen;
