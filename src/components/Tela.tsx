import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { espaco } from '@/theme/estilos';
import { useTema } from '@/theme/tema';

type Props = {
  children: ReactNode;
  rolar?: boolean;
  comCabecalho?: boolean;
};

export function Tela({ children, rolar = true, comCabecalho = false }: Props) {
  const { cores } = useTema();
  return (
    <SafeAreaView
      style={[estilos.tela, { backgroundColor: cores.papel }]}
      edges={comCabecalho ? ['left', 'right'] : ['top', 'left', 'right']}>
      {rolar ? (
        <ScrollView contentContainerStyle={estilos.conteudo} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={estilos.flex}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    padding: espaco.grande,
    gap: espaco.medio,
    paddingBottom: 40,
  },
});
