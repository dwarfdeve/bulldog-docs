// Document page — split form (left) + live printable preview (right)
import { esc } from '../utils.js'
import { getDoc, buildInitialState } from '../registry.js'
import { renderReceipt } from '../layouts/receipt.js'
import { renderLog } from '../layouts/log.js'
import { renderCertificate, renderCertificateAKC, renderCertificateUKC, mapCertData } from '../layouts/certificate.js'

export function renderDocumentPage(root, { docId, profile, onBack }) {
  const doc = getDoc(docId)
  let data = buildInitialState(doc, profile)

  function computeTotals() {
    const subtotal = (data.items || []).reduce((s, it) => s + (parseFloat(it.qty || 1) * parseFloat(it.price || 0)), 0)
    const taxAmt = subtotal * (parseFloat(data.taxRate || 0) / 100)
    const discount = parseFloat(data.discount || 0)
    const total = subtotal + taxAmt - discount
    return { subtotal, taxAmt, discount, total }
  }

  function render() {
    root.innerHTML = `
      <div class="docpage-shell">
        <div class="docpage-topbar">
          <button class="btn-ghost" id="doc-back">← Dashboard</button>
          <div class="docpage-doctitle">
            <span class="docpage-icon">${doc.icon}</span>
            <span>${esc(doc.name)}</span>
          </div>
          <button class="btn btn-primary docpage-print" id="doc-print">🖨 Print / Save PDF</button>
        </div>

        <div class="docpage-split">
          <aside class="docpage-form" id="no-print"></aside>
          <main class="docpage-preview" id="print-area"></main>
        </div>
      </div>
    `

    root.querySelector('#doc-back').addEventListener('click', onBack)
    root.querySelector('#doc-print').addEventListener('click', () => window.print())

    renderForm()
    renderPreview()
  }

  function renderPreview() {
    const preview = root.querySelector('#print-area')
    if (doc.layout === 'receipt') {
      preview.innerHTML = renderReceipt(doc, data, computeTotals())
    } else if (doc.layout === 'log') {
      preview.innerHTML = renderLog(doc, data)
    } else if (doc.layout === 'cert') {
      const certData = mapCertData(data)
      if (certData.certType === 'Certified Pedigree') {
        preview.innerHTML = renderCertificateAKC(certData)
      } else if (certData.certType === 'Heritage Pedigree') {
        preview.innerHTML = renderCertificateUKC(certData)
      } else {
        preview.innerHTML = renderCertificate(certData)
      }
    }
  }

  function refreshPreviewOnly() {
    renderPreview()
    updateTotalsPreview()
  }

  function updateTotalsPreview() {
    const box = root.querySelector('#totals-preview-box')
    if (!box) return
    const computed = computeTotals()
    box.innerHTML = totalsPreviewHtml(computed)
  }

  function totalsPreviewHtml(computed) {
    return `
      <div>Subtotal: <strong>$${computed.subtotal.toFixed(2)}</strong></div>
      ${parseFloat(data.taxRate) > 0 ? `<div>Tax: <strong>$${computed.taxAmt.toFixed(2)}</strong></div>` : ''}
      ${parseFloat(data.discount) > 0 ? `<div>Discount: <strong>-$${computed.discount.toFixed(2)}</strong></div>` : ''}
      <div class="total-line">TOTAL: <strong>$${computed.total.toFixed(2)}</strong></div>
    `
  }

  // ── Form field helpers ────────────────────────────────────────────
  function section(title, innerHtml) {
    return `<div class="form-section"><div class="form-section-title">${esc(title)}</div>${innerHtml}</div>`
  }
  function row(innerHtml) {
    return `<div class="form-row">${innerHtml}</div>`
  }
  function textField(label, key, opts = {}) {
    const { placeholder = '', type = 'text' } = opts
    return `
      <div class="form-field">
        <label class="form-label">${esc(label)}</label>
        <input class="q-input" type="${type}" data-field="${key}" value="${esc(data[key])}" placeholder="${esc(placeholder)}" />
      </div>
    `
  }
  function nestedField(label, key1, key2, opts = {}) {
    const val = (data[key1] || {})[key2] || ''
    return `
      <div class="form-field">
        <label class="form-label">${esc(label)}</label>
        <input class="q-input" data-nested="${key1}.${key2}" value="${esc(val)}" />
      </div>
    `
  }
  function selectField(label, key, options) {
    return `
      <div class="form-field">
        <label class="form-label">${esc(label)}</label>
        <select class="q-input" data-field="${key}">
          ${options.map(o => `<option ${data[key] === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}
        </select>
      </div>
    `
  }
  function textareaField(label, key, opts = {}) {
    const { placeholder = '' } = opts
    return `
      <div class="form-field">
        <label class="form-label">${esc(label)}</label>
        <textarea class="q-input form-textarea" rows="3" data-field="${key}" placeholder="${esc(placeholder)}">${esc(data[key])}</textarea>
      </div>
    `
  }

  function renderForm() {
    const form = root.querySelector('#no-print')
    if (doc.layout === 'cert') {
      form.innerHTML = certFormHtml()
    } else {
      form.innerHTML = mainFormHtml()
    }
    bindFormEvents(form)
  }

  function mainFormHtml() {
    const payMethods = profile.paymentMethods?.length ? profile.paymentMethods : ['Cash', 'Zelle', 'Venmo', 'PayPal', 'Credit Card', 'Gift Card', 'Cryptocurrency']

    return `
      <div class="form-sections">
        ${section('Document', `
          ${row(textField('Document #', 'docNumber') + textField('Date', 'date', { type: 'date' }))}
          ${doc.dateRange ? row(textField('Check-in', 'date', { type: 'date' }) + textField('Check-out', 'dateEnd', { type: 'date' })) : ''}
        `)}

        ${section('Your Info (pre-filled)', `
          ${textField('Business Name', 'issuerName')}
          ${row(textField('Phone', 'issuerPhone') + textField('Email', 'issuerEmail'))}
          ${textField('Address', 'issuerAddress')}
          ${textField('City, State ZIP', 'issuerCityStateZip')}
          ${data.issuerTaxId ? textField('Tax ID', 'issuerTaxId') : ''}
        `)}

        ${section(doc.recipientLabel || 'OTHER PARTY', `
          ${textField('Name / Company', 'recipientName', { placeholder: 'Customer or Vendor name' })}
          ${textField('Address', 'recipientAddress', { placeholder: 'Street, City, State' })}
          ${row(textField('Phone', 'recipientPhone') + textField('Email', 'recipientEmail'))}
        `)}

        ${doc.dogFields ? section('Dog / Animal Info', `
          ${row(textField('Dog Name', 'dogName', { placeholder: 'Registered name' }) + textField('Breed', 'dogBreed', { placeholder: 'French Bulldog' }))}
          ${row(textField('Date of Birth', 'dogDob', { type: 'date' }) + selectField('Sex', 'dogSex', ['Male', 'Female']))}
          ${row(textField('Color / Markings', 'dogColor', { placeholder: 'Fawn / Blue / Merle' }) + textField('Reg / ID #', 'dogRegNum', { placeholder: 'BDI-000001' }))}
          ${(doc.id === 'puppy-sale' || doc.id === 'breeding-service' || doc.id === 'shipping-manifest') ? textField('Microchip #', 'dogMicrochip') : ''}
        `) : ''}

        ${doc.layout === 'receipt' ? section('Line Items', `
          ${profile.commonItems?.length ? `
            <div class="quick-add">
              <span class="quick-add-label">Quick add:</span>
              ${profile.commonItems.map((it, i) => `<button class="quick-chip" data-quick-add="${i}">${esc(it.name)}</button>`).join('')}
            </div>
          ` : ''}
          <div class="items-table">
            <div class="items-header">
              <span style="flex:3">Description</span>
              <span style="flex:1">Qty</span>
              <span style="flex:1">Price</span>
              <span style="width:28px"></span>
            </div>
            <div id="items-rows">
              ${(data.items || []).map((it, i) => itemRowHtml(it, i)).join('')}
            </div>
            <button class="q-add-item" id="add-item-btn">+ Add Row</button>
          </div>
          ${row(textField('Tax Rate %', 'taxRate', { type: 'number' }) + textField('Discount ($)', 'discount', { type: 'number' }))}
          <div class="totals-preview" id="totals-preview-box">${totalsPreviewHtml(computeTotals())}</div>
        `) : ''}

        ${doc.layout === 'log' ? section('Log Entries', `
          ${row(textField('Log Date', 'logDate', { type: 'date' }) + selectField('Period', 'logPeriod', ['Daily', 'Weekly', 'Monthly', 'Custom']))}
          <div class="log-entry-list" id="log-rows">
            ${(data.logEntries || []).map((r, i) => logRowHtml(r, i)).join('')}
          </div>
          <button class="q-add-item" id="add-log-btn">+ Add Row</button>
        `) : ''}

        ${section('Footer & Signature', `
          ${selectField('Payment Method', 'paymentMethod', payMethods)}
          ${textareaField('Notes', 'notes', { placeholder: 'Any additional notes...' })}
          ${doc.isInvoice ? textareaField('Terms', 'terms', { placeholder: 'Payment terms...' }) : ''}
          ${row(textField('Signatory Name', 'signatureName') + textField('Signatory Title', 'signatureTitle'))}
        `)}
      </div>
    `
  }

  function itemRowHtml(it, i) {
    return `
      <div class="item-row" data-item-row="${i}">
        <input class="q-input" style="flex:3" data-item-desc="${i}" value="${esc(it.description)}" placeholder="Item / service" />
        <input class="q-input" style="flex:1" type="number" min="1" data-item-qty="${i}" value="${esc(it.qty)}" />
        <input class="q-input" style="flex:1" type="number" step="0.01" data-item-price="${i}" value="${esc(it.price)}" placeholder="0.00" />
        <button class="q-rm" data-rm-item-row="${i}">✕</button>
      </div>
    `
  }

  function logRowHtml(r, i) {
    const cols = doc.logColumns || []
    return `
      <div class="log-entry-row" data-log-row="${i}">
        <span class="log-row-num">${i + 1}</span>
        ${[0, 1, 2, 3, 4].map(c => `
          <input class="q-input log-cell" data-log-cell="${i}.c${c}" value="${esc(r[`c${c}`] || '')}" placeholder="${esc(cols[c] || '')}" />
        `).join('')}
        <button class="q-rm" data-rm-log-row="${i}">✕</button>
      </div>
    `
  }

  function certFormHtml() {
    return `
      <div class="form-sections">
        ${section('Certificate', `
          ${selectField('Type', 'certType', ['Heritage Pedigree', 'Certified Pedigree', 'Registration Certificate'])}
          ${textField('Certificate #', 'certNumber')}
        `)}
        ${section('Dog', `
          ${textField('Registered Name', 'dogName2', { placeholder: "CH BDI IRON LEGEND" })}
          ${row(textField('Reg #', 'regNumber') + textField('Breed', 'breed'))}
          ${row(selectField('Sex', 'sex', ['Male', 'Female']) + textField('Color', 'color'))}
          ${row(textField('Date Whelped', 'dob', { type: 'date' }) + textField('Owner', 'owner'))}
          ${textField('Breeder', 'breeder')}
        `)}
        ${section('Sire', `
          ${nestedField('Sire Name', 'sire', 'name')}
          ${row(nestedField('Reg #', 'sire', 'reg') + nestedField('Color', 'sire', 'color'))}
        `)}
        ${section('Dam', `
          ${nestedField('Dam Name', 'dam', 'name')}
          ${row(nestedField('Reg #', 'dam', 'reg') + nestedField('Color', 'dam', 'color'))}
        `)}
        ${section('Grandparents', `
          ${nestedField("Sire's Sire", 'siresSire', 'name')}
          ${row(nestedField('Reg #', 'siresSire', 'reg') + nestedField('Color', 'siresSire', 'color'))}
          ${nestedField("Sire's Dam", 'siresDam', 'name')}
          ${row(nestedField('Reg #', 'siresDam', 'reg') + nestedField('Color', 'siresDam', 'color'))}
          ${nestedField("Dam's Sire", 'damsSire', 'name')}
          ${row(nestedField('Reg #', 'damsSire', 'reg') + nestedField('Color', 'damsSire', 'color'))}
          ${nestedField("Dam's Dam", 'damsDam', 'name')}
          ${row(nestedField('Reg #', 'damsDam', 'reg') + nestedField('Color', 'damsDam', 'color'))}
        `)}
      </div>
    `
  }

  function bindFormEvents(form) {
    form.querySelectorAll('[data-field]').forEach(el => {
      el.addEventListener('input', e => {
        data[e.target.dataset.field] = e.target.value
        refreshPreviewOnly()
      })
    })
    form.querySelectorAll('[data-nested]').forEach(el => {
      el.addEventListener('input', e => {
        const [k1, k2] = e.target.dataset.nested.split('.')
        data[k1] = { ...(data[k1] || {}), [k2]: e.target.value }
        refreshPreviewOnly()
      })
    })

    // Line items
    form.querySelectorAll('[data-quick-add]').forEach(btn => {
      btn.addEventListener('click', () => {
        const it = profile.commonItems[+btn.dataset.quickAdd]
        data.items = [...(data.items || []), { description: it.name, qty: '1', price: it.price }]
        renderForm()
        refreshPreviewOnly()
      })
    })
    const addItemBtn = form.querySelector('#add-item-btn')
    if (addItemBtn) addItemBtn.addEventListener('click', () => {
      data.items = [...(data.items || []), { description: '', qty: '1', price: '' }]
      renderForm()
      refreshPreviewOnly()
    })
    form.querySelectorAll('[data-item-desc]').forEach(el => el.addEventListener('input', e => {
      data.items[+e.target.dataset.itemDesc].description = e.target.value
      refreshPreviewOnly()
    }))
    form.querySelectorAll('[data-item-qty]').forEach(el => el.addEventListener('input', e => {
      data.items[+e.target.dataset.itemQty].qty = e.target.value
      refreshPreviewOnly()
    }))
    form.querySelectorAll('[data-item-price]').forEach(el => el.addEventListener('input', e => {
      data.items[+e.target.dataset.itemPrice].price = e.target.value
      refreshPreviewOnly()
    }))
    form.querySelectorAll('[data-rm-item-row]').forEach(btn => btn.addEventListener('click', e => {
      data.items.splice(+e.target.dataset.rmItemRow, 1)
      renderForm()
      refreshPreviewOnly()
    }))

    // Log entries
    const addLogBtn = form.querySelector('#add-log-btn')
    if (addLogBtn) addLogBtn.addEventListener('click', () => {
      data.logEntries = [...(data.logEntries || []), { c0: '', c1: '', c2: '', c3: '', c4: '' }]
      renderForm()
      refreshPreviewOnly()
    })
    form.querySelectorAll('[data-log-cell]').forEach(el => el.addEventListener('input', e => {
      const [idx, col] = e.target.dataset.logCell.split('.')
      data.logEntries[+idx][col] = e.target.value
      refreshPreviewOnly()
    }))
    form.querySelectorAll('[data-rm-log-row]').forEach(btn => btn.addEventListener('click', e => {
      data.logEntries.splice(+e.target.dataset.rmLogRow, 1)
      renderForm()
      refreshPreviewOnly()
    }))
  }

  render()
}
