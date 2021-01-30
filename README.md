## Instalação

```bash
    npm install --save dinamicfetch
```

**[DEMO](https://codesandbox.io/s/my-fetcher-ulvb6?file=/src/store.js)**
Obs: ver o readme.md desse demo no codesandbox

**[youtube](https://youtu.be/rKbiqS7i0Ak)**

## O que é o dinamicfetch ?
Muitas vezes fazemos nossas chamadas de api na mão, usando o axios ou o fetch diretamente. Tendo em vista isso, é meio cansativo configurar como os dados devem ser manipulados.

É aí que entra o dinamicfetch, um buscador dinâmico para API Rest, tendo como base o swr e o axios, com ele você pode deixar mais fluido seu trabalho de salvar resultados em store e configurar requisições. Além disso, ele trás uma proposta de padronização de dados, na qual essa documentação recomenda dicas de como usar uma store e protocolos https, dicas estas que vou passar logo a diante.

## Que metodologia ele trás?

Por enquanto, não vou falar tanto do dinamicfetch, primeiro irei explicar como eu uso lojas em minhas aplicações e como uso os protocolos https, assim esse pacote no qual publiquei irá fazer mais sentido.

Bem, para a store irei usar o mobx, não se preocupe, ele é simples de entender, é usado para estado global.
Aqui vai um exemplo bem simples de store com mobx.

```js
    import { observable, action} from 'mobx';

    let store = observable({
        users:[]
    });

    const update = action((key, value) => {
        store[key] = value;
    });

    export {update};
    export default store;
```

Certo, nos exemplos iremos trabalhar com o users, um model de usuários.

#### Vou começar falando sobre os protocolos https. Eu costumo usa-los dessa maneira:

* **Método GET**: esse método eu uso apenas para retornar os dados da minha API. Por exemplo, quero trazer todos os usuários do banco de dados.
* **Método POST**: esse método eu uso para inserir dados na minha API. Por exemplo, quero inserir um novo usuário no banco de dados.
* **Método PUT**: esse método eu uso para atualizar dados na minha API. Por exemplo, quero mudar alguma informação de um usuário, como telefone ou endereço.
* **Método DELETE**: esse método eu uso para remove dados na minha API. Por exemplo, quero apagar um usuário do banco de dados.

Certo, esses são os 4 métodos que eu uso, existem outros, mas por enquanto a função utilitária de tratamento de dados do dinamicfetch só trabalhará com esses 4, que é o suficiente.
Obs: não quero dizer que o dinamicfetch não faça requisições com outros métodos, falo aqui de uma função utilitária, logo mais falarei sobre ela.

#### Vamos falar sobre a loja (eu costumo padronizar assim, isso vai ser importante para a manipulação de dados na store):

* **Chaves no plural**: Por exemplo "users", perceber-se que está no plural, então na minha store eu quero dizer que ele é um array, no exemplo a cima defini inicialmente `users: []`
* **Chaves no singular**: Pode ser qualquer valor. Por exemplo "user" posso inicialmente colocar assim `user: {id:1, name:'Rodrigo'}`

<hr/>

#### Vamos começar a falar o porquê de tudo isso.

Não vou entrar a fundo no dinamicfetch agora, mas vou mostrar aqui um casos básico de uso para você entender a metodologia. Os valores retornados na promisse não são "exatamente" o que o dinamicfetch irá trazer

O dinamicfetch trabalha com esses parâmetros:

```js
    import {fetch} from 'dinamicfetch';
    fetch('<method>', '<url>', '<model>', '<body>', '<key>', '<config>'); //promisse

    /*
        <method>: Poder ser por exemplo, GET, POST, PUT, DELETE
        <url>: A rota da api
        <model>: O modelo na loja na qual o dinamicfetch irá tratar os dados.
        <body>: Corpo da requisição, dados para enviar para o servidor
        <key>: Usado quando o método é PUT, isso indica qual atributo devo pegar como referência para atualizar os dados.
        <config>: Irei falar sobre isso mais na frente.
    */
```
<hr/>

Para você entender como faço buscas em minhas APIs, iremos seguir esses passos: buscar usuários, inserir um novo usuário, editar um usuáro, excluir um usuário.

<hr/>

Primeiro eu envio um GET para buscar todos os usuários:
```js 
    fetch('get', 'https://host/api/users', 'users').then(data=>{
        /*
            data retorna:
            {
                data:[
                    {id:1, name:'Rodrigo'},
                    {id:2, name:'Platão'},
                    {id:3, name:'Aristóteles'},
                    {id:4, name:'Sócrates'}
                ],
                dispatch:{
                    users:[
                        {id:1, name:'Rodrigo'},
                        {id:2, name:'Platão'},
                        {id:3, name:'Aristóteles'},
                        {id:4, name:'Sócrates'}
                    ]
                }
            }
        */
    });
```
<hr/>

Ok, próximo passo, agora eu quero inserir um novo usuário, irei enviar uma requisição com esse body: `{name:'Paula'}`
e eu também retorno esse novo usuário inserido: `res.status(200).send({id:5, name:'Paula'})`.
Observe que uso o método POST quando quero inserir algo no banco.

```js 
    fetch('post', 'https://host/api/users', 'users', {name:'Paula'}).then(data=>{
        /*
            data retorna:
            {
                data:{id:5, name:'Paula'},
                dispatch:{
                    users:[
                        {id:5, name:'Paula'}, //novo usuário aqui
                        {id:1, name:'Rodrigo'},
                        {id:2, name:'Platão'},
                        {id:3, name:'Aristóteles'},
                        {id:4, name:'Sócrates'}
                    ]
                }
            }
        */
    });
```
<hr/>
Ok, próximo passo, agora eu quero editar o nome do usuário de id 3, vou mudar de Aristóteles para Fabrício.
Observe que uso o método PUT quando quero editar algo no banco.

```js 
    fetch('put', 'https://host/api/users', 'users', {userId:3, name:'Fabrício'}, 'id').then(data=>{
        /*
            data retorna:
            {
                data:{id:3, name:'Fabrício'},
                dispatch:{
                    users:[
                        {id:1, name:'Rodrigo'},
                        {id:2, name:'Platão'},
                        {id:3, name:'Fabrício'}, //nome do usuário editado
                        {id:4, name:'Sócrates'},
                        {id:5, name:'Paula'},
                    ]
                }
            }
        */
    });
```
Observe que o dispatch pega o modelo users da loja e já trás os dados com o usuário 3 atualizado.
<hr/>

Ok, próximo passo, agora eu quero deletar o usuário de id 4, Sócrates.
Observe que uso o método DELETE quando quero deletar algo no banco.
 
```js 
    fetch('delete', 'https://host/api/users/4', 'users', null, 'id').then(data=>{
        /*
            data retorna:
            {
                data:{id:4},
                dispatch:{
                    users:[
                        {id:1, name:'Rodrigo'},
                        {id:2, name:'Platão'},
                        {id:3, name:'Fabrício'},
                        {id:5, name:'Paula'},
                    ]
                }
            }
        */
    });
```
Quando for o método DELETE sempre retorno um json {[key]:[value]} indicando a chave que vou usar como referência, passado no 5° parâmetro do fetch.
Isso irá pegar o modelo users da loja, vai procurar o usuário de id 4 e irá remove-lo.
<hr/>

### Recapitularizando

Aqui em cima lhe mostrei como padronizo meus dados de api para GET, POST, PUT e DELETE e o que o fetch faz com os dados para cada método.
Agora daqui para baixo irei explicar como usar o dinamicfetch.


## Como usar?

Primeiramente irei mostrar a função genérica, não vamos focar no swr ainda.

```js 
    import {fetch} from 'dinamicfetch';
    fetch('<method>', '<url>', '<model>', '<body>', '<key>', '<config>'); //promisse

    /*
        <method>: Poder ser por exemplo, GET, POST, PUT, DELETE
        <url>: A rota da api
        <model>: O modelo na loja, cujo o dinamicfetch irá tratar os dados.
        <body>: Corpo da requisição, dados para enviar para o servidor
        <key>: Usado quando o método é PUT, isso indica qual atributo devo pegar como referência para atualizar os dados na loja.
        <config>: {
            swr:{-configurações do swr-},
            axios:{-configurações do axios-},
            params: {
                -Parâmetros que quero passar na url-
            }
        }
    */

```
<hr/>

> Usando com o método create
```js
    import {create} from 'dinamicfetch';

    let config = create({
        swr:{/*-configurações do swr-*/},
        axios:{/*-configurações do axios-*/},
        store:Store, // Aqui eu passo a loja - opcional,
        token:/*-pode ser o token passado quando um usuário estiver logado, isso irá ajudar o swr a diferenciar o cachê, já que ele trabalha com cachê de requiições-*/,
        onStart(data){
            // Chamado antes de uma determinada requisição ser executada.
            /*
                data retorna:
                {
                    method, // O método que uma determinada requisição está usando
                    url, // A url que uma determinada requisição está usando
                    model, // O modelo que está sendo passado como parâmetro para uma determinada requisição
                    body, // O corpo de uma determinada requisição
                    key, // O key que está sendo passado como parâmetro para uma determinada requisição
                    config // As configurações que estão sendo passadas como parâmetro para uma determinada requisição
                }
            */
        },
        onSuccess(data){
            // Chamado quando uma requisição termina de ser executada.
            /*
                data retorna:
                {
                    ...todos os dados que é retornado no axios por padrão,
                    model, 
                    key, 
                    dispatch // esse atributo retorna os dados que devem ser inseridos na loja, atualizados, ou deletados conforme a resposta da api.
                }
            */
        },
        onError(err){
            //--retorna um erro da requisição, se ouver
        },
        $onSuccess(data){
            /*
                retorna o mesmo que onSuccess, a diferença é que esse evento é disparado quando usamos o dinamicfetch como hook tendo como base o swr.
            */
        },
        params: {
            /*-Parâmetros global que quero passar na url-*/
        }
    })

    config.fetch('<method>', '<url>', '<model>', '<body>', '<key>', '<config>');

    //---todos esses parâmetros irão ser detalhados mais tarde.
```

<hr/>

> Explorando as utilidades
```js
    import {create, fetch, $fetch, get, post, put, remove, $get, $post, $put, $remove} from 'dinamicfetch'; //onde tem $ é quando quero usar o swr.
    //todas as funções a cima retorna uma promisse.

    //Essas aqui servem para facilitar sua vida, elas só aceitam parâmetros necessários, ao contrário de fetch, $fetch.
    get('<target>', '<model>', '<config>');
    post('<target>', '<model>', '<body>', '<config>');
    put('<target>', '<model>', '<body>', '<key>', '<config>');
    remove('<target>', '<model>', '<key>', '<config>'); // conidere como DELETE

    //----$get, $post, $put, $remove é usado da mesma maneira que as funções listadas a cima.
```

<hr/>

> Trabalhando com mais de um model
```js
    fetch('put', 'https://host/api/usersinfos', 'get-users, put-address', {name:'Rua tal - número tal'}, ', fk_id_users').then(data=>{
        /*
            data retorna:
            {
                data:{
                    users: [
                        {id:1, name:'Rodrigo'},
                        {id:2, name:'Platão'},
                    ],
                    address: {id:2, fk_id_users:1, name:'Rua tal - número tal'}
                },
                dispatch:{
                    users:[
                        {id:1, name:'Rodrigo'},
                        {id:2, name:'Platão'},
                    ],
                    address:[
                        {id:1, fk_id_users:2, name:'Rua tal - número tal'}, //--endereço editado
                        {id:2, fk_id_users:1, name:'Rua tal 2 - número tal 2'}
                    ]
                }
            }
        */
    });
```

Observe o `get-users, put-address` aqui eu digo que quero que o model users se comporte como um get, ou seja, o dispatch somente irá inserir os dados que
foi retornado no data.users. Além disso, digo que o model address deve se comportar como um put, ou seja, no data.address retorno o endereço atualizado, conforme os valores que passei no body, e o dispatch o rescreve em dispatch.address.

No terceiro parâmetro, temos `,fk_id_users` o primeiro valor (antes da virgula) não passo nada, ele se refere a get-users, mas get-users não precisa de uma key, pois ele é get, já o segundo valor (depois da vírgula) é o `fk_id_users`, é a chave que passo para dizer ao put-address com qual referência ele deve trabalhar para pesquiar na loja o endereço e substituir pelo novo.

**Detalhe importante, aqui em cima na última linha eu disse "substituir pelo novo", o dinamicfetch não interfere na sua loja, apenas usa os dados da store para fazer o tratamento necessário e lhe entregar a resposta em dispatch, você pode alterar os valores de sua loja em onSuccess.**

<hr/>

> Trabalhando com swr
```js
    let {data, error, isValidating, mutate} = $get('/users', 'users', {axios:{}, swr:{/*-configurações do swr-*/}});

    //--para quem conhece o SWR, saberá que ele é um hook e que funciona trazendo esses dados mostrados a cima, a diferença é que aqui estou integrando com o dinamicfetch
```
<hr/>

Bom, por enquanto é isso, a forma que você vai usa-lo vai depender de sua criatividade, recomendo sempre usar a função create para configurar de forma global sua aplicação,
lá você pode configurar mensagens de alerta como mostra no demo, salvar os dados na store e o que você desejar fazer.