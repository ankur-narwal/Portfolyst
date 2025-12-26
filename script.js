document.addEventListener('DOMContentLoaded', () => {

  /* =========================================
     1. GLOBAL VARIABLES & SELECTORS
     ========================================= */
  const body = document.body;
  const themeBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
  const searchInput = document.getElementById('search');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  const grid = document.getElementById('portfolio-grid');

  /* =========================================
     2. THEME LOGIC (Fixed Class Name: 'dark')
     ========================================= */
  
  // A. Helper: Update Sun/Moon Icons
  const updateIcons = (isDark) => {
    themeBtns.forEach(btn => {
      btn.textContent = isDark ? '☀️' : '🌙';
    });
  };

  // B. Helper: Update Theme Images (Data Attributes)
  const updateThemeImages = (isDark) => {
    const images = document.querySelectorAll('.theme-img');
    images.forEach(img => {
      if (isDark) {
        if(img.getAttribute('data-dark')) img.src = img.getAttribute('data-dark');
      } else {
        if(img.getAttribute('data-light')) img.src = img.getAttribute('data-light');
      }
    });
  };

  // C. Main Toggle Function
  const applyTheme = (isDark) => {
    if (isDark) {
      body.classList.add('dark'); // <--- CHANGED BACK TO 'dark'
    } else {
      body.classList.remove('dark'); // <--- CHANGED BACK TO 'dark'
    }
    updateIcons(isDark);
    updateThemeImages(isDark);
  };

  // D. Initial Load Check
  const savedTheme = localStorage.getItem('portfolyst-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Decide initial state
  let isDarkMode = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
  applyTheme(isDarkMode);

  // E. Event Listeners for Theme Buttons
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      isDarkMode = !isDarkMode;
      applyTheme(isDarkMode);
      localStorage.setItem('portfolyst-theme', isDarkMode ? 'dark' : 'light');
    });
  });

  /* =========================================
     3. MOBILE DRAWER
     ========================================= */
  const hamburger = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.drawer-close');
  const drawer = document.querySelector('.mobile-drawer');

  if (hamburger && drawer) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.add('active');
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      drawer.classList.remove('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (drawer && drawer.classList.contains('active')) {
      if (!drawer.contains(e.target) && !hamburger.contains(e.target)) {
        drawer.classList.remove('active');
      }
    }
  });

  /* =========================================
     4. PORTFOLIO GRID RENDERER
     ========================================= */
  function renderGrid() {
    if (!grid) return;
    if (typeof portfolios === 'undefined') {
      console.error("Error: data.js is not loaded.");
      return;
    }

    grid.innerHTML = portfolios.map(person => {
      const catString = person.categories.join(',');
      return `
        <article class="card" data-name="${person.name}" data-cat="${catString}">
          <a class="card-thumb" href="reference_portfolio.html?id=${person.id}" title="Open portfolio">
            <div class="thumb" style="background-image: url('${person.image}');"></div>
          </a>
          <div class="card-body">
            <h3 class="card-title">${person.name}</h3>
            <a class="external" href="reference_portfolio.html?id=${person.id}" title="Open details">⤢</a>
          </div>
        </article>
      `;
    }).join('');
  }

  renderGrid();

  /* =========================================
     5. FILTER LOGIC
     ========================================= */
  function applyFilters() {
    const currentCards = Array.from(document.querySelectorAll('.card'));
    const activeBtn = document.querySelector('.filter-btn.active');
    const category = activeBtn ? activeBtn.dataset.cat : 'all';
    const query = (searchInput && searchInput.value.trim().toLowerCase()) || '';

    currentCards.forEach(card => {
      const name = card.dataset.name.toLowerCase();
      const cats = card.dataset.cat.toLowerCase();
      const catMatch = (category === 'all') || (cats.includes(category));
      const nameMatch = !query || name.includes(query);
      card.style.display = (catMatch && nameMatch) ? 'flex' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', () => applyFilters());
  }

  if (!document.querySelector('.filter-btn.active') && filterBtns.length) {
    filterBtns[0].classList.add('active');
  }
});