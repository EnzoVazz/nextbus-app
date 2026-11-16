import { StyleSheet, TextInput, View, type KeyboardTypeOptions } from 'react-native';

import { Texto } from '@/components/Texto';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

type Props = {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  seguro?: boolean;
  teclado?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  dica?: string;
  maxLength?: number;
};

export function Campo({
  rotulo,
  valor,
  onChange,
  seguro = false,
  teclado = 'default',
  autoCapitalize = 'sentences',
  dica,
  maxLength,
}: Props) {
  const { cores } = useTema();
  return (
    <View style={estilos.bloco}>
      <Texto variante="forte">{rotulo}</Texto>
      <TextInput
        accessibilityLabel={rotulo}
        value={valor}
        onChangeText={onChange}
        secureTextEntry={seguro}
        keyboardType={teclado}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        placeholder={dica}
        placeholderTextColor={cores.tintaSuave}
        maxLength={maxLength}
        style={[estilos.entrada, { borderColor: cores.linha, backgroundColor: cores.cartao, color: cores.tinta }]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  bloco: {
    gap: 8,
  },
  entrada: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontFamily: fontes.texto,
    fontSize: 16,
  },
});
