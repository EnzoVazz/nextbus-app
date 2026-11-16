import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { Atalho } from '@/components/Atalho';
import { AvisoPainel } from '@/components/AvisoPainel';
import { Cartao } from '@/components/Cartao';
import { Marca } from '@/components/Marca';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import { listarAvisos } from '@/services/avisos';
import { lerErro } from '@/services/erros';
import { useSessao } from '@/services/sessao';
import type { Aviso } from '@/services/tipos';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

export default function Inicio() {
  const { usuario } = useSessao();
  const { cores } = useTema();
  const cidadao = usuario?.papel === 'CIDADAO';
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!cidadao) return;
      let ativo = true;
      setCarregando(true);
      listarAvisos()
        .then((lista) => {
          if (ativo) setAvisos(lista);
        })
        .catch((erro: unknown) => {
          if (ativo) setMensagens(lerErro(erro).mensagens);
        })
        .finally(() => {
          if (ativo) setCarregando(false);
        });
      return () => {
        ativo = false;
      };
    }, [cidadao]),
  );

  return (
    <Tela>
      <Marca />
      <View>
        <Texto variante="secao">Olá, {usuario?.nome ?? ''}</Texto>
        <View style={[estilos.selo, { backgroundColor: cores.ambarClaro }]}>
          <Texto style={[estilos.seloTexto, { color: cores.tinta }]}>{cidadao ? 'Cidadão' : 'Gestor'}</Texto>
        </View>
      </View>

      {cidadao ? (
        <View style={estilos.bloco}>
          <Texto variante="forte">Aviso de hoje</Texto>
          <AvisoPainel mensagens={mensagens} />
          {carregando ? <Texto variante="miudo">Buscando o aviso…</Texto> : null}
          {!carregando && avisos.length === 0 ? (
            <Texto variante="miudo">
              Ainda não há aviso para hoje. Uma rotina criada aqui entra na lista, mas o aviso novo não nasce no
              servidor publicado.
            </Texto>
          ) : null}
          {avisos.map((aviso) => (
            <Cartao key={aviso.id}>
              <Texto style={[estilos.minutos, { color: cores.pinho }]}>{aviso.minutos} min</Texto>
              <Texto variante="forte">{aviso.textoCurto}</Texto>
              <Texto>{aviso.texto}</Texto>
              <Texto variante="miudo">
                {aviso.letreiro} · {aviso.nomePonto}
              </Texto>
              {aviso.comunicado ? (
                <View style={[estilos.faixa, { backgroundColor: cores.ambarClaro }]}>
                  <Texto variante="miudo">{aviso.comunicado}</Texto>
                </View>
              ) : null}
            </Cartao>
          ))}
        </View>
      ) : (
        <Texto variante="miudo">
          O gestor acompanha as linhas sem GPS recente. Rotina, aviso e planejamento ficam com o cidadão.
        </Texto>
      )}

      <View style={estilos.bloco}>
        {cidadao ? (
          <>
            <Atalho
              titulo="Minhas rotinas"
              detalhe="Criar, editar e apagar o embarque"
              onPress={() => router.push('/rotinas')}
            />
            <Atalho
              titulo="Planejar viagem"
              detalhe="Viagem direta a partir de onde você está"
              onPress={() => router.push('/planejar')}
            />
          </>
        ) : null}
        <Atalho
          titulo="Ônibus agora"
          detalhe="Linha, ponto perto, previsão e posição"
          onPress={() => router.push('/consultar')}
        />
        {!cidadao ? (
          <Atalho
            titulo="Linhas sem GPS"
            detalhe="O que o gestor precisa ver"
            onPress={() => router.push('/operacao')}
          />
        ) : null}
        <Atalho
          titulo="Meu perfil"
          detalhe="Nome, modo escuro, sobre o app e sair"
          onPress={() => router.push('/perfil')}
        />
      </View>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seloTexto: {
    fontFamily: fontes.textoMedio,
    fontSize: 13,
  },
  bloco: {
    gap: 12,
  },
  minutos: {
    fontFamily: fontes.titulo,
    fontSize: 48,
    lineHeight: 52,
  },
  faixa: {
    marginTop: 6,
    borderRadius: 10,
    padding: 10,
  },
});
