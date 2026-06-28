import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { BottomSheet, Button, Input, Text } from "@/components/ui";
import { spacing } from "@/theme";
import { TrustedSenderInput } from "../trustedSenders.api";

interface Props {
  visible: boolean;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (input: TrustedSenderInput) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Hoja inferior para registrar un nuevo remitente confiable. */
export function AddSenderModal({
  visible,
  submitting,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  function reset() {
    setName("");
    setEmail("");
    setError(undefined);
  }

  function handleSubmit() {
    if (!name.trim())
      return setError('Ponle un nombre, por ejemplo "BAC Costa Rica".');
    if (!EMAIL_RE.test(email.trim()))
      return setError("Ingresa un correo válido.");
    onSubmit({
      display_name: name.trim(),
      email_address: email.trim().toLowerCase(),
    });
    reset();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <Text variant="h3">Nuevo remitente</Text>
      <Text variant="body" color="textSecondary">
        Registra el correo desde el que tu banco envía las notificaciones.
      </Text>

      <View style={styles.form}>
        <Input
          label="Nombre"
          placeholder="BAC Costa Rica"
          value={name}
          onChangeText={(t) => {
            setName(t);
            setError(undefined);
          }}
        />
        <Input
          label="Correo del remitente"
          placeholder="notificacion@notificacionesbaccr.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            setError(undefined);
          }}
          error={error}
        />
      </View>

      <Button
        label="Guardar remitente"
        fullWidth
        loading={submitting}
        onPress={handleSubmit}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md, marginVertical: spacing.sm },
});
