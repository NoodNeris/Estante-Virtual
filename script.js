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

// Elementos do HTML
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
let todosOsItens = []; // Array para guardar todos os itens e filtrar no cliente

// --- LÓGICA DE AUTENTICAÇÃO ---
auth.onAuthStateChanged(user => {
    currentUser = user;
    userInfo.style.display = user ? 'flex' : 'none';
    loginBtn.style.display = user ? 'none' : 'block';
    adminControls.classList.toggle('hidden', !user);
    carregarItens(); // Carrega os itens iniciais
});

loginBtn.addEventListener('click', () => { /* ... (sem alterações) ... */ });
logoutBtn.addEventListener('click', () => auth.signOut());

// --- LÓGICA DOS MODAIS ---
function abrirModal(modalElement) { modalElement.style.display = 'flex'; }
function fecharModal(modalElement) { modalElement.style.display = 'none'; }

// --- LÓGICA DO MODAL DE EDIÇÃO ---
function popularNotas() { /* ... (sem alterações) ... */ }
popularNotas();
function abrirModalEdicao(item = null) { /* ... (sem alterações) ... */ }
addItemBtn.addEventListener('click', () => abrirModalEdicao());
document.getElementById('cancel-btn').addEventListener('click', () => fecharModal(itemModal));

// --- LÓGICA DO MODAL DE DETALHES ---
function formatarEstrelas(nota) { /* ... (sem alterações) ... */ }
function abrirModalDetalhes(item) { /* ... (sem alterações) ... */ }
detailsCloseBtn.addEventListener('click', () => fecharModal(detailsModal));

// --- LÓGICA DE FILTRAGEM E RENDERIZAÇÃO ---
function aplicarFiltros() {
    const filtrosAtivos = Array.from(filterCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.dataset.status);

    const ordenacao = document.querySelector('input[name="sort"]:checked').value;

    let itensFiltrados = todosOsItens;

    if (filtrosAtivos.length > 0) {
        itensFiltrados = todosOsItens.filter(item => filtrosAtivos.includes(item.status));
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

    if (livros.length === 0) listaLivros.innerHTML = '<p>Nenhum livro encontrado.</p>';
    livros.forEach(item => {
        const cardElement = criarCardElement(item);
        listaLivros.appendChild(cardElement);
    });

    if (jogos.length === 0) listaJogos.innerHTML = '<p>Nenhum jogo encontrado.</p>';
    jogos.forEach(item => {
        const cardElement = criarCardElement(item);
        listaJogos.appendChild(cardElement);
    });
}

// --- LÓGICA DO BANCO DE DADOS ---
function carregarItens() {
    db.collection("itens").onSnapshot(snapshot => {
        todosOsItens = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        aplicarFiltros(); // Aplica filtros e renderiza pela primeira vez
    });
}

function criarCardElement(item) {
    const cardWrapper = document.createElement('div');
    cardWrapper.innerHTML = criarCardHtml(item);
    
    cardWrapper.firstElementChild.addEventListener('click', (e) => { /* ... (sem alterações) ... */ });
    const editIcon = cardWrapper.querySelector('.edit-icon');
    if (editIcon) {
        editIcon.addEventListener('click', () => abrirModalEdicao(item));
    }
    return cardWrapper.firstElementChild;
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
                <span class="status ${item.status}">${item.status}</span>
            </div>
        </article>
    `;
}

itemForm.addEventListener('submit', (e) => { /* ... (sem alterações) ... */ });
document.getElementById('delete-btn').addEventListener('click', () => { /* ... (sem alterações) ... */ });