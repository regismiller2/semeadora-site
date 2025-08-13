function fecharPopup() {
    let popup = document.getElementById('whatsappPopup');
    popup.style.opacity = '0';
    setTimeout(() => popup.style.display = 'none', 500); // espera o fade-out
}

// Mostra o pop-up imediatamente e fecha após 10s
window.onload = function() {
    let popup = document.getElementById('whatsappPopup');
    popup.style.display = 'block';
    popup.style.opacity = '1';

    setTimeout(() => {
        fecharPopup();
    }, 10000);
}

const carousel = document.getElementById('brandCarousel');
const carousel_implemento = document.getElementById('brandCarouselImplemento');

// Duplica o conteúdo para criar o loop infinito
carousel.innerHTML += carousel.innerHTML;
carousel_implemento.innerHTML += carousel_implemento.innerHTML;

let scrollSpeed = 40; // pixels por segundo
let lastTime = null;
let isManualScrolling = false;
let manualTimeout;
let lastScrollLeft = 0;
let lastScrollLeftImplemento = 0;

function autoScroll(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = (timestamp - lastTime) / 1000; 
    lastTime = timestamp;

    if (!isManualScrolling) {
        carousel.scrollLeft += scrollSpeed * deltaTime;
        if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
            carousel.scrollLeft = 0;
        }

        carousel_implemento.scrollLeft += scrollSpeed * deltaTime;
        if (carousel_implemento.scrollLeft >= carousel_implemento.scrollWidth / 2) {
            carousel_implemento.scrollLeft = 0;
        }
    }

    lastScrollLeft = carousel.scrollLeft;
    lastScrollLeftImplemento = carousel_implemento.scrollLeft;
    requestAnimationFrame(autoScroll);
}

requestAnimationFrame(autoScroll);

function pauseAutoScroll() {
    isManualScrolling = true;
    clearTimeout(manualTimeout);
    manualTimeout = setTimeout(() => {
        isManualScrolling = false;
    }, 4000); // retoma após 4s sem interação
}

// Detecta interação do usuário
carousel.addEventListener('wheel', pauseAutoScroll, { passive: true });
carousel.addEventListener('touchstart', pauseAutoScroll, { passive: true });
carousel_implemento.addEventListener('wheel', pauseAutoScroll, { passive: true });
carousel_implemento.addEventListener('touchstart', pauseAutoScroll, { passive: true });

// Detecta rolagem manual (drag barra ou touch move)
carousel.addEventListener('scroll', () => {
    // Se a diferença de scroll não veio do autoscroll, pausa
    if (Math.abs(carousel.scrollLeft - lastScrollLeft) > 5 && !isManualScrolling) {
        pauseAutoScroll();
    }
}, { passive: true });

carousel_implemento.addEventListener('scroll', () => {
    if (Math.abs(carousel_implemento.scrollLeft - lastScrollLeftImplemento) > 5 && !isManualScrolling) {
        pauseAutoScroll();
    }
}, { passive: true });

// const carousel_implemento = document.getElementById('brandCarouselImplemento');

// // Duplica o conteúdo para criar o loop infinito
// carousel_implemento.innerHTML += carousel_implemento.innerHTML;

// requestAnimationFrame(autoScroll);

// // Detecta interação do usuário
// carousel_implemento.addEventListener('wheel', pauseAutoScroll, { passive: true });
// carousel_implemento.addEventListener('touchstart', pauseAutoScroll, { passive: true });

// // Detecta rolagem manual (drag barra ou touch move)
// carousel_implemento.addEventListener('scroll', () => {
// // Se a diferença de scroll não veio do autoscroll, pausa
// if (Math.abs(carousel_implemento.scrollLeft - lastScrollLeft) > 5 && !isManualScrolling) {
//     pauseAutoScroll();
// }
// }, { passive: true });


(function(){
    // Suporte a múltiplos carousels na mesma página
    document.querySelectorAll('.product-carousel').forEach(function(root){
      const track   = root.querySelector('.pc-track');
      const cards   = Array.from(root.querySelectorAll('.pc-card'));
      const prevBtn = root.querySelector('.pc-prev');
      const nextBtn = root.querySelector('.pc-next');
      const pageEl  = root.querySelector('.pc-page');
      const pagesEl = root.querySelector('.pc-pages');

      let perPage = 4, totalPages = 1, currentPage = 0;

      function getPerPage(){
        const v = getComputedStyle(root).getPropertyValue('--per-page');
        const n = parseInt(v, 10); return isNaN(n) ? 4 : n;
      }
      function updateMeta(){
        perPage = getPerPage();
        totalPages = Math.max(1, Math.ceil(cards.length / perPage));
        currentPage = Math.min(currentPage, totalPages - 1);
        pageEl.textContent = currentPage + 1;
        pagesEl.textContent = totalPages;
        updateButtons();
      }
      function updateButtons(){
        prevBtn.disabled = (currentPage === 0);
        nextBtn.disabled = (currentPage >= totalPages - 1);
        prevBtn.setAttribute('aria-disabled', prevBtn.disabled);
        nextBtn.setAttribute('aria-disabled', nextBtn.disabled);
      }
      function goTo(page){
        currentPage = Math.max(0, Math.min(totalPages - 1, page));
        const firstIndex = currentPage * perPage;
        const firstCard = cards[firstIndex];
        if (firstCard){
          const left = firstCard.offsetLeft - cards[0].offsetLeft;
          track.scrollTo({ left, behavior: 'smooth' });
        }
        pageEl.textContent = currentPage + 1;
        updateButtons();
      }

      // Botões
      prevBtn.addEventListener('click', () => goTo(currentPage - 1));
      nextBtn.addEventListener('click', () => goTo(currentPage + 1));

      // Teclado (setas) quando a faixa está focada
      track.setAttribute('tabindex', '0');
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(currentPage + 1); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(currentPage - 1); }
      });

      // Arraste no desktop (pointer events). Toque no mobile já funciona nativo
      let isDown=false, startX=0, startScroll=0;
      track.addEventListener('pointerdown', (e)=>{ isDown=true; startX=e.clientX; startScroll=track.scrollLeft; track.setPointerCapture(e.pointerId); });
      track.addEventListener('pointermove', (e)=>{ if(!isDown) return; track.scrollLeft = startScroll + (startX - e.clientX); });
      function endDrag(){ isDown=false; }
      track.addEventListener('pointerup', endDrag);
      track.addEventListener('pointercancel', endDrag);
      track.addEventListener('mouseleave', endDrag);

      // Atualiza ao carregar/redimensionar
      updateMeta();
      window.addEventListener('resize', debounce(updateMeta, 150));

      // Utilitário debounce
      function debounce(fn, t){ let id; return function(){ clearTimeout(id); id = setTimeout(fn, t); }; }
    });
  })();

    // Contador dinâmico de anos desde 2006
    (function(){
      const start = 2006;
      const years = Math.max(0, new Date().getFullYear() - start);
      const el = document.getElementById('yearsCount');
      if(!el) return; countUp(el, years, 900);

      function countUp(el, to, duration){
        const from = 0; const startTime = performance.now();
        function tick(now){
          const p = Math.min(1, (now - startTime)/duration);
          const val = Math.round(from + (to - from) * easeOutCubic(p));
          el.textContent = val;
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }
      function easeOutCubic(x){ return 1 - Math.pow(1 - x, 3); }
    })();