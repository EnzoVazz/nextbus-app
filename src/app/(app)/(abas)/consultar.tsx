import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Mapa } from '@/components/Mapa';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import type { Marco } from '@/components/mapaTipos';
import { buscarLinhas, buscarParadasProximas, buscarPosicoes, buscarPrevisao } from '@/services/consulta';
import { textoSentido } from '@/services/dias';
import { lerErro } from '@/services/erros';
import { lerLocalizacao, type Coordenada } from '@/services/localizacao';
import { PONTOS, pontoPorCodigo, rotuloDoPonto } from '@/services/pontosCatalogo';
import { trajetoNasRuas, type PontoTrajeto } from '@/services/trajeto';
import type { Linha, ParadaProxima, PosicaoOnibus, Previsao } from '@/services/tipos';
import { useTema } from '@/theme/tema';

function textoIdade(segundos: number) {
  if (segundos < 60) return `${segundos} s`;
  return `${Math.round(segundos / 60)} min`;
}

export default function Consultar() {
  const [termo, setTermo] = useState('');
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [linha, setLinha] = useState<Linha | null>(null);
  const [posicoes, setPosicoes] = useState<PosicaoOnibus[]>([]);
  const [paradas, setParadas] = useState<ParadaProxima[]>([]);
  const [previsao, setPrevisao] = useState<Previsao | null>(null);
  const [pontoEscolhido, setPontoEscolhido] = useState('');
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [carregandoPosicao, setCarregandoPosicao] = useState(false);
  const [carregandoPrevisao, setCarregandoPrevisao] = useState(false);
  const [carregandoPontos, setCarregandoPontos] = useState(false);
  const [eu, setEu] = useState<Coordenada | null>(null);
  const [trajeto, setTrajeto] = useState<PontoTrajeto[]>([]);
  const [avisoRua, setAvisoRua] = useState('');
  const pedidoRua = useRef(0);
  const { cores } = useTema();

  useEffect(() => {
    let ativo = true;
    lerLocalizacao()
      .then((coordenada) => {
        if (ativo) setEu(coordenada);
      })
      .catch(() => undefined);
    return () => {
      ativo = false;
    };
  }, []);

  async function procurar() {
    setBuscando(true);
    setMensagens([]);
    try {
      setLinhas(await buscarLinhas(termo.trim()));
    } catch (erro) {
      setLinhas([]);
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setBuscando(false);
    }
  }

  async function escolherLinha(escolhida: Linha) {
    setLinha(escolhida);
    setPrevisao(null);
    setPontoEscolhido('');
    setCarregandoPosicao(true);
    setMensagens([]);
    setTrajeto([]);
    setAvisoRua('');
    const pedido = pedidoRua.current + 1;
    pedidoRua.current = pedido;
    const pontos = escolhida.paradas
      .map((codigo) => pontoPorCodigo(codigo))
      .filter((ponto) => ponto !== undefined);
    if (pontos.length < 2) {
      setAvisoRua('Essa linha tem só um ponto no catálogo, então o mapa não traça rua.');
    } else {
      void trajetoNasRuas(pontos.map((ponto) => ({ lat: ponto.lat, lng: ponto.lng })))
        .then((caminho) => {
          if (pedidoRua.current !== pedido) return;
          setTrajeto(caminho);
          setAvisoRua('O traço amarelo segue as ruas entre os pontos dessa linha.');
        })
        .catch(() => {
          if (pedidoRua.current !== pedido) return;
          setTrajeto(pontos.map((ponto) => ({ lat: ponto.lat, lng: ponto.lng })));
          setAvisoRua('As ruas não carregaram. O traço liga os pontos em linha reta.');
        });
    }
    try {
      setPosicoes(await buscarPosicoes(escolhida.codigo));
    } catch (erro) {
      setPosicoes([]);
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregandoPosicao(false);
    }
  }

  async function verPrevisao(codigoParada: string) {
    if (!linha) {
      setMensagens(['Escolha uma linha antes da previsão.']);
      return;
    }
    setPontoEscolhido(codigoParada);
    setCarregandoPrevisao(true);
    setMensagens([]);
    try {
      setPrevisao(await buscarPrevisao(codigoParada, linha.codigo));
    } catch (erro) {
      setPrevisao(null);
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregandoPrevisao(false);
    }
  }

  async function pontosPerto() {
    setCarregandoPontos(true);
    setMensagens([]);
    try {
      const coordenada = await lerLocalizacao();
      setEu(coordenada);
      setParadas(await buscarParadasProximas(coordenada.lat, coordenada.lng));
    } catch (erro) {
      setParadas([]);
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregandoPontos(false);
    }
  }

  const marcos = useMemo(() => {
    const lista: Marco[] = PONTOS.map((ponto) => ({
      id: ponto.codigo,
      lat: ponto.lat,
      lng: ponto.lng,
      titulo: ponto.rotulo,
      tipo: 'ponto',
    }));
    for (const onibus of posicoes) {
      lista.push({
        id: `onibus-${onibus.id}`,
        lat: onibus.lat,
        lng: onibus.lng,
        titulo: `${onibus.letreiro} · ${textoSentido(onibus.sentido)}`,
        tipo: 'onibus',
      });
    }
    if (eu) {
      lista.push({ id: 'eu', lat: eu.lat, lng: eu.lng, titulo: 'Você está aqui', tipo: 'eu' });
    }
    return lista;
  }, [eu, posicoes]);

  const nomePontoEscolhido = pontoPorCodigo(pontoEscolhido)?.rotulo ?? (pontoEscolhido ? rotuloDoPonto(pontoEscolhido) : '');
  const resultadoPrevisao =
    previsao && linha && pontoEscolhido ? (
      <Cartao>
        <Texto variante="forte">
          {linha.letreiro} em {nomePontoEscolhido}
        </Texto>
        {previsao.veiculos.length === 0 ? <Texto>Nenhum ônibus a caminho deste ponto.</Texto> : null}
        {previsao.veiculos.map((veiculo) => (
          <Texto key={veiculo.id}>
            {`${veiculo.minutos > 0 ? `Chega em ${veiculo.minutos} min` : 'Sem horário de chegada'} · GPS há ${textoIdade(veiculo.idadeGpsSegundos)}`}
          </Texto>
        ))}
      </Cartao>
    ) : null;

  return (
    <Tela>
      <Texto variante="secao">Ônibus agora</Texto>
      <Texto variante="miudo">
        Vale para cidadão e gestor. Muitas consultas seguidas recebem o erro 429. Busque de novo só quando precisar.
      </Texto>
      <Texto variante="miudo">O mapa mostra os pontos, você e o ônibus da linha escolhida.</Texto>
      <Mapa
        marcos={marcos}
        trajeto={trajeto}
        onPressMarco={(id) => {
          if (id === 'eu' || id.startsWith('onibus-')) return;
          if (pontoEscolhido === id) {
            setPontoEscolhido('');
            setPrevisao(null);
            return;
          }
          if (!linha) return;
          void verPrevisao(id);
        }}
      />
      {avisoRua ? <Texto variante="miudo">{avisoRua}</Texto> : null}
      <AvisoPainel mensagens={mensagens} />
      <Campo rotulo="Linha" valor={termo} onChange={setTermo} autoCapitalize="characters" dica="8000 ou Lapa" />
      <Botao rotulo="Buscar linha" carregando={buscando} onPress={() => void procurar()} />

      {linhas.map((item) => (
        <Pressable
          key={item.codigo}
          accessibilityRole="button"
          onPress={() => void escolherLinha(item)}
          style={[
            estilos.opcao,
            { borderColor: cores.linha, backgroundColor: cores.cartao },
            linha?.codigo === item.codigo && { borderColor: cores.pinho },
          ]}>
          <Texto variante="forte">
            {item.letreiro} · {textoSentido(item.sentido)}
          </Texto>
          <Texto variante="miudo">{item.nome}</Texto>
        </Pressable>
      ))}

      {linha ? (
        <View style={estilos.bloco}>
          <Texto variante="forte">Posição na linha {linha.letreiro}</Texto>
          {carregandoPosicao ? <Texto variante="miudo">Buscando os ônibus…</Texto> : null}
          {posicoes.map((onibus) => (
            <Cartao key={onibus.id}>
              <Texto variante="forte">
                {onibus.letreiro} · {textoSentido(onibus.sentido)}
              </Texto>
              <Texto variante="miudo">
                GPS há {textoIdade(onibus.idadeGpsSegundos)} · {onibus.acessivel ? 'acessível' : 'sem acessibilidade'}
              </Texto>
              <Texto variante="miudo">
                {onibus.lat.toFixed(5)}, {onibus.lng.toFixed(5)}
              </Texto>
            </Cartao>
          ))}
          {!carregandoPosicao && posicoes.length === 0 ? (
            <Texto variante="miudo">Nenhum ônibus encontrado nessa linha.</Texto>
          ) : null}

          <Texto variante="forte">Toque um ponto para ver se tem ônibus a caminho</Texto>
          {linha.paradas.map((codigo) => (
            <Pressable
              key={codigo}
              accessibilityRole="button"
              onPress={() => void verPrevisao(codigo)}
              style={[
                estilos.opcao,
                { borderColor: cores.linha, backgroundColor: cores.cartao },
                pontoEscolhido === codigo && { borderColor: cores.pinho },
              ]}>
              <Texto variante="forte">{pontoPorCodigo(codigo)?.rotulo ?? rotuloDoPonto(codigo)}</Texto>
              <Texto variante="miudo">{codigo}</Texto>
            </Pressable>
          ))}
          {carregandoPrevisao ? <Texto variante="miudo">Consultando este ponto…</Texto> : null}
          {resultadoPrevisao}
        </View>
      ) : null}

      <Botao
        rotulo="Pontos perto de mim"
        variante="secundario"
        carregando={carregandoPontos}
        onPress={() => void pontosPerto()}
      />
      {paradas.length === 0 ? (
        <Texto variante="miudo">O catálogo só encontra ponto num raio de 800 metros.</Texto>
      ) : null}
      {paradas.map((item) => (
        <Pressable
          key={item.parada.codigo}
          accessibilityRole="button"
          onPress={() => void verPrevisao(item.parada.codigo)}
          style={[estilos.opcao, { borderColor: cores.linha, backgroundColor: cores.cartao }]}>
          <Texto variante="forte">{item.parada.nome}</Texto>
          <Texto variante="miudo">{item.distanciaMetros} m</Texto>
        </Pressable>
      ))}

    </Tela>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    gap: 10,
  },
  opcao: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 2,
  },
});
