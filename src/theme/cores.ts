export type Paleta = {
  tinta: string;
  tintaSuave: string;
  papel: string;
  cartao: string;
  linha: string;
  pinho: string;
  pinhoEscuro: string;
  ambar: string;
  ambarClaro: string;
  perigo: string;
  perigoFundo: string;
  ok: string;
  okFundo: string;
  branco: string;
};

export const paletaClara: Paleta = {
  tinta: '#142433',
  tintaSuave: '#5C6B78',
  papel: '#F4EFE6',
  cartao: '#FFFCF7',
  linha: '#E3D7C6',
  pinho: '#0E5C4A',
  pinhoEscuro: '#0A3F34',
  ambar: '#E3A008',
  ambarClaro: '#FFF4D4',
  perigo: '#9E2B22',
  perigoFundo: '#FDECEA',
  ok: '#0E7A4B',
  okFundo: '#E6F6EE',
  branco: '#FFFFFF',
};

export const paletaEscura: Paleta = {
  tinta: '#F6F1E8',
  tintaSuave: '#B7C3BA',
  papel: '#121A17',
  cartao: '#1C2B26',
  linha: '#31463D',
  pinho: '#1F8F72',
  pinhoEscuro: '#0A3F34',
  ambar: '#E3A008',
  ambarClaro: '#3D3214',
  perigo: '#F0A8A2',
  perigoFundo: '#3D2422',
  ok: '#8FD9B0',
  okFundo: '#17352A',
  branco: '#FFFFFF',
};

export const cores = paletaClara;
