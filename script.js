let despesas =
JSON.parse(localStorage.getItem("despesas")) || [];

window.onload = () => {

    atualizarTela();

    document
    .getElementById("receita")
    .addEventListener("input", atualizarTela);
};

function adicionarDespesa(){

    let nome =
    document.getElementById("nomeDespesa").value.trim();

    let valor =
    Number(document.getElementById("valorDespesa").value);

    let categoria =
    document.getElementById("categoria").value;

    if(nome === "" || valor <= 0){

        alert("Preencha os campos corretamente.");
        return;
    }

    despesas.push({
        nome,
        valor,
        categoria
    });

    localStorage.setItem(
        "despesas",
        JSON.stringify(despesas)
    );

    document.getElementById("nomeDespesa").value = "";
    document.getElementById("valorDespesa").value = "";

    atualizarTela();
}

function removerDespesa(indice){

    despesas.splice(indice,1);

    localStorage.setItem(
        "despesas",
        JSON.stringify(despesas)
    );

    atualizarTela();
}

function atualizarTela(){

    let lista =
    document.getElementById("listaDespesas");

    lista.innerHTML = "";

    let total = 0;

    despesas.forEach((item,indice)=>{

        total += item.valor;

        let li =
        document.createElement("li");

        li.innerHTML = `
        <span>
        ${item.categoria} ${item.nome}
        - R$ ${item.valor.toFixed(2)}
        </span>

        <button
        class="excluir"
        onclick="removerDespesa(${indice})">
        Excluir
        </button>
        `;

        lista.appendChild(li);
    });

    document.getElementById("total").textContent =
    total.toFixed(2);

    calcularSaldo(total);
}

function calcularSaldo(total){

    let receita =
    Number(document.getElementById("receita").value);

    let saldo =
    receita - total;

    document.getElementById("saldo").textContent =
    saldo.toFixed(2);

    document.getElementById("receitaCard").textContent =
    "R$ " + receita.toFixed(2);

    let porcentagem = 0;

    if(receita > 0){

        porcentagem =
        (total / receita) * 100;
    }

    document.getElementById("progresso")
    .style.width =
    porcentagem + "%";

    document.getElementById("porcentagem")
    .textContent =
    porcentagem.toFixed(1)
    + "% do orçamento utilizado";

   let mensagem =
document.getElementById("mensagemFinanceira");

let subMensagem =
document.getElementById("subMensagemFinanceira");

let card =
document.querySelector(".alerta-financeiro");

card.classList.remove(
    "alerta-verde",
    "alerta-amarelo",
    "alerta-vermelho"
);

if(saldo < 0){

    mensagem.innerHTML =
    "🚨 Você está no vermelho";

    subMensagem.innerHTML =
    "Seus gastos ultrapassaram sua receita.";

    card.classList.add("alerta-vermelho");

    document.getElementById("saldo")
    .className = "saldo-negativo";
}
else if(porcentagem >= 80){

    mensagem.innerHTML =
    "⚠️ Atenção ao orçamento";

    subMensagem.innerHTML =
    "Você já utilizou mais de 80% da sua renda.";

    card.classList.add("alerta-amarelo");

    document.getElementById("saldo")
    .className = "saldo-positivo";
}
else{

    mensagem.innerHTML =
    "✅ Suas finanças estão sob controle";

    subMensagem.innerHTML =
    "Parabéns! Você está administrando bem seu dinheiro.";

    card.classList.add("alerta-verde");

    document.getElementById("saldo")
    .className = "saldo-positivo";
}
}

function gerarRelatorio(){

    let receita =
    Number(document.getElementById("receita").value);

    let total = 0;

    let listaHTML = "";

    despesas.forEach(item => {

        total += item.valor;

        listaHTML += `
        <tr>
            <td>${item.nome}</td>
            <td>${item.categoria}</td>
            <td>R$ ${item.valor.toFixed(2)}</td>
        </tr>
        `;
    });

    let saldo = receita - total;

    let novaJanela = window.open("", "_blank");

    novaJanela.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Relatório Financeiro</title>

        <style>

            body{
                font-family:Arial;
                padding:30px;
            }

            h1{
                text-align:center;
            }

            table{
                width:100%;
                border-collapse:collapse;
                margin-top:20px;
            }

            th,td{
                border:1px solid #ccc;
                padding:10px;
                text-align:left;
            }

            th{
                background:#f0f0f0;
            }

            .resumo{
                margin-top:20px;
                font-size:18px;
            }

            .positivo{
                color:green;
            }

            .negativo{
                color:red;
            }

        </style>
    </head>

    <body>

        <h1>📊 Relatório Financeiro Mensal</h1>

        <div class="resumo">
            <p><strong>Receita:</strong> R$ ${receita.toFixed(2)}</p>
            <p><strong>Total de Gastos:</strong> R$ ${total.toFixed(2)}</p>
            <p>
                <strong>Saldo:</strong>
                <span class="${
                    saldo >= 0 ? "positivo" : "negativo"
                }">
                    R$ ${saldo.toFixed(2)}
                </span>
            </p>
        </div>

        <table>

            <thead>
                <tr>
                    <th>Despesa</th>
                    <th>Categoria</th>
                    <th>Valor</th>
                </tr>
            </thead>

            <tbody>
                ${listaHTML}
            </tbody>

        </table>

        <br><br>

        <button onclick="window.print()">
            🖨️ Imprimir / Salvar PDF
        </button>

    </body>
    </html>
    `);

    novaJanela.document.close();
}