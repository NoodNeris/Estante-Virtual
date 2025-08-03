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
const cancelBtn = document.getElementById('cancel-btn');
const notaSelect = document.getElementById('item-nota');

let currentUser = null;

// --- LÓGICA DE AUTENTICAÇÃO ---
auth.onAuthStateChanged(user => {
    currentUser = user;
    userInfo.style.display = user ? 'flex' : 'none';
    loginBtn.style.display = user ? 'block' : 'none';
    adminControls.classList.toggle('hidden', !user);
    carregarItens();
});

loginBtn.addEventListener('click', () => { /* ... (sem alterações) ... */ });
logoutBtn.addEventListener('click', () => auth.signOut());

// --- LÓGICA DOS MODAIS ---
function abrirModal(modalElement) { modalElement.style.display = 'flex'; }
function fecharModal(modalElement) { modalElement.style.display = 'none'; }

// --- LÓGICA DO MODAL DE EDIÇÃO ---
function popularNotas() { /* ... (sem alterações) ... */ }
popularNotas();
function abrirModalEdicao(item = null) { /* ... (sem alterações, mas o JS controla os campos) ... */ }
addItemBtn.addEventListener('click', () => abrirModalEdicao());
cancelBtn.addEventListener('click', () => fecharModal(itemModal));

// --- LÓGICA DO MODAL DE DETALHES ---
function formatarEstrelas(nota) { /* ... (sem alterações) ... */ }
function abrirModalDetalhes(item) { /* ... (sem alterações, mas o JS controla os campos) ... */ }
detailsCloseBtn.addEventListener('click', () => fecharModal(detailsModal));

// --- LÓGICA DO BANCO DE DADOS (CRUD) ---
function carregarItens() {
    db.collection("itens").orderBy("titulo").onSnapshot(snapshot => {
        listaLivros.innerHTML = '';
        listaJogos.innerHTML = '';
        if (snapshot.empty) {
            listaLivros.innerHTML = '<p>Nenhum livro na coleção.</p>';
            listaJogos.innerHTML = '<p>Nenhum jogo na coleção.</p>';
        }
        snapshot.forEach(doc => {
            const item = { ...doc.data(), id: doc.id };
            const cardElement = criarCardElement(item);
            if (item.tipo === 'livro') listaLivros.appendChild(cardElement);
            else listaJogos.appendChild(cardElement);
        });
    });
}

function criarCardElement(item) {
    const cardWrapper = document.createElement('div');
    cardWrapper.innerHTML = criarCardHtml(item);
    // ... (event listeners para abrir detalhes e edição) ...
    return cardWrapper.firstChild;
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
                <span class="status">${item.status}</span>
            </div>
        </article>
    `;
}

itemForm.addEventListener('submit', (e) => { /* ... (sem alterações) ... */ });
document.getElementById('delete-btn').addEventListener('click', () => { /* ... (sem alterações) ... */ });