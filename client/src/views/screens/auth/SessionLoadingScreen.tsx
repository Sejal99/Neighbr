import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  colors,
  fontFamilies,
  fontSizes,
  spacing,
} from '../../../theme';

const SessionLoadingScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View
        pointerEvents="none"
        style={styles.decorativeRing}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={styles.content}>
        <View style={styles.brandMark}>
          <Text style={styles.brandGlyph}>n</Text>
        </View>
        <Text style={styles.brandName}>neighbr</Text>
        <ActivityIndicator
          size="small"
          color={colors.brand}
          style={styles.spinner}
          accessibilityLabel="Restoring your session"
        />
        <Text
          style={styles.message}
          accessibilityLiveRegion="polite"
          accessibilityRole="text">
          Restoring your session
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
    overflow: 'hidden',
  },
  decorativeRing: {
    position: 'absolute',
    top: -140,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(28, 74, 56, 0.1)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  brandMark: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandGlyph: {
    color: colors.white,
    fontFamily: fontFamilies.display,
    fontSize: 36,
    fontWeight: '700',
    lineHeight: 42,
    marginTop: -2,
  },
  brandName: {
    color: colors.ink,
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.title,
    fontWeight: '700',
    letterSpacing: -0.6,
    marginTop: spacing.md,
  },
  spinner: {
    marginTop: spacing.xxl,
  },
  message: {
    color: colors.muted,
    fontSize: fontSizes.small,
    letterSpacing: 0.2,
    marginTop: spacing.sm,
  },
});

export default SessionLoadingScreen;
