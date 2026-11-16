import { api } from '@/services/api';
import type { Pagina, Rotina, RotinaPedido } from '@/services/tipos';

const TAMANHO = 20;

export async function listarRotinas(pagina: number) {
  const { data } = await api.get<Pagina<Rotina>>('/rotinas', {
    params: { page: pagina, size: TAMANHO },
  });
  return {
    conteudo: data.conteudo ?? [],
    pagina: data.pagina ?? pagina,
    tamanho: data.tamanho ?? TAMANHO,
    totalElementos: data.totalElementos ?? data.conteudo?.length ?? 0,
    totalPaginas: data.totalPaginas ?? 1,
  };
}

export async function buscarRotina(id: number) {
  const { data } = await api.get<Rotina>(`/rotinas/${id}`);
  return data;
}

export async function criarRotina(pedido: RotinaPedido, chave: string) {
  const { data } = await api.post<Rotina>('/rotinas', pedido, {
    headers: { 'Idempotency-Key': chave },
  });
  return data;
}

export async function atualizarRotina(id: number, pedido: RotinaPedido) {
  const { data } = await api.put<Rotina>(`/rotinas/${id}`, pedido);
  return data;
}

export async function excluirRotina(id: number) {
  await api.delete(`/rotinas/${id}`);
}

export function criarChaveIdempotencia() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `nb-${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 10)}`;
}

export function validarRotina(pedido: RotinaPedido) {
  const mensagens: string[] = [];
  if (!pedido.codigoLinha.trim()) mensagens.push('Informe o código da linha.');
  else if (pedido.codigoLinha.trim().length > 20) mensagens.push('O código da linha pode ter no máximo 20 caracteres.');

  if (!pedido.letreiro.trim()) mensagens.push('Informe o letreiro.');
  else if (pedido.letreiro.trim().length > 20) mensagens.push('O letreiro pode ter no máximo 20 caracteres.');

  if (pedido.sentido !== 'IDA' && pedido.sentido !== 'VOLTA') {
    mensagens.push('Informe o sentido: IDA ou VOLTA.');
  }

  if (!pedido.codigoParada.trim()) mensagens.push('Informe o código do ponto.');
  else if (pedido.codigoParada.trim().length > 20) mensagens.push('O código do ponto pode ter no máximo 20 caracteres.');

  if (!pedido.nomeParada.trim()) mensagens.push('Informe o nome do ponto.');
  else if (pedido.nomeParada.trim().length > 160) mensagens.push('O nome do ponto pode ter no máximo 160 caracteres.');

  if (!pedido.diasSemana) mensagens.push('Escolha pelo menos um dia. 1 é segunda e 7 é domingo.');
  else if (!/^[1-7](,[1-7])*$/.test(pedido.diasSemana)) {
    mensagens.push('Os dias devem ser números de 1 a 7, separados por vírgula.');
  }

  if (!/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(pedido.horarioEmbarque)) {
    mensagens.push('O horário deve estar no formato HH:mm.');
  }

  return mensagens;
}

export function limparRotina(pedido: RotinaPedido): RotinaPedido {
  return {
    ...pedido,
    codigoLinha: pedido.codigoLinha.trim(),
    letreiro: pedido.letreiro.trim(),
    codigoParada: pedido.codigoParada.trim(),
    nomeParada: pedido.nomeParada.trim(),
    horarioEmbarque: pedido.horarioEmbarque.trim(),
    diasSemana: pedido.diasSemana,
    ativa: pedido.ativa,
  };
}
