# CASHIER

Gerenciador de fluxo de caixa.

## Tecnologias Utilizadas

- Node.js
- Express
- typescript
- inversify
- jest
- prisma

## Arquitetura do Projeto

Este projeto segue a Arquitetura Hexagonal (também conhecida como Ports and Adapters) para estruturar a aplicação de forma a permitir a separação de preocupações e facilitar a manutenção e a escalabilidade.

A arquitetura é dividida em três camadas principais:

1. **Camada de Infraestrutura**: Esta camada contém o código que comunica com o mundo exterior como banco de dados, serviços web e etc. No nosso caso, o Prisma é usado para a comunicação com o banco de dados.

2. **Camada de Aplicação**: Esta camada contém a lógica de negócios e regras da aplicação. Ela usa as portas definidas na camada de domínio para se comunicar com a camada de infraestrutura.

3. **Camada de Domínio**: Esta camada contém as entidades e as regras de negócios centrais da aplicação.

O projeto também utiliza o Inversify para a injeção de dependências, facilitando o gerenciamento de dependências entre as diferentes camadas e componentes.

Os testes são escritos usando o Jest, garantindo que a lógica de negócios funcione como esperado.

## Instalação

1. Clone o repositório
2. rode o comando `pnpm install`
3. suba o container no docker-compose
5. rode o comando `npx prisma migrate dev` em modo de ou `npx prisma migrate deploy` em prod