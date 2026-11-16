import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/Texto';
import { useTema } from '@/theme/tema';

type Props = {
  tipo?: 'erro' | 'info';
  mensagens: string[];
};

export function AvisoPainel({ tipo = 'erro', mensagens }: Props) {
  const { cores } = useTema();
  if (mensagens.length === 0) return null;
  const erro = tipo === 'erro';
  return (
    <View
      accessibilityRole="alert"
      style={[estilos.caixa, { backgroundColor: erro ? cores.perigoFundo : cores.ambarClaro }]}>
      {mensagens.map((mensagem, indice) => (
        <Texto key={`${indice}-${mensagem}`} style={{ color: erro ? cores.perigo : cores.tinta }}>
          {mensagem}
        </Texto>
      ))}
    </View>
  );
}

const estilos = StyleSheet.create({
  caixa: {
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
});
