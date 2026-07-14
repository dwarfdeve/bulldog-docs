// Pedigree certificate layout (replaces components/Certificate.jsx + layouts/CertLayout.jsx)
import { esc, fmtDate } from '../utils.js'

function pedCell(label, name, reg, color, extraStyle = '') {
  const info = [reg, color].filter(Boolean).join(' · ')
  return `
    <div class="ped-cell" style="${extraStyle}">
      ${label ? `<span class="ped-cell-label">${esc(label)}</span>` : ''}
      <span class="ped-cell-name">${esc(name) || '—'}</span>
      ${info ? `<span class="ped-cell-info">${esc(info)}</span>` : ''}
    </div>
  `
}

const colLabelStyle = 'text-align:center;padding:4px 0 6px;border-bottom:1px solid rgba(139,105,20,0.3);font-family:Cinzel,serif;font-size:0.55rem;letter-spacing:2px;color:#8b6914;'

export function renderCertificate(data) {
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const sire = data.sire || { name: '', reg: '', color: '' }
  const dam = data.dam || { name: '', reg: '', color: '' }

  const infoRows = [
    ['BDI Reg #', data.regNumber],
    ['Breed', data.breed],
    ['Sex', data.sex],
    ['Color', data.color],
    ['Date Whelped', fmtDate(data.dob)],
    ['Breeder', data.breeder],
    ['Owner', data.owner],
    ['Certificate #', data.certNumber],
  ]

  const ggp = [
    [data.ssss, 'SS/Sire'], [data.sssd, 'SS/Dam'],
    [data.ssds, 'SD/Sire'], [data.ssdd, 'SD/Dam'],
    [data.sdss, 'DS/Sire'], [data.sdsd, 'DS/Dam'],
    [data.sdds, 'DD/Sire'], [data.sddd, 'DD/Dam'],
  ]

  const gen4 = [
    data.g4ss1, data.g4ss2, data.g4ss3, data.g4ss4,
    data.g4ss5, data.g4ss6, data.g4ss7, data.g4ss8,
    data.g4ds1, data.g4ds2, data.g4ds3, data.g4ds4,
    data.g4ds5, data.g4ds6, data.g4ds7, data.g4ds8,
  ]

  return `
    <div class="cert-wrap">
      <img src="./assets/bdi-logo.png" class="cert-stamp" alt="" aria-hidden="true" />
      <div class="cert-border-inner"></div>
      <div class="cert-body">
        <div class="cert-header">
          <div class="cert-company-name">BULLDOG INC. · REGISTERING OFFICES</div>
          <div class="cert-founded">ESTABLISHED · QUALITY ASSURED BY BDI</div>
        </div>

        <div class="cert-title-block">
          <div class="cert-title">${esc(data.certType)}</div>
          <div class="cert-subtitle">OFFICIAL DOCUMENT — BULLDOG INC. (BDI)</div>
        </div>

        <div class="cert-divider"></div>
        <div class="cert-divider-thin"></div>

        <div class="cert-dog-name">${esc(data.dogName) || 'DOG REGISTERED NAME'}</div>

        <div class="cert-dog-info">
          ${infoRows.map(([label, val]) => `
            <div class="cert-dog-info-row">
              <span class="cert-dog-info-label">${esc(label)}:</span>
              <span class="cert-dog-info-value">${esc(val) || '—'}</span>
            </div>
          `).join('')}
        </div>

        <div class="cert-divider"></div>

        <div style="display:flex;gap:0;border:1px solid rgba(139,105,20,0.4);margin-top:8px;">
          <div style="display:flex;flex-direction:column;width:130px;border-right:1px solid rgba(139,105,20,0.4);">
            <div class="ped-cell-label" style="${colLabelStyle}">Parents</div>
            <div style="flex:1;display:flex;flex-direction:column;border-bottom:1px solid rgba(139,105,20,0.4);">
              ${pedCell('Sire', sire.name, sire.reg, sire.color, 'flex:1;background:rgba(196,30,30,0.03);')}
            </div>
            <div style="flex:1;display:flex;flex-direction:column;">
              ${pedCell('Dam', dam.name, dam.reg, dam.color, 'flex:1;')}
            </div>
          </div>

          <div style="display:flex;flex-direction:column;width:160px;border-right:1px solid rgba(139,105,20,0.4);">
            <div class="ped-cell-label" style="${colLabelStyle}">Grandparents</div>
            ${pedCell("Sire's Sire", data.siresSire?.name, data.siresSire?.reg, data.siresSire?.color, 'flex:1;')}
            ${pedCell("Sire's Dam", data.siresDam?.name, data.siresDam?.reg, data.siresDam?.color, 'flex:1;')}
            ${pedCell("Dam's Sire", data.damsSire?.name, data.damsSire?.reg, data.damsSire?.color, 'flex:1;')}
            ${pedCell("Dam's Dam", data.damsDam?.name, data.damsDam?.reg, data.damsDam?.color, 'flex:1;')}
          </div>

          <div style="display:flex;flex-direction:column;width:210px;border-right:1px solid rgba(139,105,20,0.4);">
            <div class="ped-cell-label" style="${colLabelStyle}">Great-Grandparents</div>
            ${ggp.map(([dog, lbl]) => pedCell(lbl, dog?.name, dog?.reg, '', 'flex:1;')).join('')}
          </div>

          <div style="display:flex;flex-direction:column;flex:1;">
            <div class="ped-cell-label" style="${colLabelStyle}">4th Generation</div>
            ${gen4.map(name => `
              <div class="ped-cell" style="flex:1;padding:3px 6px;">
                <span class="ped-cell-name" style="font-size:0.62rem;">${esc(name) || '—'}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="cert-divider-thin" style="margin-top:14px;"></div>

        <div class="cert-footer">
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <img src="./assets/bdi-logo.png" class="cert-footer-stamp" alt="BDI Seal" />
            <span style="font-family:Cinzel,serif;font-size:0.58rem;letter-spacing:2px;color:#8b6914;">BDI · QUALITY STAMP</span>
          </div>

          <div class="cert-footer-center">
            <p class="cert-footer-seal-text">
              The seal of Bulldog Inc. (BDI) affixed hereto certifies that this pedigree was compiled
              from official Stud Book records and is accurate to the best of our knowledge.
              Issued: ${esc(today)}
            </p>
            <div class="cert-sig-line">${esc(data.breeder) || 'Authorized Representative'}</div>
            <div class="cert-sig-role">Executive Director — Bulldog Inc.</div>
          </div>

          <div class="cert-reg-block">
            <span class="bdi-label">BDI</span>
            <span>${esc(data.certType)}</span>
            <br />
            ${data.certNumber ? `<span style="font-weight:600;">${esc(data.certNumber)}</span>` : ''}
            <br />
            <span style="font-family:Cinzel,serif;font-size:0.6rem;letter-spacing:1px;color:#8b6914;">BULLDOG INC.™</span>
          </div>
        </div>
      </div>
    </div>
  `
}

// ── AKC-style "Certified Pedigree" (blue-bordered, US format) ──────────────
export function renderCertificateAKC(data) {
  const sire = data.sire || { name: '', reg: '', color: '' }
  const dam = data.dam || { name: '', reg: '', color: '' }
  const ggp = [
    [data.ssss, 'SS/Sire'], [data.sssd, 'SS/Dam'],
    [data.ssds, 'SD/Sire'], [data.ssdd, 'SD/Dam'],
    [data.sdss, 'DS/Sire'], [data.sdsd, 'DS/Dam'],
    [data.sdds, 'DD/Sire'], [data.sddd, 'DD/Dam'],
  ]
  const gen4 = [
    data.g4ss1, data.g4ss2, data.g4ss3, data.g4ss4,
    data.g4ss5, data.g4ss6, data.g4ss7, data.g4ss8,
    data.g4ds1, data.g4ds2, data.g4ds3, data.g4ds4,
    data.g4ds5, data.g4ds6, data.g4ds7, data.g4ds8,
  ]

  return `
    <div class="akc-wrap">
      <div class="akc-border-inner"></div>
      <div class="akc-body">
        <div class="akc-header">
          <div class="akc-badge">
            <img src="./assets/bdi-logo.png" alt="BDI" />
            <span>BULLDOG INC.<br />FOUNDED 2020</span>
          </div>
          <div class="akc-header-text">
            <div class="akc-org">BULLDOG INC. · REGISTRY DIVISION</div>
            <div class="akc-title">Certified Pedigree</div>
          </div>
        </div>

        <div class="akc-divider"></div>

        <div class="akc-grid">
          <div class="akc-info-col">
            <div class="akc-dog-name">${esc(data.dogName) || 'SAMPLE DOG NAME'}</div>
            <div class="akc-info-row">${esc(data.regNumber) || 'BDI00000000'} &nbsp; ${esc(data.color)}</div>
            <div class="akc-info-row akc-breed">${esc(data.breed).toUpperCase() || 'FRENCH BULLDOG'} &nbsp; ${esc(data.sex).toUpperCase()}</div>
            <div class="akc-info-row">Date Whelped: ${esc(fmtDate(data.dob))}</div>
            <div class="akc-info-row">Breeder: ${esc(data.breeder) || '—'}</div>
            <div class="akc-info-row">Owner: ${esc(data.owner) || '—'}</div>
            <div class="akc-info-row">Certificate #: ${esc(data.certNumber) || '—'}</div>

            <div class="akc-parent-block">
              <span class="akc-parent-label">Sire</span>
              <span class="akc-parent-name">${esc(sire.name) || '—'}</span>
              <span class="akc-parent-info">${esc([sire.reg, sire.color].filter(Boolean).join(' · '))}</span>
            </div>
            <div class="akc-parent-block">
              <span class="akc-parent-label">Dam</span>
              <span class="akc-parent-name">${esc(dam.name) || '—'}</span>
              <span class="akc-parent-info">${esc([dam.reg, dam.color].filter(Boolean).join(' · '))}</span>
            </div>

            <div class="akc-seal">
              <div class="akc-seal-circle">BDI</div>
              <div class="akc-sig">${esc(data.breeder) || 'Authorized Signatory'}</div>
              <div class="akc-sig-role">Executive Secretary — Bulldog Inc.</div>
            </div>
          </div>

          <div class="akc-tree-col">
            <div class="akc-tree-grandparents">
              <div class="akc-tree-label">Grandparents</div>
              ${pedCell("Sire's Sire", data.siresSire?.name, data.siresSire?.reg, '', 'flex:1;')}
              ${pedCell("Sire's Dam", data.siresDam?.name, data.siresDam?.reg, '', 'flex:1;')}
              ${pedCell("Dam's Sire", data.damsSire?.name, data.damsSire?.reg, '', 'flex:1;')}
              ${pedCell("Dam's Dam", data.damsDam?.name, data.damsDam?.reg, '', 'flex:1;')}
            </div>
            <div class="akc-tree-greatgp">
              <div class="akc-tree-label">Great-Grandparents</div>
              ${ggp.map(([dog, lbl]) => pedCell(lbl, dog?.name, dog?.reg, '', 'flex:1;')).join('')}
            </div>
            <div class="akc-tree-gen4">
              <div class="akc-tree-label">4th Generation</div>
              ${gen4.map(name => `<div class="ped-cell" style="flex:1;padding:2px 6px;"><span class="ped-cell-name" style="font-size:0.58rem;">${esc(name) || '—'}</span></div>`).join('')}
            </div>
          </div>
        </div>

        <div class="akc-divider"></div>
        <div class="akc-footnote">
          The seal of Bulldog Inc. affixed hereto certifies that this pedigree was compiled from official Stud Book records on ${esc(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))}.
        </div>
      </div>
    </div>
  `
}

// ── UKC-style "Heritage Pedigree" (black-framed, gold ornate, UK/int'l format) ──
export function renderCertificateUKC(data) {
  const sire = data.sire || { name: '', reg: '', color: '' }
  const dam = data.dam || { name: '', reg: '', color: '' }
  const ggp = [
    [data.ssss, 'SS Sire'], [data.sssd, 'SS Dam'],
    [data.ssds, 'SD Sire'], [data.ssdd, 'SD Dam'],
    [data.sdss, 'DS Sire'], [data.sdsd, 'DS Dam'],
    [data.sdds, 'DD Sire'], [data.sddd, 'DD Dam'],
  ]

  return `
    <div class="ukc-outer-frame">
      <div class="ukc-wrap">
        <img src="./assets/bdi-logo.png" class="ukc-watermark" alt="" aria-hidden="true" />
        <div class="ukc-corner tl"></div>
        <div class="ukc-corner tr"></div>
        <div class="ukc-corner bl"></div>
        <div class="ukc-corner br"></div>

        <div class="ukc-topline">
          <span>DOG BDI${esc(data.regNumber || '00000000')}</span>
          <span>DOG BDI${esc(data.regNumber || '00000000')}</span>
        </div>

        <div class="ukc-banner">
          <div class="ukc-banner-inner">Bulldog Inc. Registering Offices</div>
        </div>
        <div class="ukc-est">1998 · 2026</div>

        <div class="ukc-title">Heritage Pedigree</div>
        <div class="ukc-dogname">${esc(data.dogName).toUpperCase() || 'SAMPLE PUPPY NAME'}</div>

        <div class="ukc-seal">
          <div class="ukc-seal-ring">
            <span>B</span><span>D</span><span>I</span>
          </div>
        </div>

        <div class="ukc-meta">
          <div><span class="ukc-meta-label">BDI Registration #:</span> ${esc(data.regNumber) || '—'}</div>
          <div><span class="ukc-meta-label">Birthdate:</span> ${esc(fmtDate(data.dob))}</div>
          <div><span class="ukc-meta-label">Breed:</span> ${esc(data.breed) || 'French Bulldog'}</div>
          <div><span class="ukc-meta-label">Sex:</span> ${esc(data.sex)}</div>
          <div><span class="ukc-meta-label">Color:</span> ${esc(data.color) || '—'}</div>
        </div>

        <div class="ukc-parents">
          <div class="ukc-parent-row">
            <span class="ukc-parent-label">Sire:</span>
            <span class="ukc-parent-name">${esc(sire.name).toUpperCase() || '—'}</span>
          </div>
          <div class="ukc-arrow-row">
            <span class="ukc-arrow-label">Sire's BDI Reg #: ${esc(sire.reg) || '—'}</span>
            <span class="ukc-arrow">→</span>
          </div>
          <div class="ukc-parent-row">
            <span class="ukc-parent-label">Dam:</span>
            <span class="ukc-parent-name">${esc(dam.name).toUpperCase() || '—'}</span>
          </div>
          <div class="ukc-arrow-row">
            <span class="ukc-arrow-label">Dam's BDI Reg #: ${esc(dam.reg) || '—'}</span>
          </div>
        </div>

        <div class="ukc-tree">
          <div class="ukc-tree-col">
            <div class="ukc-tree-head">Grandparents</div>
            ${pedCell(null, data.siresSire?.name, data.siresSire?.reg, '', 'flex:1;')}
            ${pedCell(null, data.siresDam?.name, data.siresDam?.reg, '', 'flex:1;')}
            ${pedCell(null, data.damsSire?.name, data.damsSire?.reg, '', 'flex:1;')}
            ${pedCell(null, data.damsDam?.name, data.damsDam?.reg, '', 'flex:1;')}
          </div>
          <div class="ukc-tree-col">
            <div class="ukc-tree-head">Great-Grandparents</div>
            ${ggp.map(([dog]) => pedCell(null, dog?.name, dog?.reg, '', 'flex:1;')).join('')}
          </div>
        </div>

        <div class="ukc-footer">
          <span>Cert #: ${esc(data.certNumber) || '—'}</span>
          <span>Sex: ${esc(data.sex)}</span>
          <span>Breeder: ${esc(data.breeder) || '—'}</span>
        </div>

        <div class="ukc-guarantee">
          BDI is a community for people and dogs to pursue excellence together. Founded in 1998, BDI has been dedicated
          to enhancing the lives of Dogs That Do More™, and their owners, by providing essential resources to help
          owners and breeders make informed decisions. Whenever your dog returns to and features in the many family-
          friendly BDI sports and programs.
        </div>
      </div>
    </div>
  `
}

// Maps flat DocumentPage data state to the shape renderCertificate expects
export function mapCertData(data) {
  return {
    certType: data.certType || 'Heritage Pedigree',
    certNumber: data.certNumber || data.docNumber,
    dogName: data.dogName2 || '',
    regNumber: data.regNumber || '',
    breed: data.breed || 'French Bulldog',
    sex: data.sex || 'Male',
    color: data.color || '',
    dob: data.dob || '',
    breeder: data.breeder || data.signatureName || '',
    owner: data.owner || '',
    sire: data.sire || { name: '', reg: '', color: '' },
    dam: data.dam || { name: '', reg: '', color: '' },
    siresSire: data.siresSire || { name: '', reg: '', color: '' },
    siresDam: data.siresDam || { name: '', reg: '', color: '' },
    damsSire: data.damsSire || { name: '', reg: '', color: '' },
    damsDam: data.damsDam || { name: '', reg: '', color: '' },
    ssss: data.ssss || { name: '', reg: '' }, sssd: data.sssd || { name: '', reg: '' },
    ssds: data.ssds || { name: '', reg: '' }, ssdd: data.ssdd || { name: '', reg: '' },
    sdss: data.sdss || { name: '', reg: '' }, sdsd: data.sdsd || { name: '', reg: '' },
    sdds: data.sdds || { name: '', reg: '' }, sddd: data.sddd || { name: '', reg: '' },
    g4ss1: data.g4ss1 || '', g4ss2: data.g4ss2 || '', g4ss3: data.g4ss3 || '', g4ss4: data.g4ss4 || '',
    g4ss5: data.g4ss5 || '', g4ss6: data.g4ss6 || '', g4ss7: data.g4ss7 || '', g4ss8: data.g4ss8 || '',
    g4ds1: data.g4ds1 || '', g4ds2: data.g4ds2 || '', g4ds3: data.g4ds3 || '', g4ds4: data.g4ds4 || '',
    g4ds5: data.g4ds5 || '', g4ds6: data.g4ds6 || '', g4ds7: data.g4ds7 || '', g4ds8: data.g4ds8 || '',
  }
}
