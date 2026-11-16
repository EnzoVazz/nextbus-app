import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { rotuloDoTipo, corDoMarco, type Marco, type TipoMarco } from '@/components/mapaTipos';
import { Texto } from '@/components/Texto';
import { useTema } from '@/theme/tema';

const ORDEM: TipoMarco[] = ['origem', 'destino', 'ponto', 'fora', 'eu', 'onibus'];

export function MapaMoldura({ children, marcos }: { children: ReactNode; marcos: Marco[] }) {
  const { cores } = useTema();
  const presentes = new Set(marcos.map((marco) => marco.tipo));
  const itens = ORDEM.filter((tipo) => presentes.has(tipo));

  return (
    <View accessibilityLabel="Mapa com pontos de ônibus em São Paulo" style={estilos.bloco}>
      <View style={[estilos.moldura, { borderColor: cores.linha, backgroundColor: cores.cartao }]}>{children}</View>
      {itens.length > 0 ? (
        <View style={estilos.legenda}>
          {itens.map((tipo) => (
            <Item key={tipo} cor={corDoMarco(tipo)} nome={rotuloDoTipo(tipo)} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

function Item({ cor, nome }: { cor: string; nome: string }) {
  return (
    <View style={estilos.item}>
      <View style={[estilos.bolinha, { backgroundColor: cor }]} />
      <Texto variante="miudo">{nome}</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    gap: 8,
  },
  moldura: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  legenda: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bolinha: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
