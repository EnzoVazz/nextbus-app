import { Redirect, router } from 'expo-router';
import { useRef } from 'react';

import { FormularioRotina } from '@/components/FormularioRotina';
import { Tela } from '@/components/Tela';
import { criarChaveIdempotencia, criarRotina } from '@/services/rotinas';
import { useSessao } from '@/services/sessao';
import { usePedido } from '@/services/usePedido';
import type { RotinaPedido } from '@/services/tipos';

export default function NovaRotina() {
  const { usuario } = useSessao();
  const chave = useRef(criarChaveIdempotencia());
  const { carregando, mensagens, executar } = usePedido();

  async function salvar(pedido: RotinaPedido) {
    const criada = await executar(() => criarRotina(pedido, chave.current));
    if (criada) router.back();
  }

  if (usuario?.papel !== 'CIDADAO') {
    return <Redirect href="/" />;
  }

  return (
    <Tela comCabecalho>
      <FormularioRotina salvando={carregando} mensagens={mensagens} onSalvar={(pedido) => void salvar(pedido)} />
    </Tela>
  );
}
