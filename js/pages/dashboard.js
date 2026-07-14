// Dashboard page — grid of document types by category
import { esc } from '../utils.js'
import { DOCS, CATEGORIES, getDocsByCategory } from '../registry.js'

export function renderDashboard(root, { profile, onSelectDoc, onEditProfile }) {
  const byCategory = getDocsByCategory()

  root.innerHTML = `
    <div class="dash-shell">
      <header class="dash-header">
        <div class="dash-brand">
          <img src="./assets/bdi-logo.png" alt="BDI" class="dash-logo" />
          <div>
            <div class="dash-title">BULLDOG INC.</div>
            <div class="dash-sub">Document Generator</div>
          </div>
        </div>
        <div class="dash-profile-pill">
          <span class="dash-profile-name">${esc(profile.businessName)}</span>
          <span class="dash-profile-addr">${esc(profile.city)}, ${esc(profile.state)}</span>
          <button class="btn-ghost" id="edit-profile-btn">Edit Profile</button>
        </div>
      </header>

      <div class="dash-stats">
        <div class="dash-stat"><span class="dash-stat-n">${DOCS.length}</span><span>Document Types</span></div>
        <div class="dash-stat"><span class="dash-stat-n">${CATEGORIES.length}</span><span>Categories</span></div>
        <div class="dash-stat"><span class="dash-stat-n">∞</span><span>Documents</span></div>
        <div class="dash-stat"><span class="dash-stat-n">PDF</span><span>Print Ready</span></div>
      </div>

      <div class="dash-body">
        ${CATEGORIES.map(cat => {
          const docs = byCategory[cat]
          if (!docs?.length) return ''
          return `
            <div class="dash-category">
              <h2 class="dash-cat-label">${esc(cat)}</h2>
              <div class="dash-grid">
                ${docs.map(doc => `
                  <button class="dash-card" data-doc-id="${esc(doc.id)}" style="--card-color:${doc.color}">
                    <span class="dash-card-icon">${doc.icon}</span>
                    <span class="dash-card-name">${esc(doc.name)}</span>
                    <span class="dash-card-desc">${esc(doc.description)}</span>
                    <span class="dash-card-arrow">→</span>
                  </button>
                `).join('')}
              </div>
            </div>
          `
        }).join('')}
      </div>

      <footer class="dash-footer">
        <span>Bulldog Inc. (BDI) · All documents print as PDF via browser print dialog</span>
        <a class="gh-badge" href="https://github.com/dwarfdeve/bulldog-docs" target="_blank" rel="noreferrer">📁 GitHub Repo</a>
      </footer>
    </div>
  `

  root.querySelector('#edit-profile-btn').addEventListener('click', onEditProfile)
  root.querySelectorAll('.dash-card').forEach(btn => {
    btn.addEventListener('click', () => onSelectDoc(btn.dataset.docId))
  })
}
