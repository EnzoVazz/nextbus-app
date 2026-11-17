import { Redirect, Stack } from 'expo-router';

import { useSessao } from '@/services/sessao';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

export default function LayoutApp() {
  const { usuario } = useSessao();
  const { cores } = useTema();
  if (!usuario) {
    return <Redirect href="/entrar" />;
  }

  return (
    <Stack
      screenOptions={{
        headerTintColor: cores.pinho,
        headerStyle: { backgroundColor: cores.papel },
        headerTitleStyle: { fontFamily: fontes.textoMedio, color: cores.tinta },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: cores.papel },
      }}>
      <Stack.Screen name="(abas)" options={{ headerShown: false, title: 'Início' }} />
      <Stack.Screen name="rotina/nova" options={{ title: 'Nova rotina' }} />
      <Stack.Screen name="rotina/[id]" options={{ title: 'Editar rotina' }} />
      <Stack.Screen name="sobre" options={{ title: 'Sobre o app' }} />
      <Stack.Screen name="perfil" options={{ title: 'Perfil', headerBackTitle: 'Início' }} />
    </Stack>
  );
}
