import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/tabs';
import { View } from 'react-native';

import { useSessao } from '@/services/sessao';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

export default function Abas() {
  const { usuario } = useSessao();
  const { cores } = useTema();
  if (!usuario) {
    return <Redirect href="/entrar" />;
  }

  const cidadao = usuario.papel === 'CIDADAO';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.branco,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.72)',
        tabBarStyle: {
          backgroundColor: cores.pinho,
          borderTopColor: cores.pinho,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarShowLabel: true,
        tabBarIcon: () => <View />,
        tabBarIconStyle: { width: 0, height: 0, overflow: 'hidden' },
        tabBarLabelStyle: {
          fontFamily: fontes.textoMedio,
          fontSize: 13,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />
      <Tabs.Screen name="rotinas" options={{ title: 'Rotinas', href: cidadao ? '/rotinas' : null }} />
      <Tabs.Screen name="planejar" options={{ title: 'Viagem', href: cidadao ? '/planejar' : null }} />
      <Tabs.Screen name="consultar" options={{ title: 'Ônibus' }} />
      <Tabs.Screen name="operacao" options={{ title: 'Operação', href: cidadao ? null : '/operacao' }} />
    </Tabs>
  );
}
