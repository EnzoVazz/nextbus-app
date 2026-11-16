import { api } from '@/services/api';
import type { Linha, ParadaProxima, PosicaoOnibus, Previsao } from '@/services/tipos';

export async function buscarLinhas(termo: string) {
  const { data } = await api.get<Linha[]>('/linhas', { params: { q: termo } });
  return data ?? [];
}

export async function buscarParadasProximas(lat: number, lng: number) {
  const { data } = await api.get<ParadaProxima[]>('/paradas/proximas', { params: { lat, lng } });
  return data ?? [];
}

export async function buscarPosicoes(codigo: string) {
  const { data } = await api.get<PosicaoOnibus[]>(`/linhas/${encodeURIComponent(codigo)}/posicoes`);
  return data ?? [];
}

export async function buscarPrevisao(parada: string, linha: string) {
  const { data } = await api.get<Previsao>('/previsao', { params: { parada, linha } });
  return data;
}
