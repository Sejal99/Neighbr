import {
  useState,
  type ComponentProps,
  type ReactNode,
  type RefObject,
} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import {
  colors,
  fontSizes,
  radii,
  spacing,
} from '../../../theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type AuthTextFieldProps = {
  label: string;
  icon: IoniconName;
  labelAccessory?: ReactNode;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  onBlur: () => void;
  inputRef?: RefObject<TextInputInstance | null>;
  error?: string;
  disabled?: boolean;
  isPassword?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  returnKeyType?: TextInputProps['returnKeyType'];
  onSubmitEditing?: TextInputProps['onSubmitEditing'];
  autoFocus?: boolean;
  maxLength?: number;
  accessibilityHint?: string;
};

export const AuthTextField = ({
  label,
  icon,
  labelAccessory,
  value,
  placeholder,
  onChangeText,
  onBlur,
  inputRef,
  error,
  disabled = false,
  isPassword = false,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
  autoFocus = false,
  maxLength,
  accessibilityHint,
}: AuthTextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasError = Boolean(error);

  const iconColor = hasError
    ? colors.error
    : isFocused
      ? colors.brand
      : colors.mutedLight;

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {labelAccessory}
      </View>

      <View
        style={[
          styles.inputShell,
          isFocused && styles.inputShellFocused,
          hasError && styles.inputShellError,
          disabled && styles.inputShellDisabled,
        ]}>
        <View style={styles.leadingIcon}>
          <Ionicons name={icon} size={19} color={iconColor} />
        </View>

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.mutedLight}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={false}
          autoComplete={autoComplete}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          autoFocus={autoFocus}
          maxLength={maxLength}
          editable={!disabled}
          selectionColor={colors.brand}
          accessibilityLabel={label}
          accessibilityHint={error ?? accessibilityHint}
          accessibilityState={{disabled}}
          style={styles.input}
        />

        {isPassword ? (
          <Pressable
            onPress={() => setIsPasswordVisible(previousValue => !previousValue)}
            hitSlop={12}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
            accessibilityHint="Toggles whether your password is visible"
            accessibilityState={{disabled}}
            style={({pressed}) => [
              styles.visibilityToggle,
              pressed && styles.visibilityTogglePressed,
            ]}>
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={isPasswordVisible ? colors.brand : colors.muted}
            />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.errorSlot}>
        {error ? (
          <Text
            style={styles.errorText}
            accessibilityLiveRegion="polite"
            accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: spacing.xs,
  },
  labelRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.inkSoft,
    fontSize: fontSizes.small,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  inputShell: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  inputShellFocused: {
    borderColor: colors.brand,
    backgroundColor: '#FCFDFB',
  },
  inputShellError: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
  inputShellDisabled: {
    backgroundColor: colors.surfaceSunken,
    borderColor: colors.border,
  },
  leadingIcon: {
    width: 22,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 56,
    paddingVertical: 0,
    color: colors.ink,
    fontSize: fontSizes.body,
  },
  visibilityToggle: {
    width: 36,
    height: 44,
    marginRight: -spacing.xs,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  visibilityTogglePressed: {
    opacity: 0.55,
  },
  errorSlot: {
    minHeight: 18,
    marginTop: spacing.xxs + 1,
    justifyContent: 'center',
  },
  errorText: {
    color: colors.errorDeep,
    fontSize: fontSizes.caption,
    lineHeight: 16,
  },
});
