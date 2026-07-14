import { useProfile } from '../context/ProfileContext'
import { DOCS, CATEGORIES, getDocsByCategory } from '../documents/registry'

export default function Dashboard({ onSelectDoc, onEditProfile }) {
  const { profile } = useProfile()
  const byCategory = getDocsByCategory()

  return (
    <div className="dash-shell">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-brand">
          <img src="./bdi-logo.jpeg" alt="BDI" className="dash-logo" />
          <div>
            <div className="dash-title">BULLDOG INC.</div>
            <div className="dash-sub">Document Generator</div>
          </div>
        </div>
        <div className="dash-profile-pill">
          <span className="dash-profile-name">{profile.businessName}</span>
          <span className="dash-profile-addr">{profile.city}, {profile.state}</span>
          <button className="btn-ghost" onClick={onEditProfile}>Edit Profile</button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="dash-stats">
        <div className="dash-stat"><span className="dash-stat-n">{DOCS.length}</span><span>Document Types</span></div>
        <div className="dash-stat"><span className="dash-stat-n">{CATEGORIES.length}</span><span>Categories</span></div>
        <div className="dash-stat"><span className="dash-stat-n">∞</span><span>Documents</span></div>
        <div className="dash-stat"><span className="dash-stat-n">PDF</span><span>Print Ready</span></div>
      </div>

      {/* Document grid by category */}
      <div className="dash-body">
        {CATEGORIES.map(cat => {
          const docs = byCategory[cat]
          if (!docs?.length) return null
          return (
            <div key={cat} className="dash-category">
              <h2 className="dash-cat-label">{cat}</h2>
              <div className="dash-grid">
                {docs.map(doc => (
                  <button
                    key={doc.id}
                    className="dash-card"
                    onClick={() => onSelectDoc(doc.id)}
                    style={{ '--card-color': doc.color }}
                  >
                    <span className="dash-card-icon">{doc.icon}</span>
                    <span className="dash-card-name">{doc.name}</span>
                    <span className="dash-card-desc">{doc.description}</span>
                    <span className="dash-card-arrow">→</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <footer className="dash-footer">
        <span>Bulldog Inc. (BDI) · All documents print as PDF via browser print dialog</span>
        <a className="gh-badge" href="https://github.com/dwarfdeve/bulldog-docs" target="_blank" rel="noreferrer">
          📁 GitHub Repo
        </a>
      </footer>
    </div>
  )
}
