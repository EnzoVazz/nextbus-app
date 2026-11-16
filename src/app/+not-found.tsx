import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Botao } from '@/components/Botao';
import { Texto } from '@/components/Texto';
import { useTema } from '@/theme/tema';

export default function NaoEncontrada() {
  const { cores } = useTema();
  return (
    <View style={[estilos.tela, { backgroundColor: cores.papel }]}>
      <Texto variante="secao">Essa tela não existe.</Texto>
      <Botao rotulo="Voltar ao início" onPress={() => router.replace('/')} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },
});
