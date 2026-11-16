import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Carregando } from '@/components/Carregando';
import { ProvedorSessao, useSessao } from '@/services/sessao';
import { paletaClara } from '@/theme/cores';
import { useTema, ProvedorTema } from '@/theme/tema';

import '@/global.css';

SplashScreen.preventAutoHideAsync();

export default function LayoutRaiz() {
  const [fontesProntas, erroFonte] = useFonts({
    Outfit_400Regular: require('../../assets/fonts/Outfit_400Regular.ttf'),
    Outfit_600SemiBold: require('../../assets/fonts/Outfit_600SemiBold.ttf'),
    Outfit_700Bold: require('../../assets/fonts/Outfit_700Bold.ttf'),
    Fraunces_600SemiBold: require('../../assets/fonts/Fraunces_600SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontesProntas || erroFonte) {
      SplashScreen.hideAsync();
    }
  }, [fontesProntas, erroFonte]);

  if (!fontesProntas && !erroFonte) {
    return null;
  }

  return (
    <GestureHandlerRootView style={estilos.raiz}>
      <ProvedorTema>
        <ProvedorSessao>
          <Moldura>
            <Navegacao />
          </Moldura>
        </ProvedorSessao>
      </ProvedorTema>
    </GestureHandlerRootView>
  );
}

function Moldura({ children }: { children: ReactNode }) {
  const { cores, escuro } = useTema();
  return (
    <>
      <StatusBar style={escuro ? 'light' : 'dark'} />
      <View style={[estilos.moldura, { backgroundColor: cores.papel }]}>{children}</View>
    </>
  );
}

function Navegacao() {
  const { usuario, carregando } = useSessao();
  const { cores } = useTema();

  if (carregando) {
    return <Carregando mensagem="Abrindo o NextBus" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.papel },
      }}>
      <Stack.Protected guard={usuario !== null} redirectTo="/entrar">
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={usuario === null} redirectTo="/">
        <Stack.Screen name="entrar" />
        <Stack.Screen name="cadastro" />
      </Stack.Protected>
    </Stack>
  );
}

const estilos = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: paletaClara.tinta,
  },
  moldura: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});
