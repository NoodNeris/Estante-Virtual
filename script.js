// =================================================================
//        CONFIGURAÇÃO DO SEU FIREBASE
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDm5zTPU_paYGTRPK6ynatFN9RzxY0Aey8",
  authDomain: "estante-nood.firebaseapp.com",
  projectId: "estante-nood",
  storageBucket: "estante-nood.appspot.com",
  messagingSenderId: "578043131348",
  appId: "1:578043131348:web:fec4056a6140723f705241"
};

// =================================================================
//         O RESTO DO CÓDIGO FAZ A MÁGICA ACONTECER
// =================================================================
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
cancelBtn.addEventListener('click', () => fecharModal(itemModal));

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
    // ... (Adicione aqui os event listeners para abrir detalhes e edição) ...
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