export type PontoCatalogo = {
  codigo: string;
  nome: string;
  rotulo: string;
  lat: number;
  lng: number;
};

// O catálogo publicado da API só tem estes pontos de São Paulo.
export const PONTOS: PontoCatalogo[] = [
  { codigo: '330210045', nome: 'Praca da Se', rotulo: 'Praça da Sé', lat: -23.55052, lng: -46.63331 },
  { codigo: '330880771', nome: 'Terminal Sao Mateus', rotulo: 'Terminal São Mateus', lat: -23.6094, lng: -46.4783 },
  { codigo: '220014331', nome: 'Metro Ana Rosa', rotulo: 'Metrô Ana Rosa', lat: -23.5815, lng: -46.6387 },
  { codigo: '220900112', nome: 'Terminal Lapa', rotulo: 'Terminal Lapa', lat: -23.5214, lng: -46.6995 },
  { codigo: '140088210', nome: 'Terminal Pirituba', rotulo: 'Terminal Pirituba', lat: -23.4885, lng: -46.726 },
  { codigo: '140015892', nome: 'Roberto Selmi Dei', rotulo: 'Roberto Selmi Dei', lat: -23.502, lng: -46.71 },
  { codigo: '510022640', nome: 'Metro Tucuruvi', rotulo: 'Metrô Tucuruvi', lat: -23.4801, lng: -46.6034 },
];

export function pontoPorCodigo(codigo: string) {
  return PONTOS.find((ponto) => ponto.codigo === codigo);
}

export function rotuloDoPonto(codigo: string) {
  return pontoPorCodigo(codigo)?.rotulo ?? codigo;
}
