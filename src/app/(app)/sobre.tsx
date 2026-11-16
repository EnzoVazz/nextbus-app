import Constants from 'expo-constants';
import { StyleSheet, View } from 'react-native';

import { Cartao } from '@/components/Cartao';
import { Marca } from '@/components/Marca';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import { URL_API } from '@/services/api';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

function hashDoCommit() {
  const extra = Constants.expoConfig?.extra as { commit?: string } | undefined;
  return extra?.commit || 'sem commit ainda';
}

export default function Sobre() {
  const { cores } = useTema();
  const commit = hashDoCommit();
  return (
    <Tela comCabecalho>
      <Marca />
      <Texto>
        O NextBus avisa o cidadão na hora de sair para o ônibus. A rotina fica na API Java. O aviso do dia, a previsão
        e a posição chegam dessa mesma API.
      </Texto>
      <Cartao>
        <Texto variante="miudo">Commit de referência</Texto>
        <Texto selectable style={[estilos.hash, { color: cores.pinho }]}>
          {commit}
        </Texto>
        {commit === 'sem commit ainda' ? (
          <Texto variante="miudo">O hash aparece aqui quando o app é gerado a partir de um commit.</Texto>
        ) : null}
      </Cartao>
      <View style={estilos.bloco}>
        <Texto variante="miudo">API</Texto>
        <Texto selectable>{URL_API}</Texto>
      </View>
      <Texto variante="miudo">
        Este app não guarda senha da Olho Vivo nem chave de inteligência artificial. O token da sessão fica no
        aparelho e sai no logout.
      </Texto>
    </Tela>
  );
}

const estilos = StyleSheet.create({
  hash: {
    fontFamily: fontes.textoForte,
    fontSize: 20,
  },
  bloco: {
    gap: 4,
  },
});
