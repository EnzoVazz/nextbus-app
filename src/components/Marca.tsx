import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/Texto';
import { paletaClara } from '@/theme/cores';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

export function Marca({ clara = false }: { clara?: boolean }) {
  const { cores: coresTema } = useTema();
  const cores = clara ? paletaClara : coresTema;
  const fundo = clara ? cores.ambar : cores.pinho;
  const corpo = clara ? cores.pinhoEscuro : cores.papel;
  const detalhe = clara ? cores.ambarClaro : cores.ambar;
  const roda = clara ? cores.tinta : cores.pinhoEscuro;
  const corNome = clara ? cores.papel : cores.pinho;

  return (
    <View accessibilityRole="header" style={estilos.linha}>
      <View accessibilityLabel="Ônibus do NextBus" style={[estilos.selo, { backgroundColor: fundo }]}>
        <View style={estilos.onibus}>
          <View style={[estilos.letreiro, { backgroundColor: detalhe }]} />
          <View style={estilos.chassi}>
            <View style={[estilos.corpo, { backgroundColor: corpo }]}>
              <View style={[estilos.janela, { backgroundColor: detalhe }]} />
              <View style={[estilos.janela, { backgroundColor: detalhe }]} />
              <View style={[estilos.porta, { backgroundColor: detalhe }]} />
            </View>
            <View style={[estilos.frente, { backgroundColor: corpo }]}>
              <View style={[estilos.farol, { backgroundColor: detalhe }]} />
            </View>
          </View>
          <View style={estilos.eixo}>
            <View style={[estilos.roda, { backgroundColor: roda }]} />
            <View style={[estilos.roda, { backgroundColor: roda }]} />
          </View>
        </View>
      </View>
      <Texto style={[estilos.nome, { color: corNome }]}>NextBus</Texto>
    </View>
  );
}

const estilos = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onibus: {
    width: 38,
    height: 30,
    alignItems: 'center',
  },
  letreiro: {
    width: 16,
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },
  chassi: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  corpo: {
    width: 28,
    height: 14,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 3,
    gap: 2,
  },
  frente: {
    width: 8,
    height: 16,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  janela: {
    width: 5,
    height: 7,
    borderRadius: 1,
  },
  porta: {
    width: 4,
    height: 9,
    borderRadius: 1,
  },
  farol: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  eixo: {
    width: 34,
    marginTop: -4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  roda: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  nome: {
    fontFamily: fontes.titulo,
    fontSize: 32,
    lineHeight: 38,
  },
});
