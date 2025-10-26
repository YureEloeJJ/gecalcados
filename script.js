let produtos = [];

const buscaNomeInput = document.getElementById('buscaNome');
const buscaCodigoInput = document.getElementById('buscaCodigo');
const resultadoDiv = document.getElementById('resultado');
const noResultDiv = document.getElementById('noResult');
const btnBuscar = document.getElementById('btnBuscar');
const contadorDiv = document.getElementById('contador');

// Carrega produtos do JSON externo
async function carregarProdutos() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) throw new Error('Erro ao carregar o JSON');
    produtos = await response.json();
    listarTodosProdutos(); // exibe todos inicialmente
  } catch (error) {
    console.error(error);
    noResultDiv.textContent = 'Não foi possível carregar os produtos.';
    noResultDiv.style.display = 'block';
  }
}

// Retorna ícone dependendo do tipo de produto
function obterIconeProduto(nomeProduto) {
  const nome = nomeProduto.toLowerCase();

  if (nome.includes('sandália')) return '<i class="fas fa-sandal"></i>';
  if (nome.includes('mocassim')) return '<i class="fas fa-shoe-prints"></i>';
  if (nome.includes('tênis')) return '<i class="fas fa-running"></i>';
  if (nome.includes('bota')) return '<i class="fas fa-boot"></i>';
  return '<i class="fas fa-shoe-prints"></i>'; // ícone padrão
}

// Adiciona um card ao resultado
function adicionarCard(p) {
  const valorNum = parseFloat(p.valor_com_acrescimo.replace(',', '.'));
  let classeValor = '';

  if (valorNum < 80) classeValor = 'valor-baixo';
  else if (valorNum >= 80 && valorNum <= 100) classeValor = 'valor-medio';
  else classeValor = 'valor-alto';

  const icone = obterIconeProduto(p.produto);

  const card = document.createElement('div');
  card.classList.add('card');
  card.innerHTML = `
    <div class="produto-nome">${icone} ${p.produto}</div>
    <div class="codigo">${p.codigo}</div>
    <div class="valor ${classeValor}">R$ ${p.valor_com_acrescimo}</div>
  `;
  resultadoDiv.appendChild(card);
}

// Atualiza contador
function atualizarContador(qtd) {
  contadorDiv.textContent = `${qtd} produto(s) encontrado(s)`;
}

// Lista todos os produtos
function listarTodosProdutos() {
  resultadoDiv.innerHTML = '';
  noResultDiv.style.display = 'none';

  produtos.forEach(p => adicionarCard(p));
  atualizarContador(produtos.length);
}

// Função de filtragem
function filtrarProdutos() {
  const termoNome = buscaNomeInput.value.trim().toLowerCase();
  const termoCodigo = buscaCodigoInput.value.trim().toLowerCase();
  resultadoDiv.innerHTML = '';

  // Se nenhum termo, exibe todos
  if (!termoNome && !termoCodigo) {
    listarTodosProdutos();
    return;
  }

  const filtrados = produtos.filter(p =>
    (termoNome && p.produto.toLowerCase().includes(termoNome)) ||
    (termoCodigo && p.codigo.toLowerCase().includes(termoCodigo))
  );

  if (filtrados.length === 0) {
    noResultDiv.textContent = 'Nenhum produto encontrado.';
    noResultDiv.style.display = 'block';
    atualizarContador(0);
  } else {
    noResultDiv.style.display = 'none';
    filtrados.forEach(p => adicionarCard(p));
    atualizarContador(filtrados.length);
  }
}

// Evento do botão de busca
btnBuscar.addEventListener('click', filtrarProdutos);

// Carregar produtos ao iniciar
carregarProdutos();
