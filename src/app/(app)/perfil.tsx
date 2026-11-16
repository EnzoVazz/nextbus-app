import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Tela } from '@/components/Tela';
import { Texto } from '@/components/Texto';
import { useSessao } from '@/services/sessao';
import { fontes } from '@/theme/fontes';
import { useTema } from '@/theme/tema';

export default function Perfil() {
  const { usuario, atualizarNome, sair } = useSessao();
  const { cores, escuro, alternar } = useTema();
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [aviso, setAviso] = useState('');
  const cidadao = usuario?.papel === 'CIDADAO';

  async function salvarNome() {
    const limpo = nome.trim();
    if (limpo.length < 2) {
      setAviso('');
      setMensagens(['Informe o nome.']);
      return;
    }
    if (limpo.length > 120) {
      setAviso('');
      setMensagens(['O nome pode ter no máximo 120 caracteres.']);
      return;
    }
    if (limpo === usuario?.nome) {
      setMensagens([]);
      setAviso('');
      return;
    }
    await atualizarNome(limpo);
    setNome(limpo);
    setMensagens([]);
    setAviso('Nome atualizado.');
  }

  return (
    <Tela comCabecalho>
      <View>
        <Texto variante="secao">{usuario?.nome}</Texto>
        <Texto variante="miudo">{usuario?.email}</Texto>
        <View style={[estilos.selo, { backgroundColor: cores.ambarClaro }]}>
          <Texto style={[estilos.seloTexto, { color: cores.tinta }]}>{cidadao ? 'Cidadão' : 'Gestor'}</Texto>
        </View>
      </View>

      <AvisoPainel mensagens={mensagens} />
      {aviso ? <AvisoPainel tipo="info" mensagens={[aviso]} /> : null}
      <Campo rotulo="Nome" valor={nome} onChange={setNome} autoCapitalize="words" maxLength={120} />
      <Texto variante="miudo">Esse nome aparece neste aparelho. Entrar de novo volta ao nome da conta.</Texto>
      <Botao rotulo="Salvar nome" onPress={() => void salvarNome()} />

      <View style={[estilos.interruptor, { borderColor: cores.linha, backgroundColor: cores.cartao }]}>
        <Texto variante="forte">{escuro ? 'Modo escuro ligado' : 'Modo escuro desligado'}</Texto>
        <Switch
          accessibilityLabel={escuro ? 'Desligar modo escuro' : 'Ligar modo escuro'}
          value={escuro}
          onValueChange={alternar}
          trackColor={{ false: cores.linha, true: cores.pinho }}
          thumbColor={cores.branco}
        />
      </View>

      <Botao rotulo="Sobre o app" variante="secundario" onPress={() => router.push('/sobre')} />
      <Botao rotulo="Sair" variante="fantasma" onPress={() => void sair()} />
    </Tela>
  );
}

const estilos = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  seloTexto: {
    fontFamily: fontes.textoMedio,
    fontSize: 13,
  },
  interruptor: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
