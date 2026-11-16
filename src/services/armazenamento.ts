import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import type { Sessao } from '@/services/tipos';

const CHAVE = 'nextbus.sessao';
const CHAVE_TEMA = 'nextbus.tema';

export async function lerSessao(): Promise<Sessao | null> {
  const bruto = await lerValor(CHAVE);
  if (!bruto) {
    return null;
  }
  try {
    const dados = JSON.parse(bruto) as Partial<Sessao>;
    if (!dados.token || !dados.email || !dados.nome || !dados.papel || typeof dados.id !== 'number') {
      return null;
    }
    return dados as Sessao;
  } catch {
    return null;
  }
}

export async function guardarSessao(sessao: Sessao) {
  await guardarValor(CHAVE, JSON.stringify(sessao));
}

export async function apagarSessao() {
  await apagarValor(CHAVE);
}

export async function lerTemaEscuro() {
  return (await lerValor(CHAVE_TEMA)) === 'escuro';
}

export async function guardarTemaEscuro(escuro: boolean) {
  await guardarValor(CHAVE_TEMA, escuro ? 'escuro' : 'claro');
}

async function lerValor(chave: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return globalThis.localStorage?.getItem(chave) ?? null;
  }
  if (!(await SecureStore.isAvailableAsync())) {
    return null;
  }
  return SecureStore.getItemAsync(chave);
}

async function guardarValor(chave: string, valor: string) {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.setItem(chave, valor);
    return;
  }
  if (!(await SecureStore.isAvailableAsync())) {
    throw new Error('Este aparelho não consegue guardar a sessão com segurança.');
  }
  await SecureStore.setItemAsync(chave, valor);
}

async function apagarValor(chave: string) {
  if (Platform.OS === 'web') {
    globalThis.localStorage?.removeItem(chave);
    return;
  }
  if (await SecureStore.isAvailableAsync()) {
    await SecureStore.deleteItemAsync(chave);
  }
}
