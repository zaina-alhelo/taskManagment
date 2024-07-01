

let lastScrollTop = 0;
const minFontSize_koko = 100;
const maxFontSize_koko = 150; 


window.addEventListener('scroll', (event) => {
  let down = document.getElementById('welcome_01');
  let currentScrollTop = window.scrollY;
  let currentFontSize = parseInt(window.getComputedStyle(down).fontSize);

  if (currentScrollTop > lastScrollTop) {
    // Scrolling down
    if (currentFontSize < maxFontSize_koko) {
      down.style.fontSize = (currentFontSize + 1) + 'px';
    }
  } else {
    // Scrolling up
    if (currentFontSize > minFontSize_koko) {
      down.style.fontSize = (currentFontSize - 1) + 'px';
    }
  }

  lastScrollTop = currentScrollTop; // Update last scroll position
});
////// log out :
