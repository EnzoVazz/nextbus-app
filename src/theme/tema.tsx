import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { guardarTemaEscuro, lerTemaEscuro } from '@/services/armazenamento';
import { paletaClara, paletaEscura, type Paleta } from '@/theme/cores';

type ContextoTema = {
  escuro: boolean;
  cores: Paleta;
  alternar: () => void;
};

const Contexto = createContext<ContextoTema | null>(null);

export function ProvedorTema({ children }: { children: ReactNode }) {
  const [escuro, setEscuro] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let ativo = true;
    lerTemaEscuro()
      .then((valor) => {
        if (!ativo) return;
        setEscuro(valor);
        setPronto(true);
      })
      .catch(() => {
        if (ativo) setPronto(true);
      });
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    void guardarTemaEscuro(escuro).catch(() => undefined);
  }, [escuro, pronto]);

  const valor = useMemo<ContextoTema>(
    () => ({
      escuro,
      cores: escuro ? paletaEscura : paletaClara,
      alternar() {
        setEscuro((atual) => !atual);
      },
    }),
    [escuro],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useTema() {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error('useTema precisa estar dentro do ProvedorTema.');
  }
  return contexto;
}
