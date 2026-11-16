import { api } from '@/services/api';
import type { LinhaSemGps } from '@/services/tipos';

export async function listarLinhasSemGps() {
  const { data } = await api.get<LinhaSemGps[]>('/operacao/linhas-sem-gps');
  return data ?? [];
}
