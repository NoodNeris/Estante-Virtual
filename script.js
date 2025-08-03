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
// (Adapte para os novos elementos se necessário, mas a estrutura básica se mantém)
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const userInfo = document.getElementById('user-info');
const adminControls = document.getElementById('admin-controls');
const addItemBtn = document.getElementById('add-item-btn');
const collectionGrid = document.getElementById('collection-grid');
// (Adicione referências aos modais aqui)

let currentUser = null;

// --- LÓGICA DE AUTENTICAÇÃO ---
auth.onAuthStateChanged(user => {
    currentUser = user;
    userInfo.classList.toggle('hidden', !user);
    loginBtn.classList.toggle('hidden', !!user);
    adminControls.classList.toggle('hidden', !user);
    carregarItens();
});

loginBtn.addEventListener('click', () => { /* ... sem alterações ... */ });
logoutBtn.addEventListener('click', () => auth.signOut());

// --- LÓGICA DOS MODAIS (abrir/fechar) ---
// (Mantenha a lógica de abrir e fechar os modais como estava)

// --- LÓGICA DE CARREGAMENTO E RENDERIZAÇÃO ---
function carregarItens() {
    db.collection("itens").orderBy("titulo").onSnapshot(snapshot => {
        collectionGrid.innerHTML = '';
        if (snapshot.empty) {
            collectionGrid.innerHTML = '<p>Sua coleção está vazia.</p>';
        }
        snapshot.forEach(doc => {
            const item = { ...doc.data(), id: doc.id };
            const cardElement = criarCardElement(item);
            collectionGrid.appendChild(cardElement);
        });
    }, error => {
        console.error("Erro ao carregar itens:", error);
        collectionGrid.innerHTML = '<p>Erro ao carregar a coleção.</p>';
    });
}

function criarCardElement(item) {
    const cardWrapper = document.createElement('div');
    cardWrapper.innerHTML = criarCardHtml(item);
    
    cardWrapper.firstElementChild.addEventListener('click', (e) => {
        if (!e.target.closest('.edit-icon')) {
            // Chame sua função de abrir detalhes aqui
            // abrirModalDetalhes(item); 
        }
    });

    const editIcon = cardWrapper.querySelector('.edit-icon');
    if (editIcon) {
        // Adicione o evento de clique para o ícone de edição
    }
    return cardWrapper.firstElementChild;
}

// NOVA FUNÇÃO PARA CRIAR O HTML DOS CARDS
function criarCardHtml(item) {
    // const editIcon = currentUser ? `<div class="edit-icon"><i class="fa-solid fa-pencil"></i></div>` : '';
    return `
        <article class="card-midia">
            <div class="card-image">
                <img src="${item.imagem}" alt="Capa de ${item.titulo}">
            </div>
            <div class="card-info">
                <h4>${item.titulo}</h4>
                <p>${item.autor_plataforma}</p>
            </div>
        </article>
    `;
}

// Mantenha as funções de formulário (submit, delete) e de detalhes
// adaptando-as conforme necessário para os elementos do novo HTML.