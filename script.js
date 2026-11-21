// man, isso tudo é para o carrosel funcionar, com o menu, se quiser da uma olhada @isaque - é o zé
const btnMenu = document.getElementById('btn-menu');
const menuNav = document.getElementById('menu-navegacao');

if (btnMenu && menuNav) {
  btnMenu.addEventListener('click', () => {
    menuNav.classList.toggle('ativo');
  });


  document.querySelectorAll('#menu-navegacao a').forEach(link => {
    link.addEventListener('click', () => {
      menuNav.classList.remove('ativo');
    });
  });
}


const slidesContainer = document.getElementById('slides-container');
const slides = document.querySelectorAll('.slide');
const bolinhas = document.querySelectorAll('.bolinha');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');

let indiceAtual = 0;
const totalSlides = slides.length;

function mostrarSlide(indice) {
  if (indice >= totalSlides) {
    indiceAtual = 0;
  } else if (indice < 0) {
    indiceAtual = totalSlides - 1;
  } else {
    indiceAtual = indice;
  }


  slidesContainer.style.transform = `translateX(-${indiceAtual * 100}%)`;


  bolinhas.forEach(b => b.classList.remove('ativa'));
  bolinhas[indiceAtual].classList.add('ativa');
}


btnProximo.addEventListener('click', () => {
  mostrarSlide(indiceAtual + 1);
  reiniciarTempo();
});

btnAnterior.addEventListener('click', () => {
  mostrarSlide(indiceAtual - 1);
  reiniciarTempo();
});


bolinhas.forEach(bolinha => {
  bolinha.addEventListener('click', () => {
    const index = Number(bolinha.getAttribute('data-index'));
    mostrarSlide(index);
    reiniciarTempo();
  });
});


let intervalo = setInterval(() => {
  mostrarSlide(indiceAtual + 1);
}, 5000);


function reiniciarTempo() {
  clearInterval(intervalo);
  intervalo = setInterval(() => {
    mostrarSlide(indiceAtual + 1);
  }, 5000);
}


// agora, essa parte aqui é dos card @Isaque - é o zé
 class card_objeto{
    constructor(elementoHTML){
      this.elemento = elementoHTML;
      this.nome = elementoHTML.querySelector('h3').textContent;
      this.visualizacoes = Number(elementoHTML.getAttribute('data-views')) || 0;
       this.categorias = (elementoHTML.getAttribute('data-categoria') || '').toLowerCase().split(' ');

       const botao = elementoHTML.querySelector('.btn-comprar');
       if (botao){
        botao.addEventListener('click', ()=>{
          this.adicionarvisualizacao();

        });
       }
    }
    adicionarvisualizacao(){
      this.visualizacoes += 1;
      this.elemento.setAttribute('data-views', this.visualizacoes);
      console.log(`${this.nome}: ${this.visualizacoes} visualizações`);
      atualizarVitrine();
    }
  }

const vitrine = document.getElementById('vitrine-destaques');
const tituloVitrine = document.querySelector('#produtos h2');
let categoriaAtual = 'todos';       
const produtos = Array.from(document.querySelectorAll('#vitrine-destaques .card-produto'))
  .map(card => new card_objeto(card));


function atualizarVitrine() {
  if (!vitrine) return;

  produtos.sort((a, b) => b.visualizacoes - a.visualizacoes);

  let exibidos = 0;

  produtos.forEach(item => {
    vitrine.appendChild(item.elemento);
    const pertenceCategoria = categoriaAtual === 'todos' || item.categorias.includes(categoriaAtual);

    if (pertenceCategoria && exibidos < 6) {
      item.elemento.style.display = '';
      exibidos++;
    } else {
      item.elemento.style.display = 'none';
    }
  });
}


document.querySelectorAll('#menu-navegacao a[data-categoria]').forEach(link => {
  link.addEventListener('click', () => {
    categoriaAtual = link.getAttribute('data-categoria');

    if (tituloVitrine) {
      tituloVitrine.textContent = categoriaAtual === 'todos'
        ? 'Destaques da Semana'
        : `Destaques: ${link.textContent}`;
    }

    atualizarVitrine();
  });
});


atualizarVitrine();