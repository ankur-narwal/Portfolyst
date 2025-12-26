// reference.js
(function() {
  const container = document.getElementById('portfolio-detail');

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (typeof portfolios === 'undefined') {
    container.innerHTML = "<h1>Error: Database not loaded.</h1>";
    return;
  }

  const person = portfolios.find(p => p.id === id);

  if (!person) {
    container.innerHTML = `
      <div style="text-align:center; padding: 50px;">
        <h1>404</h1>
        <p>Portfolio not found.</p>
        <a href="index.html" class="submit-btn">Go Back</a>
      </div>
    `;
    return;
  }

  const projectsHtml = person.projects.length 
    ? person.projects.map(proj => `
        <div class="project-card">
          <h4>${proj.title}</h4>
          <p>${proj.desc}</p>
          <a href="${proj.link}" target="_blank">View Project &rarr;</a>
        </div>
      `).join('')
    : `<p style="color:var(--muted)">No specific case studies listed yet.</p>`;

  // 6. Inject HTML (FINAL LAYOUT: Row 1 = Visit/Contact, Row 2 = Share)
  container.innerHTML = `
    <div class="portfolio-detail-inner">
      
      <div class="portfolio-hero">
        <div class="big-thumb" style="background-image:url('${person.image}')"></div>
        
        <div class="portfolio-meta">
          <h1 class="portfolio-title">${person.name}</h1>
          <p class="meta-row" style="font-size: 1.2rem; color: var(--accent);">${person.title}</p>
          <p class="description">${person.description}</p>
          
          <div style="margin-top: 24px; width: fit-content;">
            
            <div class="meta-actions" style="display: flex; gap: 10px;">
              <a href="${person.socials.site}" target="_blank" class="submit-btn" style="white-space: nowrap;">
                Visit Live Site
              </a>

              ${person.socials.email ? `
                <a href="mailto:${person.socials.email}" class="filter-btn" style="border: 1px solid var(--border); white-space: nowrap;">
                  Contact
                </a>` : ''}
            </div>

            <button id="shareBtn" class="filter-btn" style="margin-top: 10px; width: 100%; border: 1px dashed var(--border); display: flex; justify-content: center; align-items: center; gap: 6px;">
              🔗 Share
            </button>

          </div>
        </div>
      </div>

      <hr style="margin: 40px 0; border: 0; border-top: 1px solid var(--border);">

      <h3>Featured Projects</h3>
      <div class="projects-grid">
        ${projectsHtml}
      </div>

    </div>
  `;

  // 7. Share Logic
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          const originalText = shareBtn.innerHTML;
          shareBtn.innerHTML = "✅ Copied!";
          shareBtn.style.borderColor = "var(--accent)";
          shareBtn.style.color = "var(--accent)";
          
          setTimeout(() => {
            shareBtn.innerHTML = originalText;
            shareBtn.style.borderColor = "var(--border)";
            shareBtn.style.color = "var(--muted)";
          }, 2000);
        });
    });
  }

})();