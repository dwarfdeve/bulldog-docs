import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'

const STEPS = ['Identity', 'Contact', 'Business', 'Quick Items']

export default function Questionnaire({ onComplete }) {
  const { profile, updateProfile, completeProfile } = useProfile()
  const [step, setStep] = useState(0)
  const [local, setLocal] = useState({ ...profile })

  function f(key) {
    return (e) => setLocal(prev => ({ ...prev, [key]: e.target.value }))
  }

  function saveAndNext() {
    updateProfile(local)
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else { completeProfile(); onComplete() }
  }

  function back() { setStep(s => s - 1) }

  function updateItem(idx, field, val) {
    const items = [...local.commonItems]
    items[idx] = { ...items[idx], [field]: val }
    setLocal(prev => ({ ...prev, commonItems: items }))
  }

  function addItem() {
    setLocal(prev => ({ ...prev, commonItems: [...prev.commonItems, { name: '', price: '' }] }))
  }

  function removeItem(idx) {
    setLocal(prev => ({ ...prev, commonItems: prev.commonItems.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="q-shell">
      <div className="q-card">
        {/* Header */}
        <div className="q-header">
          <img src="./bdi-logo.jpeg" alt="BDI" className="q-logo" />
          <div>
            <div className="q-brand">BULLDOG INC.</div>
            <div className="q-sub">Document Generator Setup</div>
          </div>
        </div>

        {/* Progress */}
        <div className="q-progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`q-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="q-step-dot">{i < step ? '✓' : i + 1}</div>
              <div className="q-step-label">{s}</div>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="q-body">

          {step === 0 && (
            <>
              <h2 className="q-title">Who are you?</h2>
              <p className="q-hint">This prefills every document you generate — takes 30 seconds.</p>
              <div className="q-grid2">
                <Field label="First Name *" value={local.firstName} onChange={f('firstName')} placeholder="John" />
                <Field label="Last Name *"  value={local.lastName}  onChange={f('lastName')}  placeholder="Doe" />
              </div>
              <Field label="Business / Kennel Name *" value={local.businessName} onChange={f('businessName')} placeholder="Bulldog Inc." />
              <div className="q-grid2">
                <Field label="Your Title / Role" value={local.title} onChange={f('title')} placeholder="Breeder & Owner" />
                <Field label="Year Established"  value={local.estYear} onChange={f('estYear')} placeholder="2020" />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="q-title">Contact Information</h2>
              <p className="q-hint">Appears on all document headers automatically.</p>
              <Field label="Street Address" value={local.street} onChange={f('street')} placeholder="123 Kennel Lane" />
              <div className="q-grid3">
                <Field label="City"  value={local.city}  onChange={f('city')}  placeholder="Atlanta" />
                <Field label="State" value={local.state} onChange={f('state')} placeholder="GA" />
                <Field label="ZIP"   value={local.zip}   onChange={f('zip')}   placeholder="30301" />
              </div>
              <div className="q-grid2">
                <Field label="Phone"   value={local.phone}   onChange={f('phone')}   placeholder="(404) 555-0100" />
                <Field label="Email"   value={local.email}   onChange={f('email')}   placeholder="info@bulldoginc.com" />
              </div>
              <Field label="Website (optional)" value={local.website} onChange={f('website')} placeholder="www.bulldoginc.com" />
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="q-title">Business Details</h2>
              <p className="q-hint">Used on invoices and official receipts.</p>
              <div className="q-grid2">
                <Field label="Tax ID / EIN (optional)" value={local.taxId} onChange={f('taxId')} placeholder="12-3456789" />
                <Field label="License # (optional)"    value={local.licenseNum} onChange={f('licenseNum')} placeholder="USDA-12345" />
              </div>
              <div className="q-grid2">
                <Field label="Default Breed" value={local.defaultBreed} onChange={f('defaultBreed')} placeholder="French Bulldog" />
                <Field label="Default Tax Rate %" value={local.taxRate} onChange={f('taxRate')} placeholder="0" type="number" />
              </div>
              <label className="q-label" style={{marginTop:12}}>Accepted Payment Methods</label>
              <div className="q-checkrow">
                {['Cash','Zelle','Venmo','PayPal','Credit Card','Check','Wire Transfer'].map(pm => (
                  <label key={pm} className="q-check">
                    <input
                      type="checkbox"
                      checked={(local.paymentMethods || []).includes(pm)}
                      onChange={e => {
                        const cur = local.paymentMethods || []
                        setLocal(prev => ({
                          ...prev,
                          paymentMethods: e.target.checked ? [...cur, pm] : cur.filter(x => x !== pm)
                        }))
                      }}
                    />
                    {pm}
                  </label>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="q-title">Your Common Items</h2>
              <p className="q-hint">These appear as quick-add buttons in every document form. Edit anytime.</p>
              <div className="q-items">
                {(local.commonItems || []).map((item, i) => (
                  <div key={i} className="q-item-row">
                    <input className="q-input" value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="Item / service name" style={{flex:3}} />
                    <span className="q-item-dollar">$</span>
                    <input className="q-input" value={item.price} onChange={e => updateItem(i, 'price', e.target.value)} placeholder="Price" type="number" style={{flex:1}} />
                    <button className="q-rm" onClick={() => removeItem(i)}>✕</button>
                  </div>
                ))}
                <button className="q-add-item" onClick={addItem}>+ Add Item</button>
              </div>
              <div className="q-done-msg">
                <span>🎉</span>
                <span>After this, every document form will be pre-filled with your business info. You can edit any field before printing.</span>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="q-nav">
          {step > 0
            ? <button className="btn btn-secondary" onClick={back}>← Back</button>
            : <div />
          }
          <button className="btn btn-primary" onClick={saveAndNext}>
            {step === STEPS.length - 1 ? '🚀 Launch Generator' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="q-field">
      <label className="q-label">{label}</label>
      <input className="q-input" type={type} value={value || ''} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}
