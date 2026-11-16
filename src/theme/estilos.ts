import { StyleSheet } from 'react-native';

import { fontes } from '@/theme/fontes';

export const espaco = {
  pequeno: 8,
  medio: 16,
  grande: 24,
} as const;

export const estilosTexto = StyleSheet.create({
  titulo: {
    fontFamily: fontes.titulo,
    fontSize: 34,
    lineHeight: 40,
  },
  secao: {
    fontFamily: fontes.textoForte,
    fontSize: 22,
    lineHeight: 28,
  },
  corpo: {
    fontFamily: fontes.texto,
    fontSize: 16,
    lineHeight: 22,
  },
  forte: {
    fontFamily: fontes.textoMedio,
    fontSize: 16,
    lineHeight: 22,
  },
  miudo: {
    fontFamily: fontes.texto,
    fontSize: 13,
    lineHeight: 18,
  },
});
