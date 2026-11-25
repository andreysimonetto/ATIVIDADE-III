import { db } from './firebase-config.js';
import {
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const produtosRef = collection(db, 'produtos');

const form = document.getElementById('form-produto');
const tabela = document.getElementById('tabela-produtos');
const inputId = document.getElementById('produto-id');
const formTitle = document.getElementById('formTitle');
const btnSalvar = document.getElementById('btnSalvar');

// ===== READ =====
async function carregarProdutos() {
  tabela.innerHTML = '';
  const snap = await getDocs(produtosRef);
  snap.forEach((d) => {
    const p = d.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.categoria}</td>
      <td>R$ ${Number(p.preco).toFixed(2)}</td>
      <td>
        <button class="btn-edit" data-id="${d.id}" data-nome="${p.nome}"
                data-categoria="${p.categoria}" data-preco="${p.preco}"
                data-descricao="${p.descricao}">Editar</button>
        <button class="btn-del" data-id="${d.id}">Excluir</button>
      </td>`;
    tabela.appendChild(tr);
  });
  ligarBotoes();
}

// ===== CREATE / UPDATE =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const categoria = document.getElementById('categoria').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const descricao = document.getElementById('descricao').value;
  const id = inputId.value;

  if (id) {
    await updateDoc(doc(db, 'produtos', id), { nome, categoria, preco, descricao });
  } else {
    await addDoc(produtosRef, { nome, categoria, preco, descricao });
  }
  resetForm();
  carregarProdutos();
});

// ===== DELETE e EDIT (botões) =====
function ligarBotoes() {
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.onclick = () => {
      inputId.value = btn.dataset.id;
      document.getElementById('nome').value = btn.dataset.nome;
      document.getElementById('categoria').value = btn.dataset.categoria;
      document.getElementById('preco').value = btn.dataset.preco;
      document.getElementById('descricao').value = btn.dataset.descricao;
      formTitle.textContent = 'Editar Produto';
      btnSalvar.textContent = 'Salvar alterações';
    };
  });
  document.querySelectorAll('.btn-del').forEach(btn => {
    btn.onclick = async () => {
      if (confirm('Excluir este produto?')) {
        await deleteDoc(doc(db, 'produtos', btn.dataset.id));
        carregarProdutos();
      }
    };
  });
}

function resetForm() {
  form.reset();
  inputId.value = '';
  formTitle.textContent = 'Novo Produto';
  btnSalvar.textContent = 'Adicionar';
}

carregarProdutos();
