import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { colors, fontFamily, fontSize, radius, spacing } from "@/theme";
import { Text } from "./Text";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

/** Campo de texto con etiqueta y foco resaltado, consistente con la marca. */
export function Input({ label, error, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label ? (
        <Text variant="label" color="textSecondary">
          {label}
        </Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          focused && styles.focused,
          error && styles.errored,
          style,
        ]}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {error ? (
        <Text variant="caption" color="danger">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.semibold,
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  focused: { borderColor: colors.primary },
  errored: { borderColor: colors.danger },
});
