import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AvisoPainel } from '@/components/AvisoPainel';
import { Botao } from '@/components/Botao';
import { Campo } from '@/components/Campo';
import { Texto } from '@/components/Texto';
import { lerErro } from '@/services/erros';
import { useSessao } from '@/services/sessao';
import { useTema } from '@/theme/tema';

export default function Cadastro() {
  const { cadastrar } = useSessao();
  const { cores } = useTema();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagens, setMensagens] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  async function enviar() {
    const falhas: string[] = [];
    if (nome.trim().length < 2) falhas.push('Informe o nome.');
    if (!email.includes('@')) falhas.push('Informe um email válido.');
    if (senha.length < 6 || senha.length > 100) falhas.push('A senha precisa ter entre 6 e 100 caracteres.');
    setMensagens(falhas);
    if (falhas.length > 0) return;

    setCarregando(true);
    try {
      await cadastrar(nome, email, senha);
      router.replace({ pathname: '/entrar', params: { contaCriada: '1' } });
    } catch (erro) {
      setMensagens(lerErro(erro).mensagens);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={[estilos.tela, { backgroundColor: cores.papel }]}>
      <Texto variante="secao">Criar conta</Texto>
      <Texto variante="miudo">A conta nasce como cidadão. Depois do cadastro, entre de novo para receber o token.</Texto>
      <AvisoPainel mensagens={mensagens} />
      <Campo rotulo="Nome" valor={nome} onChange={setNome} autoCapitalize="words" />
      <Campo
        rotulo="Email"
        valor={email}
        onChange={setEmail}
        teclado="email-address"
        autoCapitalize="none"
        dica="nome@email.com"
      />
      <Campo rotulo="Senha" valor={senha} onChange={setSenha} seguro autoCapitalize="none" />
      <Texto variante="miudo">Se o servidor estiver dormindo, o cadastro pode levar cerca de um minuto.</Texto>
      <Botao rotulo="Cadastrar" carregando={carregando} onPress={enviar} />
      <Botao rotulo="Já tenho conta" variante="fantasma" onPress={() => router.replace('/entrar')} />
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    padding: 24,
    paddingTop: 64,
    gap: 16,
  },
});
