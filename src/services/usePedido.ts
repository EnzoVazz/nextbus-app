import { useState } from 'react';

import { lerErro } from '@/services/erros';

export function usePedido() {
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState<string[]>([]);

  async function executar<T>(acao: () => Promise<T>): Promise<T | null> {
    setCarregando(true);
    setMensagens([]);
    try {
      return await acao();
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
      return null;
    } finally {
      setCarregando(false);
    }
  }

  return { carregando, mensagens, setMensagens, executar };
}
