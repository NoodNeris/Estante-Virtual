// =================================================================
//           É AQUI QUE VOCÊ VAI ADICIONAR SEUS ITENS!
// =================================================================

// Lista de Livros
const meusLivros = [
    {
        titulo: "O Senhor dos Anéis",
        autor: "J.R.R. Tolkien",
        status: "Lido",
        imagem: "https://m.media-amazon.com/images/I/81hCVEC0ExL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        titulo: "Duna",
        autor: "Frank Herbert",
        status: "Lendo",
        imagem: "https://m.media-amazon.com/images/I/81d4t+pT+uL._AC_UF1000,1000_QL80_.jpg"
    },
    {
        titulo: "A Fundação",
        autor: "Isaac Asimov",
        status: "Quero Ler",
        imagem: "https://m.media-amazon.com/images/I/71pB4fR2d4L._AC_UF1000,1000_QL80_.jpg"
    }
];

// Lista de Jogos
const meusJogos = [
    {
        titulo: "The Witcher 3: Wild Hunt",
        plataforma: "PC, PS4, Xbox One",
        status: "Finalizado",
        imagem: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg?t=1701351556"
    },
    {
        titulo: "Baldur's Gate 3",
        plataforma: "PC, PS5",
        status: "Jogando",
        imagem: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg?t=1719589333"
    },
    {
        titulo: "Hollow Knight",
        plataforma: "PC, Switch, PS4",
        status: "Quero Jogar",
        imagem: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg?t=1710323386"
    }
];

// =================================================================
//   O CÓDIGO ABAIXO LÊ AS LISTAS ACIMA E CRIA O SITE.
//   VOCÊ NÃO PRECISA MEXER AQUI PARA ADICIONAR ITENS.
// =================================================================

function carregarItens() {
    const listaLivros = document.getElementById('lista-livros');
    const listaJogos = document.getElementById('lista-jogos');

    // Carrega os livros
    meusLivros.forEach(livro => {
        const statusClass = livro.status.toLowerCase().replace(' ', '-');
        const card = `
            <div class="card-midia">
                <img src="${livro.imagem}" alt="Capa do livro ${livro.titulo}">
                <div class="info">
                    <h3>${livro.titulo}</h3>
                    <p>${livro.autor}</p>
                    <span class="status ${statusClass}">${livro.status}</span>
                </div>
            </div>
        `;
        listaLivros.innerHTML += card;
    });

    // Carrega os jogos
    meusJogos.forEach(jogo => {
        const statusClass = jogo.status.toLowerCase().replace(' ', '-');
        const card = `
            <div class="card-midia">
                <img src="${jogo.imagem}" alt="Capa do jogo ${jogo.titulo}">
                <div class="info">
                    <h3>${jogo.titulo}</h3>
                    <p>${jogo.plataforma}</p>
                    <span class="status ${statusClass}">${jogo.status}</span>
                </div>
            </div>
        `;
        listaJogos.innerHTML += card;
    });
}

// Executa a função quando a página carregar
window.onload = carregarItens;