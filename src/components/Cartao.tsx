import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTema } from '@/theme/tema';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  rotulo?: string;
};

export function Cartao({ children, onPress, rotulo }: Props) {
  const { cores } = useTema();
  const caixa = [estilos.cartao, { backgroundColor: cores.cartao, borderColor: cores.linha }];
  if (!onPress) {
    return <View style={caixa}>{children}</View>;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      onPress={onPress}
      style={({ pressed }) => [caixa, pressed && estilos.pressionado]}>
      {children}
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  pressionado: {
    opacity: 0.82,
  },
});
