class card_objeto {
  constructor(elementoHTML) {
    this.elemento = elementoHTML;
    this.id = elementoHTML.id;
    this.nome = elementoHTML.querySelector('h3').textContent.trim();
    this.precoTexto = elementoHTML.querySelector('.preco').textContent;
    this.precoNumero = Number(
      this.precoTexto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    );
    this.imagem = elementoHTML.querySelector('img').getAttribute('src');

    const viewsSalvas = JSON.parse(localStorage.getItem('clothesx_views')) || {};
    this.visualizacoes = viewsSalvas[this.id] ?? (Number(elementoHTML.getAttribute('data-views')) || 0);
    this.elemento.setAttribute('data-views', this.visualizacoes);

    this.categorias = (elementoHTML.getAttribute('data-categoria') || '').toLowerCase().split(' ');
  }

  registrarCompra(avisarUsuario = false) {
    this.visualizacoes += 1;
    this.elemento.setAttribute('data-views', this.visualizacoes);

    const viewsSalvas = JSON.parse(localStorage.getItem('clothesx_views')) || {};
    viewsSalvas[this.id] = this.visualizacoes;
    localStorage.setItem('clothesx_views', JSON.stringify(viewsSalvas));

    atualizarVitrineDestaques();

    const carrinho = JSON.parse(localStorage.getItem('clothesx_carrinho')) || [];
    const itemExistente = carrinho.find(item => item.id === this.id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      carrinho.push({
        id: this.id,
        nome: this.nome,
        preco: this.precoNumero,
        imagem: this.imagem,
        quantidade: 1
      });
    }

    localStorage.setItem('clothesx_carrinho', JSON.stringify(carrinho));

    if (avisarUsuario) {
      alert(`"${this.nome}" foi adicionado ao carrinho!`);
    }
  }
}

function fecharPopup() {
  document.querySelectorAll('.overlayton').forEach(el => {
    el.classList.remove('aberto');
    el.style.opacity = '0';
    el.style.pointerEvents = 'none';
  });
  if (window.location.hash) {
    try {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch (e) {
      window.location.hash = '';
    }
  }
}

function abrirPopupPorHash() {
  const hash = window.location.hash;
  document.querySelectorAll('.overlayton').forEach(el => {
    el.classList.remove('aberto');
    el.style.opacity = '';
    el.style.pointerEvents = '';
  });
  if (hash && hash.length > 1) {
    const alvo = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (alvo && alvo.classList.contains('overlayton')) {
      alvo.classList.add('aberto');
      alvo.style.opacity = '1';
      alvo.style.pointerEvents = 'auto';
    }
  }
}

window.addEventListener('hashchange', abrirPopupPorHash);
window.addEventListener('DOMContentLoaded', abrirPopupPorHash);

const vitrineDestaques = document.getElementById('vitrine-destaques');
const mapaProdutos = new Map();

const todosProdutos = Array.from(document.querySelectorAll('main .card-produto')).map(card => {
  const obj = new card_objeto(card);
  mapaProdutos.set(obj.id, obj);
  return obj;
});

document.addEventListener('click', (evento) => {
  const botaoFechar = evento.target.closest('.btn-fechar');
  if (botaoFechar) {
    evento.preventDefault();
    evento.stopPropagation();
    fecharPopup();
    return;
  }

  const botao = evento.target.closest('.btn-comprar, a[href^="#"] button');
  if (!botao) {
    if (evento.target.classList && evento.target.classList.contains('overlayton')) {
      fecharPopup();
    }
    return;
  }

  const overlay = botao.closest('.overlayton');
  if (overlay) {
    evento.preventDefault();
    const produtoId = botao.getAttribute('data-produto-id');
    let produto = produtoId ? mapaProdutos.get(produtoId) : null;

    if (!produto) {
      const tituloPopup = overlay.querySelector('h3')?.textContent.trim();
      produto = todosProdutos.find(p => p.nome === tituloPopup);
    }

    if (produto) {
      produto.registrarCompra(true);
    } else {
      const nome = overlay.querySelector('h3')?.textContent.trim() || 'Produto';
      const precoTexto = overlay.querySelector('.preco')?.textContent || 'R$ 0,00';
      const preco = Number(precoTexto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
      const imagem = overlay.querySelector('img')?.getAttribute('src') || '';
      const carrinho = JSON.parse(localStorage.getItem('clothesx_carrinho')) || [];
      const existente = carrinho.find(item => item.nome === nome);
      if (existente) {
        existente.quantidade += 1;
      } else {
        carrinho.push({ id: overlay.id, nome, preco, imagem, quantidade: 1 });
      }
      localStorage.setItem('clothesx_carrinho', JSON.stringify(carrinho));
      alert(`"${nome}" foi adicionado ao carrinho!`);
    }

    fecharPopup();
    return;
  }

  const linkPai = botao.closest('a[href^="#"]');
  if (linkPai) {
    // Se já estamos no mesmo hash, reabre o popup manualmente
    const href = linkPai.getAttribute('href');
    if (window.location.hash === href) {
      evento.preventDefault();
      abrirPopupPorHash();
    }
    return;
  }

  evento.preventDefault();
  const card = botao.closest('.card-produto');
  const produto = card ? mapaProdutos.get(card.id) : null;
  if (produto) {
    produto.registrarCompra(true);
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    fecharPopup();
  }
});

function atualizarVitrineDestaques() {
  if (!vitrineDestaques) return;

  vitrineDestaques.innerHTML = '';

  const top6 = [...todosProdutos]
    .sort((a, b) => b.visualizacoes - a.visualizacoes)
    .slice(0, 6);

  top6.forEach(produto => {
    const cardClone = produto.elemento.cloneNode(true);
    cardClone.removeAttribute('id');
    vitrineDestaques.appendChild(cardClone);
  });
}

document.querySelectorAll('#menu-navegacao a[data-categoria]').forEach(link => {
  link.addEventListener('click', () => {
    const categoria = link.getAttribute('data-categoria');

    todosProdutos.forEach(produto => {
      const pertence = categoria === 'todos' || produto.categorias.includes(categoria);
      produto.elemento.style.display = pertence ? '' : 'none';
    });

    document.querySelectorAll('main section.vitrine:not(#produtos)').forEach(secao => {
      const temVisivel = Array.from(secao.querySelectorAll('.card-produto'))
        .some(card => card.style.display !== 'none');
      secao.style.display = temVisivel ? '' : 'none';
    });
  });
});

atualizarVitrineDestaques();