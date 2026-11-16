import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Texto } from '@/components/Texto';
import { buscarLinhas } from '@/services/consulta';
import { DIAS } from '@/services/dias';
import { lerErro } from '@/services/erros';
import { pontoPorCodigo } from '@/services/pontosCatalogo';
import { limparRotina, validarRotina } from '@/services/rotinas';
import type { Linha, RotinaPedido, Sentido } from '@/services/tipos';
import { type Paleta } from '@/theme/cores';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

type Props = {
  inicial?: RotinaPedido | null;
  salvando: boolean;
  mensagens: string[];
  onSalvar: (pedido: RotinaPedido) => void;
  onExcluir?: () => void;
  excluindo?: boolean;
};

function horaDigitada(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 4);
  if (digitos.length <= 2) return digitos;
  return `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
}

export function FormularioRotina({
  inicial,
  salvando,
  mensagens,
  onSalvar,
  onExcluir,
  excluindo = false,
}: Props) {
  const [codigoLinha, setCodigoLinha] = useState(inicial?.codigoLinha ?? '');
  const [letreiro, setLetreiro] = useState(inicial?.letreiro ?? '');
  const [sentido, setSentido] = useState<Sentido>(inicial?.sentido ?? 'IDA');
  const [codigoParada, setCodigoParada] = useState(inicial?.codigoParada ?? '');
  const [nomeParada, setNomeParada] = useState(inicial?.nomeParada ?? '');
  const [dias, setDias] = useState<string[]>(inicial?.diasSemana ? inicial.diasSemana.split(',') : []);
  const [horario, setHorario] = useState(inicial?.horarioEmbarque ?? '');
  const [ativa, setAtiva] = useState(inicial?.ativa ?? true);
  const [busca, setBusca] = useState('');
  const [linhas, setLinhas] = useState<Linha[]>([]);
  const [paradasDaLinha, setParadasDaLinha] = useState<string[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [erroBusca, setErroBusca] = useState<string[]>([]);
  const [locais, setLocais] = useState<string[]>([]);
  const { cores } = useTema();
  const estilos = useMemo(() => criarEstilos(cores), [cores]);

  async function procurarLinha() {
    setBuscando(true);
    setErroBusca([]);
    try {
      setLinhas(await buscarLinhas(busca.trim()));
    } catch (erro) {
      setLinhas([]);
      setErroBusca(lerErro(erro).mensagens);
    } finally {
      setBuscando(false);
    }
  }

  function escolherLinha(linha: Linha) {
    setCodigoLinha(linha.codigo);
    setLetreiro(linha.letreiro);
    setSentido(linha.sentido);
    setParadasDaLinha(linha.paradas);
    setLocais([]);
  }

  function escolherParada(codigo: string) {
    const ponto = pontoPorCodigo(codigo);
    setCodigoParada(codigo);
    setNomeParada(ponto?.rotulo ?? '');
    setLocais([]);
  }

  function alternarDia(valor: string) {
    setDias((atuais) => {
      const proximo = atuais.includes(valor) ? atuais.filter((dia) => dia !== valor) : [...atuais, valor];
      return [...proximo].sort();
    });
    setLocais([]);
  }

  function salvar() {
    const pedido = limparRotina({
      codigoLinha,
      letreiro,
      sentido,
      codigoParada,
      nomeParada,
      diasSemana: dias.join(','),
      horarioEmbarque: horario,
      ativa,
    });
    const falhas = validarRotina(pedido);
    setLocais(falhas);
    if (falhas.length === 0) onSalvar(pedido);
  }

  const avisos = locais.length > 0 ? locais : mensagens;

  return (
    <View style={estilos.bloco}>
      <Texto variante="miudo">
        Ida e volta são duas rotinas. 1 é segunda e 7 é domingo. Uma rotina nova no celular aparece na lista, mas não
        cria aviso no servidor publicado.
      </Texto>
      <AvisoPainel mensagens={avisos} />

      <Campo
        rotulo="Buscar linha"
        valor={busca}
        onChange={setBusca}
        autoCapitalize="characters"
        dica="7021 ou Pirituba"
      />
      <Botao rotulo="Buscar no catálogo" variante="secundario" carregando={buscando} onPress={procurarLinha} />
      <AvisoPainel mensagens={erroBusca} />
      {linhas.map((linha) => (
        <Pressable
          key={linha.codigo}
          accessibilityRole="button"
          accessibilityLabel={`${linha.letreiro} ${linha.nome}`}
          onPress={() => escolherLinha(linha)}
          style={estilos.opcao}>
          <Texto variante="forte">
            {linha.letreiro} · {linha.sentido === 'IDA' ? 'Ida' : 'Volta'}
          </Texto>
          <Texto variante="miudo">{linha.nome}</Texto>
        </Pressable>
      ))}

      <Campo rotulo="Código da linha" valor={codigoLinha} onChange={setCodigoLinha} autoCapitalize="none" />
      <Campo rotulo="Letreiro" valor={letreiro} onChange={setLetreiro} autoCapitalize="characters" />

      <Texto variante="forte">Sentido</Texto>
      <View style={estilos.fileira}>
        {(['IDA', 'VOLTA'] as const).map((opcao) => {
          const escolhido = sentido === opcao;
          return (
            <Pressable
              key={opcao}
              accessibilityRole="button"
              accessibilityState={{ selected: escolhido }}
              onPress={() => setSentido(opcao)}
              style={[estilos.chip, escolhido && estilos.chipAtivo]}>
              <Texto style={[estilos.chipTexto, escolhido && estilos.chipTextoAtivo]}>
                {opcao === 'IDA' ? 'Ida' : 'Volta'}
              </Texto>
            </Pressable>
          );
        })}
      </View>

      {paradasDaLinha.length > 0 ? (
        <View style={estilos.bloco}>
          <Texto variante="forte">Pontos dessa linha</Texto>
          {paradasDaLinha.map((codigo) => (
            <Pressable
              key={codigo}
              accessibilityRole="button"
              onPress={() => escolherParada(codigo)}
              style={estilos.opcao}>
              <Texto variante="forte">{pontoPorCodigo(codigo)?.rotulo ?? 'Ponto do catálogo'}</Texto>
              <Texto variante="miudo">{codigo}</Texto>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Campo rotulo="Código do ponto" valor={codigoParada} onChange={setCodigoParada} autoCapitalize="none" />
      <Campo rotulo="Nome do ponto" valor={nomeParada} onChange={setNomeParada} />

      <Texto variante="forte">Dias</Texto>
      <View style={estilos.fileira}>
        {DIAS.map((dia) => {
          const escolhido = dias.includes(dia.valor);
          return (
            <Pressable
              key={dia.valor}
              accessibilityRole="button"
              accessibilityState={{ selected: escolhido }}
              accessibilityLabel={dia.nome}
              onPress={() => alternarDia(dia.valor)}
              style={[estilos.chip, escolhido && estilos.chipAtivo]}>
              <Texto style={[estilos.chipTexto, escolhido && estilos.chipTextoAtivo]}>{dia.nome}</Texto>
            </Pressable>
          );
        })}
      </View>

      <Campo
        rotulo="Horário de embarque"
        valor={horario}
        onChange={(valor) => setHorario(horaDigitada(valor))}
        teclado="number-pad"
        dica="07:15"
        maxLength={5}
      />

      <View style={estilos.interruptor}>
        <Texto variante="forte">{ativa ? 'Rotina ativa' : 'Rotina desligada'}</Texto>
        <Switch
          accessibilityLabel="Rotina ativa"
          value={ativa}
          onValueChange={setAtiva}
          trackColor={{ false: cores.linha, true: cores.pinho }}
          thumbColor={cores.branco}
        />
      </View>

      <Botao rotulo="Salvar rotina" carregando={salvando} onPress={salvar} />
      {onExcluir ? (
        <Botao rotulo="Excluir rotina" variante="perigo" carregando={excluindo} onPress={onExcluir} />
      ) : null}
    </View>
  );
}

function criarEstilos(cores: Paleta) {
  return StyleSheet.create({
    bloco: {
      gap: 12,
    },
    fileira: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      minHeight: 44,
      paddingHorizontal: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: cores.linha,
      backgroundColor: cores.cartao,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipAtivo: {
      backgroundColor: cores.pinho,
      borderColor: cores.pinho,
    },
    chipTexto: {
      fontFamily: fontes.textoMedio,
      color: cores.tinta,
    },
    chipTextoAtivo: {
      color: cores.branco,
    },
    opcao: {
      borderRadius: 14,
      borderWidth: 1,
      borderColor: cores.linha,
      backgroundColor: cores.cartao,
      padding: 12,
      gap: 2,
    },
    interruptor: {
      minHeight: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: cores.linha,
      backgroundColor: cores.cartao,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
}
