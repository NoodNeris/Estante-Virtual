// =================================================================
//        CONFIGURAÇÃO DO SEU FIREBASE
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDm5zTPU_paYGTRPK6ynatFN9RzxY0Aey8",
  authDomain: "estante-nood.firebaseapp.com",
  projectId: "estante-nood",
  storageBucket: "estante-nood.firebasestorage.app",
  messagingSenderId: "578043131348",
  appId: "1:578043131348:web:fec4056a6140723f705241"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// --- ELEMENTOS DO HTML ---
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const adminControls = document.getElementById('admin-controls');
const addItemBtn = document.getElementById('add-item-btn');
const listaLivros = document.getElementById('lista-livros');
const listaJogos = document.getElementById('lista-jogos');
const itemModal = document.getElementById('item-modal');
const itemForm = document.getElementById('item-form');
const detailsModal = document.getElementById('details-modal');
const detailsCloseBtn = document.getElementById('details-close-btn');
const notaSelect = document.getElementById('item-nota');
const filterCheckboxes = document.querySelectorAll('.sidebar input[type="checkbox"]');
const sortRadios = document.querySelectorAll('.sidebar input[type="radio"]');

let currentUser = null;
let todosOsItens = []; // Array para guardar todos os itens para filtrar

// --- LÓGICA DE AUTENTICAÇÃO ---
auth.onAuthStateChanged(user => {
    currentUser = user;
    userInfo.classList.toggle('hidden', !user);
    loginBtn.classList.toggle('hidden', !!user);
    adminControls.classList.toggle('hidden', !user);
    carregarItens(); // Carrega os itens após verificar o login
});

loginBtn.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(console.error);
});

logoutBtn.addEventListener('click', () => auth.signOut());

// --- LÓGICA DOS MODAIS ---
function abrirModal(modalElement) {
    modalElement.style.display = 'flex';
}

function fecharModal(modalElement) {
    modalElement.style.display = 'none';
}

// --- LÓGICA DO MODAL DE EDIÇÃO ---
function popularNotas() {
    notaSelect.innerHTML = '<option value="0">Sem Nota</option>';
    for (let i = 0.5; i <= 5; i += 0.5) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        notaSelect.appendChild(option);
    }
}
popularNotas();

function abrirModalEdicao(item = null) {
    itemForm.reset();
    if (item) {
        document.getElementById('modal-title').textContent = "Editar Item";
        document.getElementById('item-id').value = item.id;
        document.getElementById('item-tipo').value = item.tipo;
        document.getElementById('item-status').value = item.status;
        document.getElementById('item-titulo').value = item.titulo;
        document.getElementById('item-autor-plataforma').value = item.autor_plataforma;
        document.getElementById('item-genero').value = item.genero;
        document.getElementById('item-nota').value = item.nota;
        document.getElementById('item-imagem').value = item.imagem;
        document.getElementById('item-review').value = item.review;
        document.getElementById('delete-btn').classList.remove('hidden');
    } else {
        document.getElementById('modal-title').textContent = "Adicionar Novo Item";
        document.getElementById('delete-btn').classList.add('hidden');
    }
    abrirModal(itemModal);
}

addItemBtn.addEventListener('click', () => abrirModalEdicao());
document.getElementById('cancel-btn').addEventListener('click', () => fecharModal(itemModal));

// --- LÓGICA DO MODAL DE DETALHES ---
function formatarEstrelas(nota) {
    const notaValor = parseFloat(nota) || 0;
    if (notaValor === 0) return 'Sem nota';
    let estrelas = '';
    for (let i = 1; i <= 5; i++) {
        if (notaValor >= i) estrelas += '★';
        else if (notaValor >= i - 0.5) estrelas += '½';
        else estrelas += '☆';
    }
    return estrelas;
}

function abrirModalDetalhes(item) {
    document.getElementById('details-img').src = item.imagem;
    document.getElementById('details-title').textContent = item.titulo;
    document.getElementById('details-author').textContent = item.autor_plataforma;
    document.getElementById('details-status').textContent = item.status;
    document.getElementById('details-nota').textContent = formatarEstrelas(item.nota);
    document.getElementById('details-genero').textContent = `Gênero(s): ${item.genero || 'Não informado'}`;
    document.getElementById('details-review').textContent = item.review || 'Nenhuma review foi escrita para este item.';
    abrirModal(detailsModal);
}

detailsCloseBtn.addEventListener('click', () => fecharModal(detailsModal));

// --- LÓGICA DE FILTRAGEM E RENDERIZAÇÃO ---
function aplicarFiltros() {
    const filtrosAtivos = Array.from(filterCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.dataset.status);

    const ordenacao = document.querySelector('input[name="sort"]:checked').value;

    let itensFiltrados = [...todosOsItens];

    if (filtrosAtivos.length > 0) {
        itensFiltrados = itensFiltrados.filter(item => filtrosAtivos.includes(item.status));
    }

    itensFiltrados.sort((a, b) => {
        if (ordenacao === 'nota') {
            return (parseFloat(b.nota) || 0) - (parseFloat(a.nota) || 0);
        }
        return a.titulo.localeCompare(b.titulo); // Padrão é título
    });
    
    renderizarItens(itensFiltrados);
}

filterCheckboxes.forEach(cb => cb.addEventListener('change', aplicarFiltros));
sortRadios.forEach(radio => radio.addEventListener('change', aplicarFiltros));

function renderizarItens(itens) {
    listaLivros.innerHTML = '';
    listaJogos.innerHTML = '';

    const livros = itens.filter(item => item.tipo === 'livro');
    const jogos = itens.filter(item => item.tipo === 'jogo');

    if (livros.length === 0) listaLivros.innerHTML = '<p class="empty-message">Nenhum livro encontrado com os filtros atuais.</p>';
    livros.forEach(item => {
        const cardElement = criarCardElement(item);
        listaLivros.appendChild(cardElement);
    });

    if (jogos.length === 0) listaJogos.innerHTML = '<p class="empty-message">Nenhum jogo encontrado com os filtros atuais.</p>';
    jogos.forEach(item => {
        const cardElement = criarCardElement(item);
        listaJogos.appendChild(cardElement);
    });
}

// --- LÓGICA DO BANCO DE DADOS ---
function carregarItens() {
    db.collection("itens").orderBy("titulo").onSnapshot(snapshot => {
        todosOsItens = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        aplicarFiltros(); // Aplica filtros e renderiza pela primeira vez
    }, error => {
        console.error("Erro ao carregar itens do Firestore:", error);
        listaLivros.innerHTML = '<p class="empty-message">Erro ao carregar a coleção.</p>';
        listaJogos.innerHTML = '';
    });
}

function criarCardElement(item) {
    const cardWrapper = document.createElement('div');
    cardWrapper.innerHTML = criarCardHtml(item);
    
    const card = cardWrapper.firstElementChild;
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.edit-icon')) {
            abrirModalDetalhes(item);
        }
    });

    const editIcon = card.querySelector('.edit-icon');
    if (editIcon) {
        editIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModalEdicao(item);
        });
    }
    return card;
}

function criarCardHtml(item) {
    const editIcon = currentUser ? `<div class="edit-icon"><i class="fa-solid fa-pencil"></i></div>` : '';
    return `
        <article class="card-midia">
            <img src="${item.imagem}" alt="Capa de ${item.titulo}">
            ${editIcon}
            <div class="card-info">
                <h4>${item.titulo}</h4>
                <p>${item.autor_plataforma}</p>
            </div>
            <div class="card-footer">
                <span class="nota">${formatarEstrelas(item.nota)}</span>
                <span class="status ${item.status.replace(' ', '-')}">${item.status}</span>
            </div>
        </article>
    `;
}

itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const id = document.getElementById('item-id').value;
    const itemData = {
        tipo: document.getElementById('item-tipo').value,
        status: document.getElementById('item-status').value,
        titulo: document.getElementById('item-titulo').value,
        autor_plataforma: document.getElementById('item-autor-plataforma').value,
        genero: document.getElementById('item-genero').value,
        nota: document.getElementById('item-nota').value,
        imagem: document.getElementById('item-imagem').value,
        review: document.getElementById('item-review').value
    };

    const promise = id ? db.collection("itens").doc(id).update(itemData) : db.collection("itens").add(itemData);
    promise.then(() => fecharModal(itemModal)).catch(console.error);
});

document.getElementById('delete-btn').addEventListener('click', () => {
    const id = document.getElementById('item-id').value;
    if (confirm("Tem certeza que deseja deletar este item?")) {
        db.collection("itens").doc(id).delete().then(() => fecharModal(itemModal));
    }

});

