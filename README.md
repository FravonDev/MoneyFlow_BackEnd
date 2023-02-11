## **Iniciando o projeto**

Iniciei o projeto com Node.js, configurei o Typescript para garantir uma boa estruturação e organização do código. Utilizei o comando npm init para gerar o arquivo package.json, que é responsável por gerenciar as dependências do projeto. Em seguida, utilizei o comando npm install para instalar as dependências necessárias, como o prisma para gerenciar o banco de dados e outras dependências importantes para o projeto, garantindo assim uma boa estruturação e organização do projeto.

## Gerenciando o versionamento Gitflow

Estou utilizando GitFlow como metodologia de gerenciamento de branches no Git. Isso me ajuda a manter o código controlado e organizado, evitando conflitos e garantindo que só o código testado e estável seja incluído no repositório principal. Isso torna o meu desenvolvimento mais eficiente e organizado. Além disso, o uso do GitFlow facilita o gerenciamento de versões, tornando mais fácil rastrear e corrigir problemas, e garantindo a estabilidade do código no repositório principal.

## Criando base de dados

Criei um banco de dados postgreSQL localmente para utilizar no ambiente de desenvolvimento. Conectei o banco de dados no arquivo .env através da variável DATABASE_URL para garantir a conexão correta com o banco de dados, deixando-o pronto para que usemos no prisma.

## Definindo os modelos e relações da base de dados com o Prisma

Vamos utilizar o Prisma para gerenciar nossa base de dados. Ele irá se conectar ao banco de dados configurado na variável de ambiente DATABASE_URL, localizada no arquivo .env.

O código no diretório **prisma/schema.prisma** é um esquema Prisma que define os modelos e relações para a base de dados. Ele define três modelos: User, Income e Outcome e as relações entre eles.

**Modelos**:

- User: define o campo balance, nome, e-mail e password e as relações com Income e Outcome. Cada usuário tem seu saldo.
- Income: define os campos id, value, description, createdAt, User e userId. Os Incomes são as entradas do usuário.
- Outcome: define os campos id, value, description, createdAt, User e userId. Os Outcomes são as saídas do usuário.

**Relações**:

- User tem relações com Income e Outcome, o que significa que cada usuário tem uma lista de rendimentos e despesas.
- Income e Outcome tem relações com User, o que significa que cada rendimento e despesa é associado a um usuário específico.

Indexação:
Os campos Income e Outcome estão usando indexação, que basicamente organiza os dados utilizando palavras-chave para otimizar o desempenho do banco de dados (relacional), similar ao sumário de um livro. Isso ajuda a garantir que as consultas sejam executadas de forma rápida e eficiente.

Nota: é necessário configurar as variáveis de ambiente necessárias antes de executar o código e configurar o banco de dados.

## Utilizando Prisma

vamos criar um um arquivo chamado **prisma.ts** ou **client.ts**, e vamos instanciar o **PrismaClient()**, que é uma API de alto nível para realizar operações CRUD, com ela vamos acessar e gerenciar o nosso banco de dados.

## Criando o servidor web

Criamos um arquivo chamado **index.ts** que é uma boa prática, pois esta é a nomemclatura que muitos servidores buscam.

O código no arquivo **index.ts**  configura um servidor web utilizando o Express.js, um framework para Node.js. Ele também importa dependências para habilitar o log das requisições (morgan), controlar o acesso à aplicação (cors) e gerenciar as rotas (routes). Além disso, ele utiliza o pacote dotenv para carregar as variáveis de ambiente.

**Dependências**:

- express: utilizado para configurar o servidor web
- morgan: utilizado para habilitar o log das requisições
- cors: utilizado para controlar o acesso à aplicação
- routes: arquivo que contém as rotas da aplicação
- dotenv: utilizado para carregar as variáveis de ambiente
- errorMiddleware: utilizado para tratar erros
- express-async-errors: utilizado para lidar com erros de forma assíncrona
- Joi: utilizado para verificar as requisições
- jsonwebtoken: utilizado para gerar e validar tokens JWT

**Como funciona:**

1. O código importa as dependências necessárias.
2. Ele cria uma instância do Express.js chamada app.
3. Utiliza o morgan para habilitar o log das requisições.
4. Utiliza o cors para controlar o acesso à aplicação.
5. Utiliza o express.json() e o express.urlencoded() para habilitar o suporte ao corpo da requisição em formato json e urlencoded.
6. Utiliza as rotas importadas para gerenciar as rotas da aplicação.
7. utiliza o middleware de erro
8. Utiliza a variável de ambiente PORT para definir a porta em que o servidor irá escutar.
9. O servidor escuta na porta especificada e imprime uma mensagem no console quando iniciado.

Nota: Lembre-se de configurar as variáveis de ambiente necessárias antes de executar o código. Além disso, é importante mencionar que quando houver uma nova operação de entrada ou saída (Income ou Outcome), o saldo (balance) da tabela de usuários (User) deve ser atualizado. Como o Prisma não tem triggers, é necessário criar uma função para atualizar o saldo e utilizá-la nas funções que devem mudar o saldo.

## **Utilizando o Repository Pattern**

Estou utilizando o Repository Pattern para organizar o código e facilitar os testes. Este padrão é muito utilizado com o prisma, pois ele nos permite separar as responsabilidades de acesso a dados e lógica de negócios.

Dessa forma, é mais fácil testar cada parte do código separadamente, garantindo assim a qualidade do código. Além disso, é mais fácil de entender e manter o código, pois cada parte tem sua responsabilidade bem definida.

### Interfaces

As interfaces são usadas para definir o formato dos objetos usados na aplicação, garantindo que todas as partes da aplicação estejam trabalhando com objetos consistentes.

Neste projetos usamos as interfaces:

- IIncome.ts: Define a estrutura de objetos de renda
- INewIncome.ts: Define a estrutura de dados de nova renda a ser adicionada
- INewOutcome.ts: Define a estrutura de dados de nova despesa a ser adicionada
- INewUser.ts: Define a estrutura de dados de novo usuário a ser adicionado
- IOutcome.ts: Define a estrutura de objetos de despesa
- IUser.ts: Define a estrutura de objetos de usuários."

### Repositórios

No diretório "repositories", estão as classes que se comunicam diretamente com o banco de dados, através do prisma. Já no diretório "interfaces", estão as interfaces que garantem que os tipos de dados estão corretos e são passados para os repositórios.

**UserRepository.ts:**

- createUser: responsável por inserir novos usuários no banco de dados
- existsUser: verifica se o e-mail já esta sendo usado por algum usuário
- getUser: busca um usuário que tenha o login e senha correspondentes
- deleteUser: remove um usuário que tenha o email e senha correspondentes
- updateUserBalance: Atualiza os dados de saldo do usuário sempre que houver alguma transação, similar aos triggers do banco de dados

**IncomeRepository.ts:**

- createIncome: responsável por inserir novos incomes no banco de dados
- getIncomes: busca todos os incomes relacionados a um usuário
- updateIncome: atualiza os dados de um income
- deleteIncome: remove um income específico

**OutcomeRepository.ts:**

- createOutcome: responsável por inserir novos outcomes no banco de dados
- getOutcomes: busca todos os outcomes relacionados a um usuário
- updateOutcome: atualiza os dados de um outcome
- deleteOutcome: remove um outcome específico

## Teste unitário nos repositórios

Os repositórios são responsáveis por gerenciar as operações de banco de dados, então é importante testar esses métodos para garantir que eles estejam funcionando corretamente e tratando possíveis erros. Isso garante que a aplicação possa funcionar de forma consistente e confiável. Usei funções mockadas para fazer os testes com jest pois elas simulam a implementação dos métodos do repositório, permitindo testar a lógica da aplicação sem depender de uma base de dados real

Para cada arquivo de Repository, um arquivo de testes será criado, começando pelo UserRepository.test.ts.

**Testes UserRepository.test.ts**

- **Teste createUser**: Testa se um usuário é criado corretamente e se ele tem as propriedades esperadas, como nome, email, saldo e senha. Além disso, verifica se o id é gerado corretamente.
- **Teste getUser**: Testa se é possível buscar um usuário pelo email e senha. Verifica se o usuário buscado possui o email e senha esperados.
- **Teste existsUser**: Testa se a função existsUser retorna corretamente se um usuário existe ou não.
- **Teste deleteUser**: Testa se é possível deletar um usuário pelo email e senha. Verifica se o usuário foi removido corretamente.

**Testes IncomeRepository.test.ts**

- **Teste createIncome**: Testa se uma entrada é criada corretamente e se ela tem as propriedades esperadas, como descrição, valor e data. Além disso, verifica se o id é gerado corretamente.
- **Teste getIncome**: Testa se é possível buscar uma entrada pelo id. Verifica se a entrada buscada possui as propriedades esperadas.
- **Teste getAllIncomes**: Testa se é possível buscar todas as entradas de um usuário. Verifica se todas as entradas do usuário possuem as propriedades esperadas.
- **Teste updateIncome**: Testa se é possível atualizar uma entrada pelo id. Verifica se a entrada atualizada possui as propriedades atualizadas.
- **Teste deleteIncome**: Testa se é possível deletar uma entrada pelo id. Verifica se a entrada foi removida corretamente.

**Testes OutcomeRepository.test.ts**

- **Teste createOutcome**: Testa se uma saída é criada corretamente e se ela tem as propriedades esperadas, como descrição, valor e data. Além disso, verifica se o id é gerado corretamente.
- **Teste getOutcome**: Testa se é possível buscar uma saída pelo id. Verifica se a saída buscada possui as propriedades esperadas.
- **Teste getAllOutcomes**: Testa se é possível buscar todas as saídas de um usuário. Verifica se todas as saídas do usuário possuem as propriedades esperadas.
- **Teste updateOutcome**: Testa se é possível atualizar uma saída pelo id. Verifica se a saída atualizada possui as propriedades atualizadas.
- **Teste deleteOutcome**: Testa se é possível deletar uma saída pelo id. Verifica se a saída foi removida corretamente.

## **Controllers**

Nossos controllers são a camada da aplicação responsáveis pela lógica de negócios, lidando diretamente com as rotas. no UserController.ts, temos:

- **Register**: responsável pela lógica de negócios referente ao registro de novos usuários, validando, comunicando com os repositórios, tratando das requisições HTTP. criando o hash da senha com o bcrypt
- **Login**: responsável pela lógica de negócios referente ao login de usuários cadastrados. Verifica se as credenciais fornecidas pelo usuário são válidas e se correspondem a algum usuário cadastrado no banco de dados. Em caso positivo, o servidor gera e envia um token de autenticação para o usuário.
- **Logout**: responsável por deslogar usuários. Valida o token de autenticação do usuário com o middleware de autenticação e, em seguida, revoga o token, tornando-o inválido para futuras requisições. Isso impede que o usuário acesse recursos protegidos após o logout.
## Criação rotas
As rotas são a porta de entrada para o usuário interagir com o sistema e realizar as ações desejadas. As rotas são criadas com a biblioteca Express, que facilita a criação de rotas de forma simples e organizada.
além das rotas básicas, é importante adicionar validações e tratamentos de erro para garantir a segurança e a qualidade da aplicação, para isso, são criados os controllers, que são responsáveis por realizar as valdiações e a integração entre as camadas da aplicação

Rota de Registro:
A rota de registro é responsável por permitir que um novo usuário se cadastre na aplicação. Ela utiliza o método POST e recebe os dados do usuário (nome, email e senha) através da requisição.


Antes de registrar o usuário, é realizada uma série de validações para garantir que os dados enviados são válidos e seguem as regras da aplicação (por exemplo, o email não pode já estar em uso). Caso alguma validação falhe, é retornado um status code de erro (400 - Bad Request) junto com uma mensagem de erro específica.


Se todas as validações passarem, o usuário é registrado e é retornado um status code de sucesso (201 - Created) junto com o corpo da resposta, que inclui o ID, nome e email do usuário registrado.

## Teste de integração nas rotas

Para verificar se as partes da aplicação funcionam corretamente juntas,  A biblioteca supertest é usada para realizar requisições HTTP e a classe UserRepository é instanciada para acessar a camada responsável  pelos dados dos usuários.

Rota register (POST):

Os testes cobrem três cenários:
-Criação de um novo usuário com sucesso
- Retorno de erro quando o email já está em uso
- Retorno de erro quando os dados da requisição são inválidos

Cada cenário é descrito com a função it e verifica o status code e o corpo da resposta para garantir que o comportamento esperado seja alcançado.

Rota login (POST):

Os testem cobrem 4 cenários  

- Cria um usuário exclusivamente para esse teste

- Login bem sucedido retorna os dados de autenticação do usuário, incluindo o token de autenticação

- Retorno do erro 404 quando o email está incorreto retorna uma mensagem de erro indicando que o usuário não foi encontrado

- Retorno do erro 404 quando a senha está incorreta retorna uma mensagem de erro indicando que o email ou a senha estão incorretos.

Rota logout (POST):

Os testem cobrem quatro cenários

- Cria um usuário exclusivamente para esse teste

- Faz o login desse usuário teste

- No logout desse usuário, retorna 204, caso seja um token valido

- Caso falhe retorna 500 e mensagem referente a token inválido

## Validação dos dados da ****requisição****

A fim de garantir que as informações recebidas em nossas requisições sejam válidas, criamos uma função de validação usando joi.

As regras específicas para cada campo são definidas em uma estrutura de objeto, incluindo tipo de dados, tamanho mínimo e máximo, obrigatoriedade, entre outras. Se algum dado não satisfizer as regras definidas, uma exceção será lançada com uma mensagem de erro personalizada.

Esta validação é importante para garantir que nossa aplicação funcione de forma correta e evitar problemas relacionados a dados inválidos ou incompletos. Além disso, ela contribui para a segurança da aplicação, impedindo a entrada de informações maliciosas ou inadequadas.

## middleware de autenticação:

Este middleware tem como objetivo verificar a autenticidade do usuário antes de permitir acesso a rotas protegidas da aplicação. Primeiro, ele busca o token de autenticação nas informações enviadas na requisição, tanto no corpo da requisição quanto no cabeçalho.

Em seguida, ele verifica se há o token e se ele não está na lista de tokens inválidos (revokedTokens).

Se tudo estiver correto, o usuário é autenticado e o próximo passo é permitido com o next(). Caso contrário, uma exceção é lançada indicando que o token não foi fornecido ou é inválido.

## Middleware para tratamento de erros

Para garantir a estabilidade da aplicação, foi implementado um middleware de erros que captura e trata quaisquer erros ou exceções geradas durante a execução da aplicação. Este middleware irá substituir todos os blocos Try-Catch existentes e garantir que erros não causem interrupções na aplicação.

Para usar este middleware, é importante instalar e importar o módulo "express-async-erros", e colocá-lo após as rotas na aplicação. Isso garantirá que o middleware funcione de forma assíncrona e intercepte qualquer erro que possa ser lançado.