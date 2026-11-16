import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { definirToken, registrarSaida } from '@/services/api';
import { apagarSessao, guardarSessao, lerSessao } from '@/services/armazenamento';
import { buscarEu, entrarComSenha, registrarConta } from '@/services/auth';
import type { Sessao } from '@/services/tipos';

type ContextoSessao = {
  usuario: Sessao | null;
  carregando: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
  atualizarNome: (nome: string) => Promise<void>;
  sair: () => Promise<void>;
};

const Contexto = createContext<ContextoSessao | null>(null);

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Sessao | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    registrarSaida(() => {
      if (ativo) setUsuario(null);
    });

    (async () => {
      const guardada = await lerSessao();
      if (!ativo) return;
      if (guardada) {
        definirToken(guardada.token);
        setUsuario(guardada);
      }
      setCarregando(false);
      if (!guardada) return;

      try {
        const atual = await buscarEu();
        if (!ativo) return;
        const nova: Sessao = { ...guardada, ...atual, token: guardada.token, nome: guardada.nome };
        await guardarSessao(nova);
        if (ativo) setUsuario(nova);
      } catch {
        // 401 limpa a sessão no cliente da API.
      }
    })();

    return () => {
      ativo = false;
    };
  }, []);

  const valor = useMemo<ContextoSessao>(
    () => ({
      usuario,
      carregando,
      async entrar(email: string, senha: string) {
        const resposta = await entrarComSenha(email.trim(), senha);
        const sessao: Sessao = {
          token: resposta.token,
          id: resposta.id,
          nome: resposta.nome,
          email: resposta.email,
          papel: resposta.papel,
        };
        definirToken(sessao.token);
        await guardarSessao(sessao);
        setUsuario(sessao);
      },
      async cadastrar(nome: string, email: string, senha: string) {
        await registrarConta(nome.trim(), email.trim(), senha);
      },
      async atualizarNome(nome: string) {
        if (!usuario) return;
        const nova: Sessao = { ...usuario, nome: nome.trim() };
        await guardarSessao(nova);
        setUsuario(nova);
      },
      async sair() {
        definirToken(null);
        await apagarSessao();
        setUsuario(null);
      },
    }),
    [usuario, carregando],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSessao() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error('useSessao precisa estar dentro do ProvedorSessao.');
  }
  return contexto;
}
