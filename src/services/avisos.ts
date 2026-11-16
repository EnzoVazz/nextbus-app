import { api } from '@/services/api';
import type { Aviso } from '@/services/tipos';

export async function listarAvisos() {
  const { data } = await api.get<Aviso[]>('/avisos');
  return data ?? [];
}
