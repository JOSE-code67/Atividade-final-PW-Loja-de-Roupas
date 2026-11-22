class card_objeto {
  constructor(elementoHTML) {
    this.elemento = elementoHTML;
    this.id = elementoHTML.id;
    this.nome = elementoHTML.querySelector('h3').textContent;
    this.precoTexto = elementoHTML.querySelector('.preco').textContent;
    this.precoNumero = Number(
      this.precoTexto.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
    );
    this.imagem = elementoHTML.querySelector('img').getAttribute('src');

   
    const viewsSalvas = JSON.parse(localStorage.getItem('clothesx_views')) || {};
    this.visualizacoes = viewsSalvas[this.id] ?? (Number(elementoHTML.getAttribute('data-views')) || 0);
    this.elemento.setAttribute('data-views', this.visualizacoes);

    this.categorias = (elementoHTML.getAttribute('data-categoria') || '').toLowerCase().split(' ');

    
    const botao = elementoHTML.querySelector('.btn-comprar');
    if (botao) {
      botao.addEventListener('click', () => {
        this.registrarCompra();
      });
    }
  }

  registrarCompra() {
   
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
    window.location.href = 'carrinho.html';
  }
}

const vitrineDestaques = document.getElementById('vitrine-destaques');


const todosProdutos = Array.from(document.querySelectorAll('main .card-produto'))
  .map(card => new card_objeto(card));


function atualizarVitrineDestaques() {
  if (!vitrineDestaques) return;

  vitrineDestaques.innerHTML = '';

  const top6 = [...todosProdutos]
    .sort((a, b) => b.visualizacoes - a.visualizacoes)
    .slice(0, 6);

  top6.forEach(produto => {
   
    const cardClone = produto.elemento.cloneNode(true);
    cardClone.removeAttribute('id');


    const botaoClone = cardClone.querySelector('.btn-comprar');
    if (botaoClone) {
      botaoClone.addEventListener('click', () => {
        produto.registrarCompra();
      });
    }

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