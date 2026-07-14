// Printable receipt / invoice layout used by most document types
import { esc, fmtDate, fmtMoney } from '../utils.js'

function lineTotal(it) {
  const q = parseFloat(it.qty || 1)
  const p = parseFloat(it.price || 0)
  return q * p
}

export function renderReceipt(doc, data, computed) {
  const dogRows = [
    ['Name', data.dogName],
    ['Breed', data.dogBreed],
    ['Date of Birth', fmtDate(data.dogDob)],
    ['Sex', data.dogSex],
    ['Color', data.dogColor],
    ['Reg / ID #', data.dogRegNum],
    data.dogMicrochip ? ['Microchip #', data.dogMicrochip] : null,
  ].filter(Boolean).filter(([, v]) => v)

  return `
    <div class="receipt-wrap">
      <img src="./assets/bdi-logo.png" class="receipt-watermark" alt="" aria-hidden />

      <div class="receipt-header">
        <div class="receipt-header-left">
          <img src="./assets/bdi-logo.png" alt="BDI" class="receipt-logo" />
        </div>
        <div class="receipt-header-right">
          <div class="receipt-biz-name">${esc(data.issuerName) || 'Bulldog Inc.'}</div>
          ${data.issuerTitle ? `<div class="receipt-biz-sub">${esc(data.issuerTitle)}</div>` : ''}
          ${data.issuerAddress ? `<div class="receipt-biz-detail">${esc(data.issuerAddress)}</div>` : ''}
          ${data.issuerCityStateZip ? `<div class="receipt-biz-detail">${esc(data.issuerCityStateZip)}</div>` : ''}
          <div class="receipt-biz-detail">${esc([data.issuerPhone, data.issuerEmail, data.issuerWebsite].filter(Boolean).join('  ·  '))}</div>
          ${data.issuerTaxId ? `<div class="receipt-biz-detail">Tax ID: ${esc(data.issuerTaxId)}</div>` : ''}
        </div>
      </div>

      <div class="receipt-divider gold"></div>

      <div class="receipt-title-row">
        <div>
          <div class="receipt-doc-type">${esc(doc.name.toUpperCase())}</div>
          <div class="receipt-doc-bdi">BULLDOG INC. · BDI</div>
        </div>
        <div class="receipt-meta">
          <div class="receipt-meta-row"><span>Document #</span><strong>${esc(data.docNumber)}</strong></div>
          <div class="receipt-meta-row"><span>Date</span><strong>${esc(fmtDate(data.date))}</strong></div>
          ${doc.dateRange && data.dateEnd ? `<div class="receipt-meta-row"><span>Check-out</span><strong>${esc(fmtDate(data.dateEnd))}</strong></div>` : ''}
          ${doc.isInvoice ? `<div class="receipt-meta-row"><span>Due Date</span><strong>${esc(fmtDate(data.dateEnd))}</strong></div>` : ''}
        </div>
      </div>

      <div class="receipt-divider thin"></div>

      <div class="receipt-parties">
        <div class="receipt-party">
          <div class="receipt-party-label">${doc.isPurchase ? 'ISSUED BY' : 'FROM'}</div>
          <div class="receipt-party-name">${esc(data.issuerName)}</div>
          <div class="receipt-party-detail">${esc(data.issuerAddress)}</div>
          <div class="receipt-party-detail">${esc(data.issuerCityStateZip)}</div>
          <div class="receipt-party-detail">${esc(data.issuerPhone)}</div>
          <div class="receipt-party-detail">${esc(data.issuerEmail)}</div>
        </div>

        <div class="receipt-party-arrow">→</div>

        <div class="receipt-party">
          <div class="receipt-party-label">${esc(doc.recipientLabel || 'TO')}</div>
          <div class="receipt-party-name">${esc(data.recipientName) || '________________________'}</div>
          <div class="receipt-party-detail">${esc(data.recipientAddress)}</div>
          <div class="receipt-party-detail">${esc(data.recipientPhone)}</div>
          <div class="receipt-party-detail">${esc(data.recipientEmail)}</div>
        </div>
      </div>

      ${doc.dogFields && (data.dogName || data.dogBreed) ? `
        <div class="receipt-divider thin"></div>
        <div class="receipt-dog-block">
          <div class="receipt-dog-label">ANIMAL / DOG INFORMATION</div>
          <div class="receipt-dog-grid">
            ${dogRows.map(([k, v]) => `
              <div class="receipt-dog-cell">
                <span class="receipt-dog-key">${esc(k)}</span>
                <span class="receipt-dog-val">${esc(v)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="receipt-divider thin"></div>

      <table class="receipt-items">
        <thead>
          <tr>
            <th class="item-desc">Description</th>
            <th class="item-num">Qty</th>
            <th class="item-num">Unit Price</th>
            <th class="item-num">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(data.items || []).map(it => `
            <tr>
              <td class="item-desc">${esc(it.description) || '—'}</td>
              <td class="item-num">${esc(it.qty) || 1}</td>
              <td class="item-num">${fmtMoney(it.price)}</td>
              <td class="item-num">${fmtMoney(lineTotal(it))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="receipt-totals">
        <div class="receipt-total-row"><span>Subtotal</span><span>${fmtMoney(computed.subtotal)}</span></div>
        ${parseFloat(data.taxRate) > 0 ? `<div class="receipt-total-row"><span>Tax (${esc(data.taxRate)}%)</span><span>${fmtMoney(computed.taxAmt)}</span></div>` : ''}
        ${parseFloat(data.discount) > 0 ? `<div class="receipt-total-row"><span>Discount</span><span>-${fmtMoney(computed.discount)}</span></div>` : ''}
        <div class="receipt-total-row total-final">
          <span>${doc.isDonation ? 'DONATION AMOUNT' : 'TOTAL'}</span>
          <span>${fmtMoney(computed.total)}</span>
        </div>
        <div class="receipt-total-row"><span>Payment Method</span><span>${esc(data.paymentMethod)}</span></div>
      </div>

      ${(data.notes || data.terms) ? `
        <div class="receipt-notes">
          ${data.notes ? `<div><strong>Notes:</strong> ${esc(data.notes)}</div>` : ''}
          ${data.terms ? `<div style="margin-top:4px;"><strong>Terms:</strong> ${esc(data.terms)}</div>` : ''}
          ${doc.isDonation ? `<div style="margin-top:6px;font-style:italic;font-size:0.68rem;">Bulldog Inc. is organized under applicable law. No goods or services were provided in exchange for this donation. This receipt serves as your official acknowledgment.</div>` : ''}
        </div>
      ` : ''}

      <div class="receipt-divider thin"></div>

      <div class="receipt-footer">
        <div class="receipt-sig-block">
          <div class="receipt-sig-line"></div>
          <div class="receipt-sig-name">${esc(data.signatureName)}</div>
          <div class="receipt-sig-title">${esc(data.signatureTitle)}</div>
        </div>
        <div class="receipt-stamp-block">
          <img src="./assets/bdi-logo.png" alt="BDI" class="receipt-stamp" />
          <div class="receipt-stamp-text">BDI · QUALITY ASSURED</div>
        </div>
      </div>

      <div class="receipt-fine-print">
        Thank you for your business. · Bulldog Inc. (BDI) · ${esc(data.issuerEmail)}
      </div>
    </div>
  `
}
