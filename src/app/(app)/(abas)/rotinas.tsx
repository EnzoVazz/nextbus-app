import { Redirect, router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Botao } from '@/components/Botao';
import { Cartao } from '@/components/Cartao';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import { textoDias, textoSentido } from '@/services/dias';
import { lerErro } from '@/services/erros';
import { excluirRotina, listarRotinas } from '@/services/rotinas';
import { useSessao } from '@/services/sessao';
import type { Pagina, Rotina } from '@/services/tipos';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

const VAZIA: Pagina<Rotina> = {
  conteudo: [],
  pagina: 0,
  tamanho: 20,
  totalElementos: 0,
  totalPaginas: 0,
};

export default function Rotinas() {
  const { usuario } = useSessao();
  const { cores } = useTema();
  const [itens, setItens] = useState<Rotina[]>([]);
  const [pagina, setPagina] = useState<Pagina<Rotina>>(VAZIA);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoMais, setCarregandoMais] = useState(false);

  const carregar = useCallback(async (numero: number, substituir: boolean) => {
    if (substituir) setCarregando(true);
    else setCarregandoMais(true);
    setMensagens([]);
    try {
      const resposta = await listarRotinas(numero);
      setPagina(resposta);
      setItens((atuais) => (substituir ? resposta.conteudo : [...atuais, ...resposta.conteudo]));
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregando(false);
      setCarregandoMais(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar(0, true);
    }, [carregar]),
  );

  function pedirExclusao(rotina: Rotina) {
    Alert.alert('Excluir rotina', `${rotina.letreiro} às ${rotina.horarioEmbarque} sai da sua lista.`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          void excluir(rotina.id);
        },
      },
    ]);
  }

  async function excluir(id: number) {
    setMensagens([]);
    try {
      await excluirRotina(id);
      await carregar(0, true);
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
    }
  }

  if (usuario?.papel !== 'CIDADAO') {
    return <Redirect href="/" />;
  }

  const temMais = pagina.pagina + 1 < pagina.totalPaginas;

  return (
    <Tela rolar={false}>
      <FlatList
        style={estilos.flex}
        data={itens}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={estilos.lista}
        refreshing={carregando}
        onRefresh={() => void carregar(0, true)}
        ListHeaderComponent={
          <View style={estilos.bloco}>
            <Texto variante="secao">Minhas rotinas</Texto>
            <Texto variante="miudo">
              {pagina.totalElementos} no total. A lista vem em páginas.
            </Texto>
            <AvisoPainel mensagens={mensagens} />
            <Botao rotulo="Nova rotina" onPress={() => router.push('/rotina/nova')} />
          </View>
        }
        ListEmptyComponent={
          carregando ? undefined : <Texto variante="miudo">Nenhuma rotina ainda. Crie a primeira.</Texto>
        }
        renderItem={({ item }) => (
          <Cartao>
            <View style={estilos.topo}>
              <Texto variante="secao">{item.letreiro}</Texto>
              <Texto style={[estilos.hora, { color: cores.pinho }]}>{item.horarioEmbarque}</Texto>
            </View>
            <Texto>
              {textoSentido(item.sentido)} · {item.nomeParada}
            </Texto>
            <Texto variante="miudo">
              Linha {item.codigoLinha} · ponto {item.codigoParada}
            </Texto>
            <Texto variante="miudo">{textoDias(item.diasSemana)}</Texto>
            <View style={[estilos.estado, { backgroundColor: item.ativa ? cores.okFundo : cores.ambarClaro }]}>
              <Texto style={estilos.estadoTexto}>{item.ativa ? 'Ativa' : 'Desligada'}</Texto>
            </View>
            <View style={estilos.acoes}>
              <Botao
                rotulo="Editar"
                variante="secundario"
                onPress={() => router.push({ pathname: '/rotina/[id]', params: { id: String(item.id) } })}
              />
              <Botao rotulo="Excluir" variante="perigo" onPress={() => pedirExclusao(item)} />
            </View>
          </Cartao>
        )}
        ListFooterComponent={
          temMais ? (
            <Botao
              rotulo="Carregar mais"
              variante="secundario"
              carregando={carregandoMais}
              onPress={() => void carregar(pagina.pagina + 1, false)}
            />
          ) : undefined
        }
      />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  flex: {
    flex: 1,
  },
  lista: {
    padding: 24,
    gap: 16,
    paddingBottom: 40,
  },
  bloco: {
    gap: 12,
    marginBottom: 8,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hora: {
    fontFamily: fontes.titulo,
    fontSize: 28,
    lineHeight: 32,
  },
  estado: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 4,
  },
  estadoTexto: {
    fontFamily: fontes.textoMedio,
    fontSize: 13,
  },
  acoes: {
    gap: 8,
    marginTop: 8,
  },
});
