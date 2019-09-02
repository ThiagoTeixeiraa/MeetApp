# MeetApp - Agregador de eventos para desenvolvedores

API Rest em NodeJS Para Gestão de Meetups, Utilizando Banco de dados Relacional (Postgree) e
Banco de dados Chave Valor (Redis)

### Iniciando o Projeto

- Para instalar as dependencias digite `npm install` no terminal.
- Crie um arquivo `.env` na raiz do projeto e sete as variáveis de ambiente de acordo com o que está no arquivo `.env.example`.
- Para criar as tabelas no banco de dados digite o comando no termminal `npx sequelize db:migrate` .
- Para iniciar o servidor de desenvolvimentto digite o comando no terminal `npm run dev`.
- Digite o comando `npm run queue` para iniciar a fila de emails.
