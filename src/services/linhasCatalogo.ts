import { PONTOS, pontoPorCodigo, type PontoCatalogo } from '@/services/pontosCatalogo';
import type { Sentido } from '@/services/tipos';

export type LinhaCatalogo = {
  codigo: string;
  letreiro: string;
  sentido: Sentido;
  nome: string;
  paradas: string[];
};

export type Trecho = {
  ponto: PontoCatalogo;
  linha: LinhaCatalogo;
};

export type ViagemPronta = {
  de: PontoCatalogo;
  para: PontoCatalogo;
  linha: LinhaCatalogo;
};

const RAIO_METROS = 800;

// Mesmas linhas do catálogo da API. Cada uma liga só os pontos listados, nessa ordem.
export const LINHAS: LinhaCatalogo[] = [
  {
    codigo: '34831',
    letreiro: '7021-10',
    sentido: 'IDA',
    nome: 'Terminal Pirituba / Roberto Selmi Dei',
    paradas: ['140088210', '140015892'],
  },
  {
    codigo: '34832',
    letreiro: '7021-10',
    sentido: 'VOLTA',
    nome: 'Roberto Selmi Dei / Terminal Pirituba',
    paradas: ['140015892', '140088210'],
  },
  {
    codigo: '25011',
    letreiro: '8000-10',
    sentido: 'IDA',
    nome: 'Metro Ana Rosa / Terminal Lapa',
    paradas: ['220014331', '220900112'],
  },
  {
    codigo: '25012',
    letreiro: '8000-10',
    sentido: 'VOLTA',
    nome: 'Terminal Lapa / Metro Ana Rosa',
    paradas: ['220900112', '220014331'],
  },
  {
    codigo: '17520',
    letreiro: '675N-10',
    sentido: 'IDA',
    nome: 'Praca da Se / Terminal Sao Mateus',
    paradas: ['330210045', '330880771'],
  },
  {
    codigo: '17521',
    letreiro: '675N-10',
    sentido: 'VOLTA',
    nome: 'Terminal Sao Mateus / Praca da Se',
    paradas: ['330880771', '330210045'],
  },
  {
    codigo: '40110',
    letreiro: '917M-10',
    sentido: 'IDA',
    nome: 'Metro Tucuruvi',
    paradas: ['510022640'],
  },
];

export function linhasNoPonto(codigo: string) {
  return LINHAS.filter((linha) => linha.paradas.includes(codigo));
}

export function viagensProntas(): ViagemPronta[] {
  const pares: ViagemPronta[] = [];
  for (const linha of LINHAS) {
    for (let embarque = 0; embarque < linha.paradas.length; embarque += 1) {
      for (let desembarque = embarque + 1; desembarque < linha.paradas.length; desembarque += 1) {
        const de = pontoPorCodigo(linha.paradas[embarque]);
        const para = pontoPorCodigo(linha.paradas[desembarque]);
        if (de && para) pares.push({ de, para, linha });
      }
    }
  }
  return pares;
}

export function destinosDiretos(codigoOrigem: string): Trecho[] {
  const saidas: Trecho[] = [];
  const vistos = new Set<string>();
  for (const linha of LINHAS) {
    const embarque = linha.paradas.indexOf(codigoOrigem);
    if (embarque < 0) continue;
    for (const codigo of linha.paradas.slice(embarque + 1)) {
      if (vistos.has(codigo)) continue;
      const ponto = pontoPorCodigo(codigo);
      if (!ponto) continue;
      vistos.add(codigo);
      saidas.push({ ponto, linha });
    }
  }
  return saidas;
}

export function destinosDesdeCoordenada(lat: number, lng: number): Trecho[] {
  const saidas: Trecho[] = [];
  const vistos = new Set<string>();
  for (const parada of PONTOS) {
    if (distanciaMetros(lat, lng, parada.lat, parada.lng) > RAIO_METROS) continue;
    for (const trecho of destinosDiretos(parada.codigo)) {
      if (vistos.has(trecho.ponto.codigo)) continue;
      vistos.add(trecho.ponto.codigo);
      saidas.push(trecho);
    }
  }
  return saidas;
}

export function maisProximo(lat: number, lng: number) {
  let melhor = PONTOS[0];
  let distancia = distanciaMetros(lat, lng, melhor.lat, melhor.lng);
  for (const ponto of PONTOS) {
    const atual = distanciaMetros(lat, lng, ponto.lat, ponto.lng);
    if (atual < distancia) {
      melhor = ponto;
      distancia = atual;
    }
  }
  return { ponto: melhor, distancia };
}

export function pontoPorTexto(texto: string) {
  const alvo = normalizarTexto(texto);
  if (!alvo) return undefined;
  const exato = PONTOS.find(
    (ponto) => normalizarTexto(ponto.nome) === alvo || normalizarTexto(ponto.rotulo) === alvo,
  );
  if (exato) return exato;
  return PONTOS.find(
    (ponto) => normalizarTexto(ponto.nome).includes(alvo) || normalizarTexto(ponto.rotulo).includes(alvo),
  );
}

export function juntarNomes(nomes: string[]) {
  if (nomes.length === 0) return '';
  if (nomes.length === 1) return nomes[0];
  return `${nomes.slice(0, -1).join(', ')} ou ${nomes[nomes.length - 1]}`;
}

export function formatarDistancia(metros: number) {
  if (metros < 1000) return `${metros} m`;
  return `${(metros / 1000).toFixed(1).replace('.', ',')} km`;
}

export function distanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number) {
  const radiano = Math.PI / 180;
  const dLat = (lat2 - lat1) * radiano;
  const dLng = (lng2 - lng1) * radiano;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * radiano) * Math.cos(lat2 * radiano) * Math.sin(dLng / 2) ** 2;
  return Math.round(6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function normalizarTexto(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
