import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Carregando } from '@/components/Carregando';
import { FormularioRotina } from '@/components/FormularioRotina';
import { Tela } from '@/components/Tela';
import { lerErro } from '@/services/erros';
import { atualizarRotina, buscarRotina, excluirRotina } from '@/services/rotinas';
import { useSessao } from '@/services/sessao';
import { usePedido } from '@/services/usePedido';
import type { Rotina, RotinaPedido } from '@/services/tipos';

export default function EditarRotina() {
  const { usuario } = useSessao();
  const { id } = useLocalSearchParams<{ id: string }>();
  const numero = Number(Array.isArray(id) ? id[0] : id);
  const [rotina, setRotina] = useState<Rotina | null>(null);
  const [erroCarga, setErroCarga] = useState<string[]>([]);
  const [carregandoRotina, setCarregandoRotina] = useState(true);
  const salvarPedido = usePedido();
  const excluirPedido = usePedido();

  useEffect(() => {
    if (!Number.isFinite(numero)) {
      setErroCarga(['Não encontrei essa rotina.']);
      setCarregandoRotina(false);
      return;
    }
    let ativo = true;
    buscarRotina(numero)
      .then((dados) => {
        if (ativo) setRotina(dados);
      })
      .catch((erro: unknown) => {
        if (ativo) setErroCarga(lerErro(erro).mensagens);
      })
      .finally(() => {
        if (ativo) setCarregandoRotina(false);
      });
    return () => {
      ativo = false;
    };
  }, [numero]);

  async function salvar(pedido: RotinaPedido) {
    const salva = await salvarPedido.executar(() => atualizarRotina(numero, pedido));
    if (salva) router.back();
  }

  function pedirExclusao() {
    Alert.alert('Excluir rotina', 'Se esta rotina já tiver aviso, a API não deixa excluir.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void excluir();
        },
      },
    ]);
  }

  async function excluir() {
    const ok = await excluirPedido.executar(async () => {
      await excluirRotina(numero);
      return true;
    });
    if (ok) router.back();
  }

  if (usuario?.papel !== 'CIDADAO') {
    return <Redirect href="/" />;
  }

  if (carregandoRotina) {
    return <Carregando mensagem="Abrindo a rotina" detalhe="Se o servidor estiver dormindo, isso pode levar cerca de um minuto." />;
  }

  return (
    <Tela comCabecalho>
      <AvisoPainel mensagens={erroCarga} />
      <AvisoPainel mensagens={excluirPedido.mensagens} />
      {rotina ? (
        <FormularioRotina
          key={rotina.id}
          inicial={rotina}
          salvando={salvarPedido.carregando}
          mensagens={salvarPedido.mensagens}
          onSalvar={(pedido) => void salvar(pedido)}
          onExcluir={pedirExclusao}
          excluindo={excluirPedido.carregando}
        />
      ) : null}
    </Tela>
  );
}
