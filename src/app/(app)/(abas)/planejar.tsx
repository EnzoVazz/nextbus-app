import { Redirect } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Cartao } from '@/components/Cartao';
import { Mapa } from '@/components/Mapa';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import type { Marco, TipoMarco } from '@/components/mapaTipos';
import { textoSentido } from '@/services/dias';
import { lerErro } from '@/services/erros';
import {
  destinosDesdeCoordenada,
  destinosDiretos,
  formatarDistancia,
  juntarNomes,
  maisProximo,
  pontoPorTexto,
  viagensProntas,
  type Trecho,
} from '@/services/linhasCatalogo';
import { lerLocalizacao, type Coordenada } from '@/services/localizacao';
import { PONTOS, pontoPorCodigo, type PontoCatalogo } from '@/services/pontosCatalogo';
import { useSessao } from '@/services/sessao';
import type { OpcaoViagem } from '@/services/tipos';
import { planejarViagem } from '@/services/viagens';
import { useTema } from '@/theme/tema';
import { fontes } from '@/theme/fontes';

const VIAGENS = viagensProntas();

export default function Planejar() {
  const { usuario } = useSessao();
  const estilos = useEstilosViagem();
  const [origem, setOrigem] = useState<Coordenada | null>(null);
  const [origemNome, setOrigemNome] = useState('');
  const [origemCodigo, setOrigemCodigo] = useState<string | null>(null);
  const [destinoTexto, setDestinoTexto] = useState('');
  const [destinoPonto, setDestinoPonto] = useState<PontoCatalogo | null>(null);
  const [opcoes, setOpcoes] = useState<OpcaoViagem[]>([]);
  const [info, setInfo] = useState<string[]>([]);
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [carregandoLocal, setCarregandoLocal] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [eu, setEu] = useState<Coordenada | null>(null);

  const destinos = useMemo(() => {
    if (origemCodigo) return destinosDiretos(origemCodigo);
    if (origem) return destinosDesdeCoordenada(origem.lat, origem.lng);
    return [];
  }, [origem, origemCodigo]);

  const codigosDestino = useMemo(() => new Set(destinos.map((trecho) => trecho.ponto.codigo)), [destinos]);

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

  function limparResultado() {
    setOpcoes([]);
    setInfo([]);
    setMensagens([]);
  }

  function definirOrigemPonto(codigo: string) {
    const ponto = pontoPorCodigo(codigo);
    if (!ponto) return;
    setOrigem({ lat: ponto.lat, lng: ponto.lng });
    setOrigemNome(ponto.rotulo);
    setOrigemCodigo(codigo);
    setDestinoTexto('');
    setDestinoPonto(null);
    const saidas = destinosDiretos(codigo);
    limparResultado();
    if (saidas.length === 0) {
      setInfo(['Esse ponto fica sozinho na linha. Escolha outro para sair.']);
      return;
    }
    setInfo([`Daqui o ônibus direto vai para ${juntarNomes(saidas.map((trecho) => trecho.ponto.rotulo))}.`]);
  }

  async function usarGps() {
    setCarregandoLocal(true);
    limparResultado();
    try {
      const coordenada = await lerLocalizacao();
      setEu(coordenada);
      const saidas = destinosDesdeCoordenada(coordenada.lat, coordenada.lng);
      if (saidas.length === 0) {
        const perto = maisProximo(coordenada.lat, coordenada.lng);
        setInfo([
          `Sua localização está a ${formatarDistancia(perto.distancia)} de ${perto.ponto.rotulo}. A API só aceita saída a até 800 metros de um ponto. Toque uma viagem da lista ou um ponto no mapa.`,
        ]);
        return;
      }
      setOrigem(coordenada);
      setOrigemNome('Minha localização');
      setOrigemCodigo(null);
      setDestinoTexto('');
      setDestinoPonto(null);
      setInfo([`Perto de você, o ônibus direto vai para ${juntarNomes(saidas.map((trecho) => trecho.ponto.rotulo))}.`]);
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregandoLocal(false);
    }
  }

  async function buscar(coord: Coordenada, destinoNome: string) {
    setCarregando(true);
    setMensagens([]);
    setInfo([]);
    setOpcoes([]);
    try {
      const lista = await planejarViagem({
        origemLat: coord.lat,
        origemLng: coord.lng,
        destino: destinoNome,
      });
      setOpcoes(lista);
      if (lista.length === 0) {
        setInfo(['A API não devolveu ônibus para essa busca.']);
      }
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregando(false);
    }
  }

  function escolherDestino(codigo: string) {
    if (!origem) {
      setMensagens(['Escolha primeiro de onde sair.']);
      return;
    }
    const trecho = destinos.find((item) => item.ponto.codigo === codigo);
    const ponto = trecho?.ponto ?? pontoPorCodigo(codigo);
    if (!ponto) return;
    if (!trecho) {
      const nomes = destinos.map((item) => item.ponto.rotulo);
      setMensagens([]);
      setOpcoes([]);
      setInfo(
        nomes.length > 0
          ? [`De ${origemNome} o ônibus direto só vai para ${juntarNomes(nomes)}.`]
          : ['Desse ponto não sai viagem direta. Escolha outro lugar de saída.'],
      );
      return;
    }
    setDestinoPonto(ponto);
    setDestinoTexto(ponto.rotulo);
    void buscar(origem, ponto.nome);
  }

  function experimentar(de: PontoCatalogo, para: PontoCatalogo) {
    const coord = { lat: de.lat, lng: de.lng };
    setOrigem(coord);
    setOrigemNome(de.rotulo);
    setOrigemCodigo(de.codigo);
    setDestinoPonto(para);
    setDestinoTexto(para.rotulo);
    void buscar(coord, para.nome);
  }

  async function planejar() {
    if (!origem) {
      setMensagens(['Escolha de onde sair.']);
      setInfo([]);
      setOpcoes([]);
      return;
    }
    const texto = destinoTexto.trim();
    if (!texto) {
      setMensagens(['Escolha para onde ir.']);
      setInfo([]);
      setOpcoes([]);
      return;
    }
    const ponto = destinoPonto ?? pontoPorTexto(texto);
    if (ponto && !codigosDestino.has(ponto.codigo)) {
      const nomes = destinos.map((trecho) => trecho.ponto.rotulo);
      setMensagens([]);
      setOpcoes([]);
      setInfo(
        nomes.length > 0
          ? [`De ${origemNome} o ônibus direto só vai para ${juntarNomes(nomes)}.`]
          : ['Desse ponto não sai viagem direta. Escolha outro lugar de saída.'],
      );
      return;
    }
    await buscar(origem, ponto?.nome ?? texto);
  }

  function aoMapa(id: string) {
    if (id === 'eu') {
      void usarGps();
      return;
    }
    if (destinoPonto?.codigo === id) {
      setDestinoPonto(null);
      setDestinoTexto('');
      limparResultado();
      return;
    }
    if (origemCodigo === id) {
      setOrigem(null);
      setOrigemNome('');
      setOrigemCodigo(null);
      setDestinoTexto('');
      setDestinoPonto(null);
      limparResultado();
      return;
    }
    if (origem && codigosDestino.has(id)) {
      escolherDestino(id);
      return;
    }
    if (origemCodigo && id !== origemCodigo) {
      const nomes = destinos.map((trecho) => trecho.ponto.rotulo);
      setMensagens([]);
      setOpcoes([]);
      setInfo(
        nomes.length > 0
          ? [`Daqui o ônibus direto só vai para ${juntarNomes(nomes)}. Toque nesse ponto.`]
          : ['Esse ponto fica sozinho na linha. Toque outro em Sair de.'],
      );
      return;
    }
    definirOrigemPonto(id);
  }

  const marcos = useMemo(() => {
    const lista: Marco[] = PONTOS.map((ponto) => {
      let tipo: TipoMarco = 'ponto';
      if (origem && ponto.codigo === destinoPonto?.codigo) tipo = 'destino';
      else if (origemCodigo === ponto.codigo) tipo = 'origem';
      else if (origem && !codigosDestino.has(ponto.codigo)) tipo = 'fora';
      return {
        id: ponto.codigo,
        lat: ponto.lat,
        lng: ponto.lng,
        titulo: ponto.rotulo,
        tipo,
      };
    });
    if (eu) {
      lista.push({ id: 'eu', lat: eu.lat, lng: eu.lng, titulo: 'Você está aqui', tipo: 'eu' });
    }
    return lista;
  }, [codigosDestino, destinoPonto, eu, origem, origemCodigo]);

  if (usuario?.papel !== 'CIDADAO') {
    return <Redirect href="/" />;
  }

  const dicaDestino = destinos[0]?.ponto.rotulo ?? 'Terminal São Mateus';

  return (
    <Tela>
      <Texto variante="secao">Planejar</Texto>
      <Texto variante="miudo">
        O catálogo só tem seis viagens diretas, sem baldeação. Toque uma delas. Os outros pares de pontos não têm
        ônibus.
      </Texto>
      <AvisoPainel mensagens={mensagens} />
      <AvisoPainel tipo="info" mensagens={info} />

      <Texto variante="forte">Viagens que existem</Texto>
      <View style={estilos.fileira}>
        {VIAGENS.map((viagem) => {
          const escolhida = origemCodigo === viagem.de.codigo && destinoPonto?.codigo === viagem.para.codigo;
          return (
            <Pressable
              key={`${viagem.linha.codigo}-${viagem.de.codigo}`}
              accessibilityRole="button"
              accessibilityState={{ selected: escolhida }}
              onPress={() => experimentar(viagem.de, viagem.para)}
              style={[estilos.chip, escolhida && estilos.chipAtivo]}>
              <Texto style={[estilos.chipTexto, escolhida && estilos.chipTextoAtivo]}>
                {viagem.de.rotulo} → {viagem.para.rotulo}
              </Texto>
            </Pressable>
          );
        })}
      </View>

      <Texto variante="miudo">
        No mapa, toque de onde sair e depois o destino em verde. Ponto cinza não liga com a origem.
      </Texto>
      <Mapa marcos={marcos} onPressMarco={aoMapa} />

      <Texto variante="forte">Sair de</Texto>
      <View style={estilos.fileira}>
        {PONTOS.map((ponto) => {
          const escolhido = origemCodigo === ponto.codigo;
          return (
            <Pressable
              key={ponto.codigo}
              accessibilityRole="button"
              accessibilityState={{ selected: escolhido }}
              onPress={() => definirOrigemPonto(ponto.codigo)}
              style={[estilos.chip, escolhido && estilos.chipAtivo]}>
              <Texto style={[estilos.chipTexto, escolhido && estilos.chipTextoAtivo]}>{ponto.rotulo}</Texto>
            </Pressable>
          );
        })}
      </View>
      <Botao
        rotulo="Usar minha localização"
        variante="secundario"
        carregando={carregandoLocal}
        onPress={() => void usarGps()}
      />
      {origem ? (
        <Texto variante="miudo">
          Origem: {origemNome} ({origem.lat.toFixed(5)}, {origem.lng.toFixed(5)})
        </Texto>
      ) : null}

      {destinos.length > 0 ? (
        <>
          <Texto variante="forte">Ir para</Texto>
          <View style={estilos.fileira}>
            {destinos.map((trecho) => (
              <DestinoChip
                key={trecho.ponto.codigo}
                trecho={trecho}
                escolhido={destinoPonto?.codigo === trecho.ponto.codigo}
                onPress={() => escolherDestino(trecho.ponto.codigo)}
              />
            ))}
          </View>
        </>
      ) : null}

      <Campo
        rotulo="Destino"
        valor={destinoTexto}
        onChange={(valor) => {
          setDestinoTexto(valor);
          setDestinoPonto(null);
        }}
        dica={dicaDestino}
      />
      <Botao rotulo="Ver opções" carregando={carregando} onPress={() => void planejar()} />

      {opcoes.map((opcao) => (
        <Cartao key={`${opcao.codigoLinha}-${opcao.codigoParada}`}>
          <Texto variante="secao">{opcao.letreiro}</Texto>
          <Texto>
            {textoSentido(opcao.sentido)} · embarque em {opcao.nomeParada}
          </Texto>
          <Texto variante="forte">{textoChegada(opcao.minutos)}</Texto>
          <Texto>{textoCaminhada(opcao.caminhadaMetros, origemNome === 'Minha localização')}</Texto>
          <Texto variante="miudo">
            Linha {opcao.codigoLinha} · ponto {opcao.codigoParada}
          </Texto>
        </Cartao>
      ))}
    </Tela>
  );
}

function textoChegada(minutos: number) {
  if (minutos <= 0) return 'Sem ônibus a caminho';
  return `${minutos} min`;
}

function textoCaminhada(metros: number, daLocalizacao: boolean) {
  if (metros > 0) return `Caminhada de ${metros} m até o ponto`;
  if (daLocalizacao) return 'Sua localização já é o ponto de embarque';
  return 'Sem caminhada: a origem escolhida é o ponto do catálogo';
}

function DestinoChip({
  trecho,
  escolhido,
  onPress,
}: {
  trecho: Trecho;
  escolhido: boolean;
  onPress: () => void;
}) {
  const estilos = useEstilosViagem();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: escolhido }}
      onPress={onPress}
      style={[estilos.chip, escolhido && estilos.chipAtivo]}>
      <Texto style={[estilos.chipTexto, escolhido && estilos.chipTextoAtivo]}>
        {trecho.ponto.rotulo} · {trecho.linha.letreiro}
      </Texto>
    </Pressable>
  );
}

function useEstilosViagem() {
  const { cores } = useTema();
  return StyleSheet.create({
    fileira: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      minHeight: 40,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: cores.linha,
      backgroundColor: cores.cartao,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipAtivo: {
      backgroundColor: cores.pinho,
      borderColor: cores.pinho,
    },
    chipTexto: {
      fontFamily: fontes.textoMedio,
      fontSize: 14,
      color: cores.tinta,
    },
    chipTextoAtivo: {
      color: cores.branco,
    },
  });
}
