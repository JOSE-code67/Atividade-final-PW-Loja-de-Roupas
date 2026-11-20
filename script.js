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