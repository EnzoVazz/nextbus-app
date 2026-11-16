import { api } from '@/services/api';
import type { RespostaLogin, Usuario } from '@/services/tipos';

export async function entrarComSenha(email: string, senha: string) {
  const { data } = await api.post<RespostaLogin>('/auth/login', { email, senha });
  return data;
}

export async function registrarConta(nome: string, email: string, senha: string) {
  const { data } = await api.post<Usuario>('/auth/registrar', { nome, email, senha });
  return data;
}

export async function buscarEu() {
  const { data } = await api.get<Usuario>('/auth/eu');
  return data;
}
