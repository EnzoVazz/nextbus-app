import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Marca } from '@/components/Marca';
import { Texto } from '@/components/Texto';
import { lerErro } from '@/services/erros';
import { useSessao } from '@/services/sessao';
import { paletaClara } from '@/theme/cores';
import { useTema } from '@/theme/tema';

export default function Entrar() {
  const { contaCriada } = useLocalSearchParams<{ contaCriada?: string }>();
  const { entrar, usuario } = useSessao();
  const { cores } = useTema();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (usuario) router.replace('/');
  }, [usuario]);

  async function enviar() {
    const falhas: string[] = [];
    if (!email.includes('@')) falhas.push('Informe um email válido.');
    if (!senha) falhas.push('Informe a senha.');
    setMensagens(falhas);
    if (falhas.length > 0) return;

    setCarregando(true);
    try {
      await entrar(email, senha);
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={[estilos.tela, { backgroundColor: cores.papel }]}>
      <StatusBar style="light" />
      <View style={[estilos.faixa, { backgroundColor: cores.pinhoEscuro }]}>
        <Marca clara />
        <Texto style={[estilos.frase, { color: paletaClara.papel }]}>Seu ônibus, na hora de sair.</Texto>
      </View>
      <View style={estilos.formulario}>
        {contaCriada === '1' ? (
          <AvisoPainel tipo="info" mensagens={['Conta criada. Entre com o email e a senha.']} />
        ) : null}
        <AvisoPainel mensagens={mensagens} />
        <Campo
          rotulo="Email"
          valor={email}
          onChange={setEmail}
          teclado="email-address"
          autoCapitalize="none"
          dica="nome@email.com"
        />
        <Campo rotulo="Senha" valor={senha} onChange={setSenha} seguro autoCapitalize="none" />
        <Texto variante="miudo">
          A primeira entrada pode levar cerca de um minuto, pois o servidor ainda está acordando.
        </Texto>
        <Botao rotulo="Entrar" carregando={carregando} onPress={enviar} />
        <Botao rotulo="Criar conta" variante="secundario" onPress={() => router.push('/cadastro')} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
  },
  faixa: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 32,
    gap: 12,
  },
  frase: {
    fontSize: 18,
    lineHeight: 24,
  },
  formulario: {
    padding: 24,
    gap: 16,
  },
});
