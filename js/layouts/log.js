// Table-based log layout: Food Consumption Log, Feed/Supplement Log, Vaccination Record
import { esc, fmtDate } from '../utils.js'

export function renderLog(doc, data) {
  const cols = doc.logColumns || ['Subject', 'Col 1', 'Col 2', 'Col 3', 'Notes']
  const widths = doc.logColumnWidths || ['20%', '20%', '20%', '20%', '20%']
  const entries = (data.logEntries || []).filter(r => r.c0 || r.c1 || r.c2 || r.c3 || r.c4)

  const bodyRows = entries.length > 0
    ? entries.map((row, i) => `
      <tr>
        <td class="log-num">${i + 1}</td>
        <td>${esc(row.c0)}</td>
        <td>${esc(row.c1)}</td>
        <td>${esc(row.c2)}</td>
        <td>${esc(row.c3)}</td>
        <td>${esc(row.c4)}</td>
      </tr>
    `).join('')
    : Array(8).fill(null).map((_, i) => `
      <tr class="log-empty-row">
        <td class="log-num">${i + 1}</td>
        <td></td><td></td><td></td><td></td><td></td>
      </tr>
    `).join('')

  return `
    <div class="log-wrap">
      <img src="./assets/bdi-logo.png" class="receipt-watermark" alt="" aria-hidden />

      <div class="log-header">
        <div class="log-header-left">
          <img src="./assets/bdi-logo.png" alt="BDI" class="log-logo" />
        </div>
        <div class="log-header-center">
          <div class="log-biz-name">${esc(data.issuerName) || 'Bulldog Inc.'}</div>
          <div class="log-doc-type">${esc(doc.name.toUpperCase())}</div>
          <div class="log-bdi-tag">BULLDOG INC. · BDI · OFFICIAL RECORD</div>
        </div>
        <div class="log-header-right">
          <div class="log-meta">
            <div class="log-meta-row"><span>Record #</span><strong>${esc(data.docNumber)}</strong></div>
            <div class="log-meta-row"><span>Date</span><strong>${esc(fmtDate(data.logDate || data.date))}</strong></div>
            <div class="log-meta-row"><span>Period</span><strong>${esc(data.logPeriod || 'Daily')}</strong></div>
          </div>
        </div>
      </div>

      <div class="receipt-divider gold"></div>

      <div class="log-keeper">
        <div class="log-keeper-item">
          <span class="log-keeper-label">Facility / Kennel</span>
          <span class="log-keeper-val">${esc(data.issuerName)}</span>
        </div>
        <div class="log-keeper-item">
          <span class="log-keeper-label">Keeper / Handler</span>
          <span class="log-keeper-val">${esc(data.signatureName) || '—'}</span>
        </div>
        <div class="log-keeper-item">
          <span class="log-keeper-label">Address</span>
          <span class="log-keeper-val">${esc([data.issuerAddress, data.issuerCityStateZip].filter(Boolean).join(', '))}</span>
        </div>
        <div class="log-keeper-item">
          <span class="log-keeper-label">Contact</span>
          <span class="log-keeper-val">${esc([data.issuerPhone, data.issuerEmail].filter(Boolean).join('  ·  '))}</span>
        </div>
      </div>

      <div class="receipt-divider thin"></div>

      <div class="log-table-title">${esc(doc.name)} — ${esc(fmtDate(data.logDate || data.date))}</div>
      <table class="log-table">
        <thead>
          <tr>
            <th style="width:5%">#</th>
            ${cols.map((c, i) => `<th style="width:${widths[i] || 'auto'}">${esc(c)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>

      <div class="log-notes">
        <strong>Notes / Observations:</strong>
        <div class="log-notes-box">${esc(data.notes)}</div>
      </div>

      <div class="receipt-divider thin"></div>

      <div class="receipt-footer">
        <div class="receipt-sig-block">
          <div class="receipt-sig-line"></div>
          <div class="receipt-sig-name">${esc(data.signatureName)}</div>
          <div class="receipt-sig-title">${esc(data.signatureTitle) || 'Handler / Keeper'}</div>
        </div>
        <div class="receipt-stamp-block">
          <img src="./assets/bdi-logo.png" alt="BDI" class="receipt-stamp" />
          <div class="receipt-stamp-text">BDI · QUALITY ASSURED</div>
        </div>
      </div>

      <div class="receipt-fine-print">
        This is an official Bulldog Inc. (BDI) record. · ${esc(data.issuerEmail)}
      </div>
    </div>
  `
}
