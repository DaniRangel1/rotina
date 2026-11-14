# Rotina

Programa de desktop minimalista para organizar tarefas em **blocos do dia**: manhã, tarde e noite.

A proposta é ter uma tela limpa, com pouca distração, que destaca o bloco do horário atual para ajudar a manter o foco no que importa agora.

## Funcionalidades

- Três blocos: **Manhã**, **Tarde** e **Noite**
- Adicionar tarefas em cada bloco (botão ou tecla Enter)
- Marcar tarefas como feitas (o texto fica riscado)
- Apagar tarefas
- **Destaque automático** do bloco do horário atual, com os outros mais apagados
- Botão **Começar um novo dia**: desmarca tudo e mantém as tarefas
- As tarefas ficam **salvas** ao fechar o programa
- Cores suaves, fonte legível e sem animações ou notificações

## Tecnologias

- [Electron](https://www.electronjs.org/) (programa de desktop)
- HTML, CSS e JavaScript puro
- `localStorage` para salvar os dados

## Como rodar

Você precisa ter o [Node.js](https://nodejs.org/) instalado.

```bash
git clone https://github.com/SEU-USUARIO/rotina.git
cd rotina
npm install
npm start
```

Troque `SEU-USUARIO` pelo nome de usuário do dono do repositório.

## Como gerar o executável (Windows)

```bash
npx @electron/packager . Rotina --platform=win32 --arch=x64 --out=dist --overwrite
```

O programa fica na pasta `dist/Rotina-win32-x64`.

> **Aviso:** o executável não tem assinatura digital. O Windows pode mostrar um aviso do SmartScreen, e o Controle Inteligente de Aplicativos pode bloqueá-lo. Nesse caso, use `npm start`.

## Estrutura do projeto

```
rotina/
├── main.js        # abre a janela do Electron
├── index.html     # estrutura da tela
├── estilo.css     # visual
├── app.js         # lógica: tarefas, salvar, destaque do bloco atual
└── package.json   # informações e dependências do projeto
```

## Ideias para o futuro

- Modo de uma tarefa por vez, para foco
- Lembrete suave no início de cada bloco
- Ícone próprio para o programa

## Autor

**Dai Rangel**, estudante de Ciência da Computação.
