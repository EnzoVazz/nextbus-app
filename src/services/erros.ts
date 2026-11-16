import axios from 'axios';

export class ErroApi extends Error {
  status: number;
  codigo: string;
  mensagens: string[];

  constructor(status: number, codigo: string, mensagens: string[]) {
    super(mensagens[0] ?? 'Não foi possível concluir.');
    this.name = 'ErroApi';
    this.status = status;
    this.codigo = codigo;
    this.mensagens = mensagens;
  }
}

type CorpoErro = {
  erro?: string;
  mensagens?: string[];
};

export function lerErro(erro: unknown): ErroApi {
  if (erro instanceof ErroApi) {
    return erro;
  }

  if (axios.isAxiosError(erro)) {
    if (erro.code === 'ECONNABORTED') {
      return new ErroApi(0, 'tempo', [
        'O servidor demorou para responder. Se ele estiver dormindo, espere cerca de um minuto e tente de novo.',
      ]);
    }

    const status = erro.response?.status ?? 0;
    const dados = erro.response?.data;
    if (dados && typeof dados === 'object') {
      const corpo = dados as CorpoErro;
      const mensagens = Array.isArray(corpo.mensagens)
        ? corpo.mensagens.filter((mensagem) => typeof mensagem === 'string' && mensagem.length > 0)
        : [];
      return new ErroApi(status, corpo.erro ?? 'erro', mensagens.length > 0 ? mensagens : ['Não foi possível concluir.']);
    }

    if (!erro.response) {
      return new ErroApi(0, 'rede', ['Sem conexão com a API. Confira a internet e tente de novo.']);
    }
  }

  if (erro instanceof Error && erro.message) {
    return new ErroApi(0, 'erro', [erro.message]);
  }

  return new ErroApi(0, 'erro', ['Não foi possível concluir.']);
}
