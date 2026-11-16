import axios, { type InternalAxiosRequestConfig } from 'axios';

import { apagarSessao } from '@/services/armazenamento';
import { ErroApi, lerErro } from '@/services/erros';

export const URL_API = 'https://nextbus-api.onrender.com';

const TEMPO_LIMITE_MS = 120_000;

let tokenAtual: string | null = null;
let aoSair: (() => void) | null = null;

export function definirToken(token: string | null) {
  tokenAtual = token;
}

export function registrarSaida(ouvinte: () => void) {
  aoSair = ouvinte;
}

export const api = axios.create({
  baseURL: URL_API,
  timeout: TEMPO_LIMITE_MS,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const caminho = config.url ?? '';
  const publico = caminho.includes('/auth/login') || caminho.includes('/auth/registrar');
  if (tokenAtual && !publico) {
    config.headers.Authorization = `Bearer ${tokenAtual}`;
  }
  return config;
});

api.interceptors.response.use(
  (resposta) => resposta,
  async (erro: unknown) => {
    const falha = lerErro(erro);
    if (falha.status === 401 && axios.isAxiosError(erro) && pedidoTinhaToken(erro.config)) {
      definirToken(null);
      await apagarSessao();
      aoSair?.();
    }
    return Promise.reject(falha instanceof ErroApi ? falha : lerErro(erro));
  },
);

function pedidoTinhaToken(config: InternalAxiosRequestConfig | undefined) {
  const cabecalho = config?.headers;
  if (!cabecalho) return false;
  const lido = typeof cabecalho.get === 'function' ? cabecalho.get('Authorization') : undefined;
  const valor = lido ?? cabecalho.Authorization;
  return typeof valor === 'string' && valor.startsWith('Bearer ');
}
