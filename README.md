# 🚌 NextBus

## Global Solution FIAP

O **NextBus** é o aplicativo móvel de quem pega ônibus em São Paulo. O cidadão grava a linha, o ponto e o horário de embarque. Na hora de sair, o app mostra o aviso do dia, a previsão e o caminho da linha no mapa. O gestor acompanha as linhas cujo GPS está velho.

---

## 👥 Equipe - 2TDSPF

| Nome                   | RM     |
| ---------------------- | ------ |
| Enzo Vaz               | 561702 |
| Lucas Ryuji Fukuda     | 562152 |
| Pietro Donela Salomão  | 561722 |

---

## 🚀 Funcionalidades

O aplicativo consome a API REST em Java (Spring Boot). Os dados ficam no banco e não só no celular.

### 🔒 Autenticação e segurança

* Tela de cadastro. A conta nova nasce como cidadão e ainda não recebe token.
* Login com **JWT**. As telas de dentro só abrem depois da entrada.
* Sair apaga a sessão. No celular o token fica no **SecureStore**. No navegador, no `localStorage`.
* O app não guarda senha da Olho Vivo nem chave de inteligência artificial.

### 🗓️ Rotinas (CRUD)

* Criar a rotina de embarque, com o cabeçalho `Idempotency-Key` (**Create**).
* Listar as rotinas do cidadão, com paginação (**Read**).
* Editar linha, ponto, dias, horário e se a rotina está ativa (**Update**).
* Apagar a rotina. Se ela já tiver aviso, a API recusa a exclusão (**Delete**).

### 🗺️ Consulta, viagem e mapa

* Buscar linha, ver a posição do ônibus e a previsão no ponto.
* Planejar a viagem direta entre os pontos do catálogo.
* Mapa com a pessoa, os pontos e o traço da linha pelas ruas.
* Toque num ponto para ver quais linhas passam ali. Toque de novo para desmarcar.
* Perfil com o nome mostrado no aparelho, modo escuro, Sobre e sair.
* Gestor: linhas sem GPS recente.

Uma rotina criada no celular aparece em `GET /rotinas`. O aviso novo não nasce no servidor publicado, porque a fila ficou no computador.

---

## 🛠 Tecnologias utilizadas

* **React Native**
* **Expo**
* **Expo Router**
* **Axios**
* **expo-secure-store** (sessão no celular)
* **Java / Spring Boot** (API consumida pelo aplicativo)
* **Oracle Database** (persistência no backend)

---

## 📌 Estrutura de navegação

O projeto usa **Expo Router**. Cada arquivo em `src/app` é uma tela.

### Rotas disponíveis

1. **Entrar** → `src/app/entrar.tsx`
2. **Cadastro** → `src/app/cadastro.tsx`
3. **Início** → `src/app/(app)/(abas)/index.tsx`
4. **Rotinas** → `src/app/(app)/(abas)/rotinas.tsx`
5. **Nova rotina** → `src/app/(app)/rotina/nova.tsx`
6. **Editar rotina** → `src/app/(app)/rotina/[id].tsx`
7. **Viagem** → `src/app/(app)/(abas)/planejar.tsx`
8. **Ônibus** → `src/app/(app)/(abas)/consultar.tsx`
9. **Operação** → `src/app/(app)/(abas)/operacao.tsx`
10. **Perfil** → `src/app/(app)/perfil.tsx`
11. **Sobre o app** → `src/app/(app)/sobre.tsx`

A tela Sobre mostra o hash do commit usado na geração do app. Ela não entra na conta das seis telas.

---

## 🎬 Demonstração

👉 **https://youtube.com/shorts/Nm8dkKORv9U**

---

## 📱 Como executar o projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/EnzoVazz/nextbus-app.git
```

### 2️⃣ Acesse a pasta do projeto

```bash
cd nextbus-app
```

### 3️⃣ Instale as dependências

```bash
npm install
```

---

## ☁️ API em nuvem

O backend já está no **Render**, com o banco **Oracle da FIAP**. Não precisa subir a API no computador para testar o aplicativo.

Não há prefixo `/api`. A primeira chamada pode levar cerca de um minuto, pois o servidor ainda está acordando.

```text
https://nextbus-api.onrender.com
```

---

## 🔐 Credenciais de acesso (teste)

| Papel    | E-mail                      | Senha  |
| -------- | --------------------------- | ------ |
| Cidadão  | marina.costa@email.com      | 123456 |
| Gestor   | ricardo.nunes@email.com     | 123456 |

> Estas contas já estão no banco publicado.

---

## ▶️ Execução da aplicação

```bash
npx expo start
```

### Opções de execução

* 📱 Ler o QR Code pelo **Expo Go**.
* 💻 No computador, `npx expo start --web`.
* 🤖 Pressionar `a` para abrir no emulador Android.
* 🍎 Pressionar `i` para abrir no simulador iOS.

---

## 🎯 Objetivo do projeto

Este projeto foi desenvolvido como parte da **Global Solution FIAP**, na disciplina de Mobile Application Development, dentro do tema CitizenTech.

### Principais objetivos

* 🚌 Avisar o cidadão na hora de sair para o ônibus.
* 🗓️ Guardar a rotina de embarque na API, com criação, leitura, edição e exclusão.
* 🗺️ Mostrar o ponto, a previsão e o caminho da linha.
* 👮 Dar ao gestor a lista de linhas sem GPS recente.
* 🔗 Ligar o aplicativo móvel ao backend Java publicado.
