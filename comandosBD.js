function criarEstrutura(nomeBD) {
    const request = indexedDB.open(nomeBD);

    request.onupgradeneeded = function(event) {
        //fazer a criação das tabelas, indices e popular o banco se necessário
        let db = event.target.result;
    
        let despesas = db.createObjectStore("despesas", { autoIncrement: true });
        despesas.add({tipo: 'Fixa', descricao: 'Aluguel', valor: 4561});
        despesas.add({tipo: 'Fixa', descricao: 'Internet', valor: 99});
        despesas.add({tipo: 'Fixa', descricao: 'Contabilidade', valor: 600});
        despesas.add({tipo: 'Fixa', descricao: 'Impostos, INSS e Simples Nacional', valor: 900});
        despesas.add({tipo: 'Fixa', descricao: 'Salário Funcionário', valor: 2500});
        despesas.add({tipo: 'Variável', descricao: 'Energia', valor: 2879});
        despesas.add({tipo: 'Variável', descricao: 'Água', valor: 150});
        despesas.add({tipo: 'Variável', descricao: 'Gasolina', valor: 659.54});
        despesas.add({tipo: 'Variável', descricao: 'Mantimentos', valor: 4356});
        despesas.add({tipo: 'Variável', descricao: 'Salário Dona Mafalda', valor: 3566});
    
        let valores = db.createObjectStore("valores", { autoIncrement: true });
        db.createObjectStore("produtos", { autoIncrement: true })
        db.close()
    }
}

function inserirRegistros(nomeBD, tabela, lstRegistros) {
    let request = indexedDB.open(nomeBD);

    request.onsuccess = function(event) {
        let db = event.target.result;

        //Abrindo a transação com a object store
        let transaction = db.transaction(tabela, "readwrite");

        // Quando a transação é executada com sucesso
        transaction.oncomplete = function(event) {
            console.log('Transação finalizada com sucesso.');
        };

        // Quando ocorre algum erro na transação
        transaction.onerror = function(event) {
            console.log('Transação finalizada com erro. Erro: ' + event.target.error);
        };

        //Recuperando a object store para incluir os registros
        let objeto = transaction.objectStore(tabela);

        for (var i = 0; i < lstRegistros.length; i++) {
            //incluindo o registro na object store
            request = objeto.add(lstRegistros[i]);
        
            //quando ocorrer um erro ao adicionar o registro
            request.onerror = function (event) {
                console.log('Ocorreu um erro ao salvar o registro.');
            }
        
            //quando o registro for incluido com sucesso
            request.onsuccess = function (event) {
                console.log('Registro salvo com sucesso.');
            }
        }
        db.close();
    }
}

function buscarRegistros(nomeBD, tabela) {
    let lstRegistros = [];
    const request = indexedDB.open(nomeBD);

    request.onsuccess = function(event) {
        let db = event.target.result;

        const transaction = db.transaction(tabela, "readonly");
        const objectStore = transaction.objectStore(tabela);

        objectStore.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                lstRegistros.push(cursor.value);
                cursor.continue();
            }
        };
        transaction.oncomplete = function () {
            db.close();
        };
    }
    return lstRegistros;
}

function deletarRegistro(nomeBD, tabela, id) {
    let request = indexedDB.open(nomeBD);

    request.onsuccess = function(event) {
        let db = event.target.result;

        const transaction = db.transaction(tabela, 'readwrite');
        const store = transaction.objectStore(tabela);

        let query = store.delete(id);

        query.onsuccess = function (event) {
            console.log(event);
        };

        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }

        transaction.oncomplete = function () {
            db.close();
        };
    }
}


const nomeBD = 'marcearia';

criarEstrutura(nomeBD);

let lstValores = [
    {ano: 2022, mes:3, caixa: 2389.32, cartao: 14756.32, dinheiro: 2876.57},
    {ano: 2022, mes:4, caixa: 2389.32, cartao: 14756.32, dinheiro: 2876.57}
];
inserirRegistros(nomeBD, 'valores', lstValores);

let lstProdutos = [
    {descricao: 'Bolo', valor: 20}
];
inserirRegistros(nomeBD, 'produtos', lstProdutos);

buscarRegistros(nomeBD, 'despesas');
buscarRegistros(nomeBD, 'produtos');
deletarRegistro(nomeBD, 'produtos', 1);