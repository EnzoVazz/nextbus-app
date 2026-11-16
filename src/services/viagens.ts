import { api } from '@/services/api';
import type { OpcaoViagem, PedidoViagem } from '@/services/tipos';

export async function planejarViagem(pedido: PedidoViagem) {
  const { data } = await api.post<OpcaoViagem[]>('/viagens/planejar', pedido);
  return data ?? [];
}
