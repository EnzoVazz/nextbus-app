export type TipoMarco = 'ponto' | 'eu' | 'onibus' | 'origem' | 'destino' | 'fora';

export type Marco = {
  id: string;
  lat: number;
  lng: number;
  titulo: string;
  tipo: TipoMarco;
};

export type PontoMapa = {
  lat: number;
  lng: number;
};

export type PropsMapa = {
  marcos: Marco[];
  trajeto?: PontoMapa[];
  onPressMarco?: (id: string, selecionado?: boolean) => void;
};

export function corDoMarco(tipo: TipoMarco) {
  if (tipo === 'eu') return '#E3A008';
  if (tipo === 'onibus') return '#9E2B22';
  if (tipo === 'origem') return '#0A3F34';
  if (tipo === 'destino') return '#1D4E89';
  if (tipo === 'fora') return '#C4B8A8';
  return '#0E5C4A';
}

export function rotuloDoTipo(tipo: TipoMarco) {
  if (tipo === 'eu') return 'Você';
  if (tipo === 'onibus') return 'Ônibus';
  if (tipo === 'origem') return 'Origem';
  if (tipo === 'destino') return 'Destino';
  if (tipo === 'fora') return 'Sem ligação';
  return 'Ponto';
}
