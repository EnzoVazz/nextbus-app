import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/Texto';
import { textoSentido } from '@/services/dias';
import { linhasNoPonto } from '@/services/linhasCatalogo';
import { pontoPorCodigo, rotuloDoPonto } from '@/services/pontosCatalogo';

export function useToqueNoMapa(onPressMarco?: (id: string, selecionado?: boolean) => void) {
  const [ponto, setPonto] = useState<string | null>(null);
  const pontoAtual = useRef<string | null>(null);

  function aoPressionar(id: string) {
    if (!pontoPorCodigo(id)) {
      onPressMarco?.(id, true);
      return;
    }
    const desmarcar = pontoAtual.current === id;
    const proximo = desmarcar ? null : id;
    pontoAtual.current = proximo;
    setPonto(proximo);
    onPressMarco?.(id, !desmarcar);
  }

  return { ponto, aoPressionar };
}

export function LinhasNoPonto({ codigo }: { codigo: string | null }) {
  if (!codigo) {
    return <Texto variante="miudo">Toque um ponto do mapa para ver as linhas que passam nele.</Texto>;
  }

  const ponto = pontoPorCodigo(codigo);
  if (!ponto) return null;
  const linhas = linhasNoPonto(codigo);

  return (
    <View style={estilos.bloco}>
      <Texto variante="forte">Linhas em {ponto.rotulo}</Texto>
      {linhas.length === 0 ? <Texto variante="miudo">Nenhuma linha do catálogo passa neste ponto.</Texto> : null}
      {linhas.map((linha) => (
        <Texto key={linha.codigo}>
          {`${linha.letreiro} · ${textoSentido(linha.sentido)} · ${linha.paradas.map((codigoParada) => rotuloDoPonto(codigoParada)).join(' → ')}`}
        </Texto>
      ))}
      <Texto variante="miudo">Toque de novo nesse ponto para desmarcar.</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    gap: 4,
  },
});
