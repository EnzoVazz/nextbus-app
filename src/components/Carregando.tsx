import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Texto } from '@/components/Texto';
import { useTema } from '@/theme/tema';

type Props = {
  mensagem: string;
  detalhe?: string;
};

export function Carregando({ mensagem, detalhe }: Props) {
  const { cores } = useTema();
  return (
    <View style={[estilos.caixa, { backgroundColor: cores.papel }]}>
      <ActivityIndicator color={cores.pinho} size="large" />
      <Texto variante="forte" style={estilos.centro}>
        {mensagem}
      </Texto>
      {detalhe ? (
        <Texto variante="miudo" style={estilos.centro}>
          {detalhe}
        </Texto>
      ) : null}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  centro: {
    textAlign: 'center',
  },
});
