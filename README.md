# NextBus

Aplicativo da Global Solution para a disciplina de Mobile Application Development. O cidadão grava a linha, o ponto e o horário. O gestor vê as linhas sem GPS recente.

A API fica em `https://nextbus-api.onrender.com`. Não há prefixo `/api`. A primeira chamada pode levar cerca de um minuto, porque o plano gratuito do Render dorme.

## Como rodar

```bash
npm install
npx expo start
```

No celular, use o Expo Go. No computador, `npx expo start --web`.

## O que o app faz

- Entrar, criar conta e sair. A conta nova nasce como cidadão e não recebe token.
- Cidadão: listar, criar, editar e apagar rotinas. O envio novo manda o cabeçalho `Idempotency-Key`.
- Cidadão: aviso do dia e planejamento de viagem direta.
- Cidadão e gestor: buscar linha, pontos perto, previsão e posição.
- Gestor: linhas sem GPS recente.
- Sobre: hash do commit usado na geração do app.

Uma rotina criada no celular aparece em `GET /rotinas`. O aviso novo não nasce no Render, porque a fila ficou no computador.

O app não guarda senha da Olho Vivo nem chave de inteligência artificial. No celular, o token fica no SecureStore. No navegador, ele fica no `localStorage`.

## Integrantes

Turma 2TDSPF.

- Enzo Vaz — RM 561702
- Lucas Ryuji Fukuda — RM 562152
- Pietro Donela Salomão — RM 561722
