// Onboarding questionnaire — collects business profile before first use
import { esc } from '../utils.js'

const STEPS = ['Identity', 'Contact', 'Business', 'Quick Items']

export function renderQuestionnaire(root, { profile, updateProfile, completeProfile, onComplete }) {
  let step = 0
  let local = { ...profile, commonItems: (profile.commonItems || []).map(i => ({ ...i })), paymentMethods: [...(profile.paymentMethods || [])] }

  function field(label, key, opts = {}) {
    const { placeholder = '', type = 'text' } = opts
    return `
      <div class="q-field">
        <label class="q-label">${esc(label)}</label>
        <input class="q-input" type="${type}" data-key="${key}" value="${esc(local[key])}" placeholder="${esc(placeholder)}" />
      </div>
    `
  }

  function render() {
    root.innerHTML = `
      <div class="q-shell">
        <div class="q-card">
          <div class="q-header">
            <img src="./assets/bdi-logo.png" alt="BDI" class="q-logo" />
            <div>
              <div class="q-brand">BULLDOG INC.</div>
              <div class="q-sub">Document Generator Setup</div>
            </div>
          </div>

          <div class="q-progress">
            ${STEPS.map((s, i) => `
              <div class="q-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}">
                <div class="q-step-dot">${i < step ? '✓' : i + 1}</div>
                <div class="q-step-label">${esc(s)}</div>
              </div>
            `).join('')}
          </div>

          <div class="q-body" id="q-body"></div>

          <div class="q-nav">
            ${step > 0 ? `<button class="btn btn-secondary" id="q-back">← Back</button>` : `<div></div>`}
            <button class="btn btn-primary" id="q-next">${step === STEPS.length - 1 ? '🚀 Launch Generator' : 'Continue →'}</button>
          </div>
        </div>
      </div>
    `

    renderStepBody()

    root.querySelector('#q-next').addEventListener('click', saveAndNext)
    const backBtn = root.querySelector('#q-back')
    if (backBtn) backBtn.addEventListener('click', () => { step -= 1; render() })
  }

  function renderStepBody() {
    const body = root.querySelector('#q-body')
    if (step === 0) {
      body.innerHTML = `
        <h2 class="q-title">Who are you?</h2>
        <p class="q-hint">This prefills every document you generate — takes 30 seconds.</p>
        <div class="q-grid2">
          ${field('First Name *', 'firstName', { placeholder: 'John' })}
          ${field('Last Name *', 'lastName', { placeholder: 'Doe' })}
        </div>
        ${field('Business / Kennel Name *', 'businessName', { placeholder: 'Bulldog Inc.' })}
        <div class="q-grid2">
          ${field('Your Title / Role', 'title', { placeholder: 'Breeder & Owner' })}
          ${field('Year Established', 'estYear', { placeholder: '2020' })}
        </div>
      `
    } else if (step === 1) {
      body.innerHTML = `
        <h2 class="q-title">Contact Information</h2>
        <p class="q-hint">Appears on all document headers automatically.</p>
        ${field('Street Address', 'street', { placeholder: '123 Kennel Lane' })}
        <div class="q-grid3">
          ${field('City', 'city', { placeholder: 'Atlanta' })}
          ${field('State', 'state', { placeholder: 'GA' })}
          ${field('ZIP', 'zip', { placeholder: '30301' })}
        </div>
        <div class="q-grid2">
          ${field('Phone', 'phone', { placeholder: '(404) 555-0100' })}
          ${field('Email', 'email', { placeholder: 'info@bulldoginc.com' })}
        </div>
        ${field('Website (optional)', 'website', { placeholder: 'www.bulldoginc.com' })}
      `
    } else if (step === 2) {
      const pmOptions = ['Cash', 'Zelle', 'Venmo', 'PayPal', 'Credit Card', 'Check', 'Wire Transfer']
      body.innerHTML = `
        <h2 class="q-title">Business Details</h2>
        <p class="q-hint">Used on invoices and official receipts.</p>
        <div class="q-grid2">
          ${field('Tax ID / EIN (optional)', 'taxId', { placeholder: '12-3456789' })}
          ${field('License # (optional)', 'licenseNum', { placeholder: 'USDA-12345' })}
        </div>
        <div class="q-grid2">
          ${field('Default Breed', 'defaultBreed', { placeholder: 'French Bulldog' })}
          ${field('Default Tax Rate %', 'taxRate', { placeholder: '0', type: 'number' })}
        </div>
        <label class="q-label" style="margin-top:12px">Accepted Payment Methods</label>
        <div class="q-checkrow">
          ${pmOptions.map(pm => `
            <label class="q-check">
              <input type="checkbox" data-pm="${esc(pm)}" ${local.paymentMethods.includes(pm) ? 'checked' : ''} />
              ${esc(pm)}
            </label>
          `).join('')}
        </div>
      `
      body.querySelectorAll('[data-pm]').forEach(cb => {
        cb.addEventListener('change', e => {
          const pm = e.target.dataset.pm
          if (e.target.checked) {
            if (!local.paymentMethods.includes(pm)) local.paymentMethods.push(pm)
          } else {
            local.paymentMethods = local.paymentMethods.filter(x => x !== pm)
          }
        })
      })
    } else if (step === 3) {
      body.innerHTML = `
        <h2 class="q-title">Your Common Items</h2>
        <p class="q-hint">These appear as quick-add buttons in every document form. Edit anytime.</p>
        <div class="q-items" id="q-items"></div>
        <div class="q-done-msg">
          <span>🎉</span>
          <span>After this, every document form will be pre-filled with your business info. You can edit any field before printing.</span>
        </div>
      `
      renderItems()
    }

    body.querySelectorAll('input[data-key]').forEach(input => {
      input.addEventListener('input', e => {
        local[e.target.dataset.key] = e.target.value
      })
    })
  }

  function renderItems() {
    const wrap = root.querySelector('#q-items')
    wrap.innerHTML = `
      ${local.commonItems.map((item, i) => `
        <div class="q-item-row">
          <input class="q-input" data-item-name="${i}" value="${esc(item.name)}" placeholder="Item / service name" style="flex:3" />
          <span class="q-item-dollar">$</span>
          <input class="q-input" data-item-price="${i}" value="${esc(item.price)}" placeholder="Price" type="number" style="flex:1" />
          <button class="q-rm" data-rm-item="${i}">✕</button>
        </div>
      `).join('')}
      <button class="q-add-item" id="q-add-item">+ Add Item</button>
    `
    wrap.querySelectorAll('[data-item-name]').forEach(inp => {
      inp.addEventListener('input', e => { local.commonItems[+e.target.dataset.itemName].name = e.target.value })
    })
    wrap.querySelectorAll('[data-item-price]').forEach(inp => {
      inp.addEventListener('input', e => { local.commonItems[+e.target.dataset.itemPrice].price = e.target.value })
    })
    wrap.querySelectorAll('[data-rm-item]').forEach(btn => {
      btn.addEventListener('click', e => {
        local.commonItems.splice(+e.target.dataset.rmItem, 1)
        renderItems()
      })
    })
    wrap.querySelector('#q-add-item').addEventListener('click', () => {
      local.commonItems.push({ name: '', price: '' })
      renderItems()
    })
  }

  function saveAndNext() {
    updateProfile(local)
    if (step < STEPS.length - 1) {
      step += 1
      render()
    } else {
      completeProfile()
      onComplete()
    }
  }

  render()
}
