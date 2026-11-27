
const variantesCores = {
  produto1: [
    { cor: 'Branca', img: 'img/produto1-camisa-casual-branca.png', hex: '#f5f5f5' },
    { cor: 'Preta', img: 'img/produto1-camisa-casual-preta.png', hex: '#1a1a1a' },
    { cor: 'Azul', img: 'img/produto1-camisa-casual-azul.png', hex: '#2563eb' },
    { cor: 'Bege', img: 'img/produto1-camisa-casual-bege.png', hex: '#d4a574' },
    { cor: 'Verde', img: 'img/produto1-camisa-casual-verde.png', hex: '#16a34a' }
  ],
  produto2: [
    { cor: 'Azul', img: 'img/produto2-calça-jeans-azul.png', hex: '#1e3a8a' },
    { cor: 'Azul Claro', img: 'img/produto2-calça-jeans-azul_claro.png', hex: '#60a5fa' }
  ],
  produto3: [
    { cor: 'Jeans', img: 'img/produto3-jaqueta-jeans.png', hex: '#3b82f6' },
    { cor: 'Preta', img: 'img/produto3-jaqueta-preta.png', hex: '#1a1a1a' },
    { cor: 'Bege', img: 'img/produto3-jaqueta-bege.png', hex: '#d4a574' },
    { cor: 'Azul Claro', img: 'img/produto3-jaqueta-azul-claro.png', hex: '#7dd3fc' },
    { cor: 'Cinza', img: 'img/produto3-jaqueta-cinza.png', hex: '#6b7280' }
  ],
  produto6: [
    { cor: 'Azul', img: 'img/produto10-saia-midi-azul.png', hex: '#1e40af' },
    { cor: 'Preta', img: 'img/produto10-saia-midi-preta.png', hex: '#1a1a1a' },
    { cor: 'Bege', img: 'img/produto10-saia-midi-bege.png', hex: '#d4a574' },
    { cor: 'Azul Claro', img: 'img/produto10-saia-midi-azul-claro.png', hex: '#7dd3fc' }
  ],
  produto4: [
    { cor: 'Azul', img: 'img/produto11-bermuda-Azul.png', hex: '#2563eb' },
    { cor: 'Preta', img: 'img/produto11-bermuda-preta.png', hex: '#1a1a1a' },
    { cor: 'Azul Marinho', img: 'img/produto11-bermuda-Azul-marinho.png', hex: '#1e3a8a' },
    { cor: 'Bege', img: 'img/produto11-bermuda-bege.png', hex: '#d4a574' },
    { cor: 'Cinza', img: 'img/produto11-bermuda-cinza.png', hex: '#6b7280' }
  ],
  produto5: [
    { cor: 'Branco', img: 'img/produto12-tenis-casual-branco.png', hex: '#f5f5f5' },
    { cor: 'Preto', img: 'img/produto12-tenis-casual-preto.png', hex: '#1a1a1a' },
    { cor: 'Azul Marinho', img: 'img/produto12-tenis-casual-azul-marinho.png', hex: '#1e3a8a' },
    { cor: 'Bege', img: 'img/produto12-tenis-casual-bege.png', hex: '#d4a574' },
    { cor: 'Cinza', img: 'img/produto12-tenis-casual-cinzapng.png', hex: '#9ca3af' }
  ],
  produto10: [
    { cor: 'Branca', img: 'img/produto4-sandalia-branca.png', hex: '#f5f5f5' },
    { cor: 'Preta', img: 'img/produto4-sandalia-preta.png', hex: '#1a1a1a' },
    { cor: 'Azul Celeste', img: 'img/produto4-sandalia-azul-celeste.png', hex: '#7dd3fc' }
  ]
};


const TAMANHOS_ROUPA = ['P', 'M', 'G', 'GG'];
const TAMANHOS_CALCADO = ['38', '40', '42', '44'];
const AUMENTO_POR_NIVEL = 0.05;

const produtosCalcado = new Set([
  'produto5', 'produto7', 'produto10', 'produto12', 'produto13',
  'produto14', 'produto15', 'produto16', 'produto17', 'produto18', 'produto19'
]);

function obterTamanhos(produtoId) {
  return produtosCalcado.has(produtoId) ? TAMANHOS_CALCADO : TAMANHOS_ROUPA;
}

function calcularPrecoPorTamanho(precoBase, tamanho, produtoId) {
  const lista = obterTamanhos(produtoId);
  const indice = Math.max(0, lista.indexOf(String(tamanho)));
  const fator = 1 + (indice * AUMENTO_POR_NIVEL);
  return Math.round(precoBase * fator * 100) / 100;
}

function formatarPrecoBR(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

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

 
  registrarCompra(avisarUsuario = false, opcoes = {}) {
    const cor = opcoes.cor || 'Padrão';
    const imagem = opcoes.imagem || this.imagem;
    const tamanhos = obterTamanhos(this.id);
    const tamanho = opcoes.tamanho || tamanhos[0];
    const precoFinal = calcularPrecoPorTamanho(this.precoNumero, tamanho, this.id);

    this.visualizacoes += 1;
    this.elemento.setAttribute('data-views', this.visualizacoes);

    const viewsSalvas = JSON.parse(localStorage.getItem('clothesx_views')) || {};
    viewsSalvas[this.id] = this.visualizacoes;
    localStorage.setItem('clothesx_views', JSON.stringify(viewsSalvas));

    atualizarVitrineDestaques();

    const carrinho = JSON.parse(localStorage.getItem('clothesx_carrinho')) || [];
    const itemExistente = carrinho.find(
      item =>
        item.id === this.id &&
        (item.cor || 'Padrão') === cor &&
        (item.tamanho || tamanhos[0]) === tamanho
    );

    if (itemExistente) {
      itemExistente.quantidade += 1;
      itemExistente.imagem = imagem;
      itemExistente.preco = precoFinal;
    } else {
      carrinho.push({
        id: this.id,
        nome: this.nome,
        preco: precoFinal,
        precoBase: this.precoNumero,
        imagem: imagem,
        cor: cor,
        tamanho: tamanho,
        quantidade: 1
      });
    }

    localStorage.setItem('clothesx_carrinho', JSON.stringify(carrinho));

    if (avisarUsuario) {
      const partes = [];
      if (cor && cor !== 'Padrão') partes.push(cor);
      if (tamanho) partes.push(`Tam. ${tamanho}`);
      const extra = partes.length ? ` (${partes.join(', ')})` : '';
      alert(`"${this.nome}${extra}" foi adicionado ao carrinho!\nPreço: ${formatarPrecoBR(precoFinal)}`);
    }
  }
}



function atualizarPrecoPopup(overlay, produtoId) {
  const popup = overlay.querySelector('.popup');
  if (!popup) return;
  const elPreco = popup.querySelector('.preco');
  if (!elPreco) return;

  
  if (!overlay.dataset.precoBase) {
    const texto = elPreco.textContent || 'R$ 0,00';
    const base = Number(texto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
    overlay.dataset.precoBase = String(base);
  }

  const precoBase = Number(overlay.dataset.precoBase) || 0;
  const tamanho = overlay.dataset.tamanhoSelecionado || obterTamanhos(produtoId)[0];
  const precoFinal = calcularPrecoPorTamanho(precoBase, tamanho, produtoId);
  elPreco.textContent = formatarPrecoBR(precoFinal);
}

function montarSeletorCores(overlay, produtoId) {
  const variantes = variantesCores[produtoId];
  const popup = overlay.querySelector('.popup');
  if (!popup) return;


  popup.querySelectorAll('.seletor-cores, .seletor-tamanhos').forEach(el => el.remove());

  const imgPrincipal = popup.querySelector('img');
  const btnComprar = popup.querySelector('.btn-comprar');

  if (variantes && variantes.length > 0) {
    const seletor = document.createElement('div');
    seletor.className = 'seletor-cores';
    seletor.innerHTML = '<p class="label-cores">Escolha a cor:</p><div class="cores-opcoes"></div>';
    const containerOpcoes = seletor.querySelector('.cores-opcoes');

    const srcAtual = imgPrincipal ? imgPrincipal.getAttribute('src') : '';
    let corInicial = variantes[0];
    const match = variantes.find(v => v.img === srcAtual || srcAtual.endsWith(v.img.split('/').pop()));
    if (match) corInicial = match;

    overlay.dataset.corSelecionada = corInicial.cor;
    overlay.dataset.imgSelecionada = corInicial.img;
    if (imgPrincipal) imgPrincipal.src = corInicial.img;

    variantes.forEach((v) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cor-opcao' + (v.cor === corInicial.cor ? ' ativa' : '');
      btn.title = v.cor;
      btn.setAttribute('aria-label', `Cor ${v.cor}`);
      btn.style.backgroundColor = v.hex;
      if (['#f5f5f5', '#d4a574', '#7dd3fc', '#60a5fa', '#9ca3af'].includes(v.hex.toLowerCase())) {
        btn.style.border = '2px solid #94a3b8';
      }
      btn.dataset.cor = v.cor;
      btn.dataset.img = v.img;

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        containerOpcoes.querySelectorAll('.cor-opcao').forEach(b => b.classList.remove('ativa'));
        btn.classList.add('ativa');
        overlay.dataset.corSelecionada = v.cor;
        overlay.dataset.imgSelecionada = v.img;
        if (imgPrincipal) imgPrincipal.src = v.img;
      });

      containerOpcoes.appendChild(btn);
    });

    if (btnComprar) popup.insertBefore(seletor, btnComprar);
    else popup.appendChild(seletor);
  } else {
    overlay.dataset.corSelecionada = 'Padrão';
    overlay.dataset.imgSelecionada = imgPrincipal ? imgPrincipal.getAttribute('src') : '';
  }


  const tamanhos = obterTamanhos(produtoId);
  const seletorTam = document.createElement('div');
  seletorTam.className = 'seletor-tamanhos';
  seletorTam.innerHTML = `
    <p class="label-tamanhos">Escolha o tamanho:</p>
    <div class="tamanhos-opcoes"></div>
    <p class="dica-preco-tamanho">+5% no preço a cada tamanho maior (P→M→G→GG)</p>
  `;

  if (produtosCalcado.has(produtoId)) {
    seletorTam.querySelector('.dica-preco-tamanho').textContent =
      '+5% no preço a cada numeração maior (38→40→42→44)';
  }

  const containerTam = seletorTam.querySelector('.tamanhos-opcoes');
  const tamanhoInicial = tamanhos[0];
  overlay.dataset.tamanhoSelecionado = tamanhoInicial;

  tamanhos.forEach((tam, indice) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tamanho-opcao' + (tam === tamanhoInicial ? ' ativa' : '');
    btn.textContent = tam;
    btn.title = `Tamanho ${tam} (${indice === 0 ? 'preço base' : '+' + (indice * 5) + '%'})`;
    btn.dataset.tamanho = tam;
    btn.dataset.indice = String(indice);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      containerTam.querySelectorAll('.tamanho-opcao').forEach(b => b.classList.remove('ativa'));
      btn.classList.add('ativa');
      overlay.dataset.tamanhoSelecionado = tam;
      atualizarPrecoPopup(overlay, produtoId);
    });

    containerTam.appendChild(btn);
  });

  if (btnComprar) popup.insertBefore(seletorTam, btnComprar);
  else popup.appendChild(seletorTam);

  atualizarPrecoPopup(overlay, produtoId);
}

function obterOpcoesDoOverlay(overlay) {
  if (!overlay) {
    return { cor: 'Padrão', imagem: null, tamanho: null };
  }
  return {
    cor: overlay.dataset.corSelecionada || 'Padrão',
    imagem: overlay.dataset.imgSelecionada || null,
    tamanho: overlay.dataset.tamanhoSelecionado || null
  };
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

      const btn = alvo.querySelector('.btn-comprar');
      const produtoId = btn ? btn.getAttribute('data-produto-id') : null;
      if (produtoId) {
        montarSeletorCores(alvo, produtoId);
      }
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

    const opcoes = obterOpcoesDoOverlay(overlay);

    if (produto) {
      produto.registrarCompra(true, {
        cor: opcoes.cor,
        imagem: opcoes.imagem || produto.imagem,
        tamanho: opcoes.tamanho
      });
    } else {
      const nome = overlay.querySelector('h3')?.textContent.trim() || 'Produto';
      const precoTexto = overlay.querySelector('.preco')?.textContent || 'R$ 0,00';
      const precoBase = Number(overlay.dataset.precoBase) ||
        Number(precoTexto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 0;
      const idFallback = produtoId || overlay.id;
      const tamanho = opcoes.tamanho || obterTamanhos(idFallback)[0];
      const precoFinal = calcularPrecoPorTamanho(precoBase, tamanho, idFallback);
      const imgFinal = opcoes.imagem || overlay.querySelector('img')?.getAttribute('src') || '';
      const cor = opcoes.cor || 'Padrão';

      const carrinho = JSON.parse(localStorage.getItem('clothesx_carrinho')) || [];
      const existente = carrinho.find(
        item => item.nome === nome &&
          (item.cor || 'Padrão') === cor &&
          (item.tamanho || '') === tamanho
      );
      if (existente) {
        existente.quantidade += 1;
        existente.imagem = imgFinal;
        existente.preco = precoFinal;
      } else {
        carrinho.push({
          id: idFallback,
          nome,
          preco: precoFinal,
          precoBase,
          imagem: imgFinal,
          cor,
          tamanho,
          quantidade: 1
        });
      }
      localStorage.setItem('clothesx_carrinho', JSON.stringify(carrinho));
      const partes = [];
      if (cor && cor !== 'Padrão') partes.push(cor);
      if (tamanho) partes.push(`Tam. ${tamanho}`);
      const extra = partes.length ? ` (${partes.join(', ')})` : '';
      alert(`"${nome}${extra}" foi adicionado ao carrinho!\nPreço: ${formatarPrecoBR(precoFinal)}`);
    }

    fecharPopup();
    return;
  }

  const linkPai = botao.closest('a[href^="#"]');
  if (linkPai) {
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
    const variantes = variantesCores[produto.id];
    const tamanhoBase = obterTamanhos(produto.id)[0];
    if (variantes && variantes.length) {
      produto.registrarCompra(true, {
        cor: variantes[0].cor,
        imagem: variantes[0].img,
        tamanho: tamanhoBase
      });
    } else {
      produto.registrarCompra(true, { tamanho: tamanhoBase });
    }
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



const carrossel = document.querySelector('.carrossel');
const slidesContainer = document.getElementById('slides-container');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const indicadores = document.querySelectorAll('.bolinha');

if (carrossel && slidesContainer && btnAnterior && btnProximo) {

  const slides = slidesContainer.querySelectorAll('.slide');
  let slideAtual = 0;
  let intervalo;

  function mostrarSlide(indice) {

    if (indice >= slides.length) {
      slideAtual = 0;
    } else if (indice < 0) {
      slideAtual = slides.length - 1;
    } else {
      slideAtual = indice;
    }

    slidesContainer.style.transform =
      `translateX(-${slideAtual * 100}%)`;

    indicadores.forEach((bolinha, i) => {
      bolinha.classList.toggle('ativa', i === slideAtual);
    });
  }

  function proximoSlide() {
    mostrarSlide(slideAtual + 1);
  }

  function anteriorSlide() {
    mostrarSlide(slideAtual - 1);
  }

  btnProximo.addEventListener('click', () => {
    proximoSlide();
    reiniciarIntervalo();
  });

  btnAnterior.addEventListener('click', () => {
    anteriorSlide();
    reiniciarIntervalo();
  });

  indicadores.forEach((bolinha, indice) => {
    bolinha.addEventListener('click', () => {
      mostrarSlide(indice);
      reiniciarIntervalo();
    });
  });

  function iniciarIntervalo() {
    intervalo = setInterval(proximoSlide, 5000);
  }

  function reiniciarIntervalo() {
    clearInterval(intervalo);
    iniciarIntervalo();
  }

  mostrarSlide(0);
  iniciarIntervalo();
}
