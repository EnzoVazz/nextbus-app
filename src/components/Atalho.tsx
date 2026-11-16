import { Pressable, StyleSheet } from 'react-native';

import { Texto } from '@/components/Texto';
import { useTema } from '@/theme/tema';

type Props = {
  titulo: string;
  detalhe: string;
  onPress: () => void;
};

export function Atalho({ titulo, detalhe, onPress }: Props) {
  const { cores } = useTema();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.atalho,
        { backgroundColor: cores.cartao, borderColor: cores.linha },
        pressed && estilos.pressionado,
      ]}>
      <Texto variante="forte">{titulo}</Texto>
      <Texto variante="miudo">{detalhe}</Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  atalho: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    gap: 4,
  },
  pressionado: {
    opacity: 0.82,
  },
});
