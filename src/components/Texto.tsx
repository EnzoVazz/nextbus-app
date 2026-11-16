import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { estilosTexto } from '@/theme/estilos';
import { useTema } from '@/theme/tema';

type Variante = keyof typeof estilosTexto;

type Props = TextProps & {
  variante?: Variante;
  style?: StyleProp<TextStyle>;
};

export function Texto({ variante = 'corpo', style, ...resto }: Props) {
  const { cores } = useTema();
  const cor = variante === 'miudo' ? cores.tintaSuave : cores.tinta;
  return <Text {...resto} style={[estilosTexto[variante], { color: cor }, style]} />;
}
