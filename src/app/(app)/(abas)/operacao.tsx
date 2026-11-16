import { Redirect, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Cartao } from '@/components/Cartao';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import { lerErro } from '@/services/erros';
import { listarLinhasSemGps } from '@/services/operacao';
import { useSessao } from '@/services/sessao';
import type { LinhaSemGps } from '@/services/tipos';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

export default function Operacao() {
  const { usuario } = useSessao();
  const { cores } = useTema();
  const [linhas, setLinhas] = useState<LinhaSemGps[]>([]);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setMensagens([]);
    try {
      setLinhas(await listarLinhasSemGps());
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void carregar();
    }, [carregar]),
  );

  if (usuario?.papel !== 'GESTOR') {
    return <Redirect href="/" />;
  }

  return (
    <Tela rolar={false}>
      <FlatList
        style={estilos.flex}
        data={linhas}
        keyExtractor={(item) => item.codigo}
        refreshing={carregando}
        onRefresh={() => void carregar()}
        contentContainerStyle={estilos.lista}
        ListHeaderComponent={
          <View style={estilos.bloco}>
            <Texto variante="secao">Linhas sem GPS</Texto>
            <Texto variante="miudo">Entra na lista quando o GPS mais novo tem mais de 3 minutos.</Texto>
            <AvisoPainel mensagens={mensagens} />
          </View>
        }
        ListEmptyComponent={
          carregando ? undefined : <Texto variante="miudo">Nenhuma linha com GPS velho agora.</Texto>
        }
        renderItem={({ item }) => (
          <Cartao>
            <Texto variante="secao">{item.letreiro}</Texto>
            <Texto variante="miudo">Código {item.codigo}</Texto>
            <Texto style={[estilos.idade, { color: cores.perigo }]}>
              {Math.round(item.idadeGpsSegundos / 60)} min sem GPS novo
            </Texto>
          </Cartao>
        )}
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
    gap: 12,
    paddingBottom: 40,
  },
  bloco: {
    gap: 8,
    marginBottom: 8,
  },
  idade: {
    fontFamily: fontes.textoMedio,
  },
});
