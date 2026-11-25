
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

const mensagem = document.createElement('p');
mensagem.style.cssText = 'margin:12px 0;padding:10px;border-radius:8px;display:none;';
form.insertAdjacentElement('afterend', mensagem);

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.style.display = 'block';
  mensagem.style.background = erro ? '#fee2e2' : '#dcfce7';
  mensagem.style.color = erro ? '#991b1b' : '#166534';
}

function explicarErro(erro) {
  console.error('Erro no Firebase:', erro);

  if (erro.code === 'permission-denied') {
    return 'Acesso recusado pelo Firebase. Verifique as regras do Firestore.';
  }

  if (erro.code === 'unavailable') {
    return 'Não foi possível conectar ao Firebase. Verifique sua internet.';
  }

  return 'Erro ao acessar o Firebase. Abra o Console (F12) para ver os detalhes.';
}

async function carregarProdutos() {
  tabela.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';

  try {
    const snap = await getDocs(produtosRef);
    tabela.innerHTML = '';

    if (snap.empty) {
      tabela.innerHTML = '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>';
      return;
    }

    snap.forEach((registro) => {
      const p = registro.data();
      const tr = document.createElement('tr');

      const nome = document.createElement('td');
      nome.textContent = p.nome || '';

      const categoria = document.createElement('td');
      categoria.textContent = p.categoria || '';

      const preco = document.createElement('td');
      preco.textContent = 'R$ ' + Number(p.preco || 0).toFixed(2).replace('.', ',');

      const acoes = document.createElement('td');

      const editar = document.createElement('button');
      editar.type = 'button';
      editar.className = 'btn-edit';
      editar.textContent = 'Editar';

      editar.onclick = () => {
        inputId.value = registro.id;
        document.getElementById('nome').value = p.nome || '';
        document.getElementById('categoria').value = p.categoria || '';
        document.getElementById('preco').value = p.preco ?? '';
        document.getElementById('descricao').value = p.descricao || '';
        formTitle.textContent = 'Editar Produto';
        btnSalvar.textContent = 'Salvar alterações';
      };

      const excluir = document.createElement('button');
      excluir.type = 'button';
      excluir.className = 'btn-del';
      excluir.textContent = 'Excluir';

      excluir.onclick = async () => {
        if (!confirm('Excluir este produto?')) return;

        try {
          await deleteDoc(doc(db, 'produtos', registro.id));
          mostrarMensagem('Produto excluído com sucesso!');
          await carregarProdutos();
        } catch (erro) {
          mostrarMensagem(explicarErro(erro), true);
        }
      };

      acoes.append(editar, excluir);
      tr.append(nome, categoria, preco, acoes);
      tabela.appendChild(tr);
    });

  } catch (erro) {
    tabela.innerHTML = '<tr><td colspan="4">Erro ao carregar produtos.</td></tr>';
    mostrarMensagem(explicarErro(erro), true);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const categoria = document.getElementById('categoria').value.trim();
  const preco = Number(document.getElementById('preco').value);
  const descricao = document.getElementById('descricao').value.trim();
  const id = inputId.value;

  if (!nome || !categoria || !descricao || !Number.isFinite(preco) || preco < 0) {
    mostrarMensagem('Preencha todos os campos corretamente.', true);
    return;
  }

  const dados = { nome, categoria, preco, descricao };

  btnSalvar.disabled = true;
  btnSalvar.textContent = 'Salvando...';

  try {
    if (id) {
      await updateDoc(doc(db, 'produtos', id), dados);
      mostrarMensagem('Produto atualizado no Firebase!');
    } else {
      await addDoc(produtosRef, dados);
      mostrarMensagem('Produto cadastrado no Firebase!');
    }

    form.reset();
    inputId.value = '';
    formTitle.textContent = 'Novo Produto';
    await carregarProdutos();

  } catch (erro) {
    mostrarMensagem(explicarErro(erro), true);

  } finally {
    btnSalvar.disabled = false;
    btnSalvar.textContent = inputId.value ? 'Salvar alterações' : 'Adicionar';
  }
});

carregarProdutos();
