export type Papel = 'CIDADAO' | 'GESTOR';
export type Sentido = 'IDA' | 'VOLTA';

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
};

export type Sessao = Usuario & {
  token: string;
};

export type RespostaLogin = Usuario & {
  token: string;
  tipo: string;
};

export type Rotina = {
  id: number;
  codigoLinha: string;
  letreiro: string;
  sentido: Sentido;
  codigoParada: string;
  nomeParada: string;
  diasSemana: string;
  horarioEmbarque: string;
  ativa: boolean;
};

export type RotinaPedido = Omit<Rotina, 'id'>;

export type Pagina<T> = {
  conteudo: T[];
  pagina: number;
  tamanho: number;
  totalElementos: number;
  totalPaginas: number;
};

export type Aviso = {
  id: number;
  rotinaId: number;
  data: string;
  letreiro: string;
  nomePonto: string;
  identificadorVeiculo: string;
  minutos: number;
  idadeGpsSegundos: number;
  texto: string;
  textoCurto: string;
  comunicado: string | null;
  status: string;
};

export type Linha = {
  codigo: string;
  letreiro: string;
  sentido: Sentido;
  nome: string;
  paradas: string[];
};

export type Parada = {
  codigo: string;
  nome: string;
  lat: number;
  lng: number;
};

export type ParadaProxima = {
  parada: Parada;
  distanciaMetros: number;
};

export type PosicaoOnibus = {
  id: string;
  letreiro: string;
  sentido: Sentido;
  lat: number;
  lng: number;
  idadeGpsSegundos: number;
  acessivel: boolean;
};

export type VeiculoPrevisto = {
  id: string;
  minutos: number;
  idadeGpsSegundos: number;
};

export type Previsao = {
  relogio: string;
  veiculos: VeiculoPrevisto[];
};

export type OpcaoViagem = {
  codigoParada: string;
  nomeParada: string;
  codigoLinha: string;
  letreiro: string;
  sentido: Sentido;
  minutos: number;
  caminhadaMetros: number;
};

export type LinhaSemGps = {
  codigo: string;
  letreiro: string;
  idadeGpsSegundos: number;
};

export type PedidoViagem = {
  origemLat: number;
  origemLng: number;
  destino: string;
};
