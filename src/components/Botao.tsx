import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { Texto } from '@/components/Texto';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

type Variante = 'primario' | 'secundario' | 'perigo' | 'fantasma';

type Props = {
  rotulo: string;
  onPress: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
};

export function Botao({
  rotulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
}: Props) {
  const { cores } = useTema();
  const parado = desabilitado || carregando;
  const claro = variante === 'primario' || variante === 'perigo';
  const fundo =
    variante === 'primario' ? cores.pinho : variante === 'perigo' ? cores.perigo : variante === 'secundario' ? cores.cartao : 'transparent';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: parado, busy: carregando }}
      disabled={parado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        { backgroundColor: fundo },
        variante === 'secundario' && { borderWidth: 1, borderColor: cores.linha },
        parado && estilos.parado,
        pressed && !parado && estilos.pressionado,
      ]}>
      {carregando ? <ActivityIndicator color={claro ? cores.branco : cores.pinho} /> : null}
      <Texto style={[estilos.rotulo, { color: claro ? cores.branco : cores.pinho }]}>
        {carregando ? 'Aguarde…' : rotulo}
      </Texto>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  parado: {
    opacity: 0.55,
  },
  pressionado: {
    opacity: 0.82,
  },
  rotulo: {
    fontFamily: fontes.textoMedio,
    fontSize: 16,
  },
});
