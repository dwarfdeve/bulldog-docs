import { useState, useCallback } from 'react'
import { useProfile } from '../context/ProfileContext'
import { getDoc, buildInitialState } from '../documents/registry'
import ReceiptLayout from '../layouts/ReceiptLayout'
import LogLayout from '../layouts/LogLayout'
import CertLayout from '../layouts/CertLayout'

export default function DocumentPage({ docId, onBack }) {
  const { profile } = useProfile()
  const doc = getDoc(docId)
  const [data, setData] = useState(() => buildInitialState(doc, profile))

  function set(key, value) {
    setData(prev => ({ ...prev, [key]: value }))
  }

  function setNested(key, subKey, value) {
    setData(prev => ({ ...prev, [key]: { ...prev[key], [subKey]: value } }))
  }

  // Line items
  const subtotal = (data.items || []).reduce((s, it) => {
    return s + (parseFloat(it.qty || 1) * parseFloat(it.price || 0))
  }, 0)
  const taxAmt  = subtotal * (parseFloat(data.taxRate || 0) / 100)
  const discount = parseFloat(data.discount || 0)
  const total   = subtotal + taxAmt - discount

  function updateItem(idx, field, val) {
    const items = [...(data.items || [])]
    items[idx] = { ...items[idx], [field]: val }
    setData(prev => ({ ...prev, items }))
  }
  function addItem(preset) {
    const item = preset || { description: '', qty: '1', price: '' }
    setData(prev => ({ ...prev, items: [...(prev.items || []), item] }))
  }
  function removeItem(idx) {
    setData(prev => ({ ...prev, items: (prev.items || []).filter((_, i) => i !== idx) }))
  }

  // Log entries
  function updateLogEntry(idx, col, val) {
    const entries = [...(data.logEntries || [])]
    entries[idx] = { ...entries[idx], [col]: val }
    setData(prev => ({ ...prev, logEntries: entries }))
  }
  function addLogRow() {
    setData(prev => ({ ...prev, logEntries: [...(prev.logEntries || []), { c0:'',c1:'',c2:'',c3:'',c4:'' }] }))
  }
  function removeLogRow(idx) {
    setData(prev => ({ ...prev, logEntries: (prev.logEntries||[]).filter((_,i)=>i!==idx) }))
  }

  const computed = { subtotal, taxAmt, discount, total }
  const handlers = { set, setNested, updateItem, addItem, removeItem, updateLogEntry, addLogRow, removeLogRow }

  return (
    <div className="docpage-shell">
      {/* Top bar */}
      <div className="docpage-topbar">
        <button className="btn-ghost" onClick={onBack}>← Dashboard</button>
        <div className="docpage-doctitle">
          <span className="docpage-icon">{doc.icon}</span>
          <span>{doc.name}</span>
        </div>
        <button className="btn btn-primary docpage-print" onClick={() => window.print()}>
          🖨 Print / Save PDF
        </button>
      </div>

      <div className="docpage-split">
        {/* LEFT — form */}
        <aside className="docpage-form" id="no-print">
          <DocForm doc={doc} data={data} computed={computed} handlers={handlers} profile={profile} />
        </aside>

        {/* RIGHT — printable preview */}
        <main className="docpage-preview" id="print-area">
          {doc.layout === 'receipt' && (
            <ReceiptLayout doc={doc} data={data} computed={computed} />
          )}
          {doc.layout === 'log' && (
            <LogLayout doc={doc} data={data} />
          )}
          {doc.layout === 'cert' && (
            <CertLayout doc={doc} data={data} handlers={handlers} setNested={setNested} />
          )}
        </main>
      </div>
    </div>
  )
}

// ── Inline Doc Form ────────────────────────────────────────────────────────

function DocForm({ doc, data, computed, handlers, profile }) {
  const { set, setNested, updateItem, addItem, removeItem, updateLogEntry, addLogRow, removeLogRow } = handlers

  function f(key)            { return e => set(key, e.target.value) }
  function fNest(k1, k2)     { return e => setNested(k1, k2, e.target.value) }

  const payMethods = profile.paymentMethods?.length
    ? profile.paymentMethods
    : ['Cash','Zelle','Venmo','Credit Card']

  if (doc.layout === 'cert') return <CertFormFields data={data} set={set} setNested={setNested} />

  return (
    <div className="form-sections">
      {/* ── Doc header ── */}
      <Section title="Document">
        <Row>
          <Field label="Document #" value={data.docNumber} onChange={f('docNumber')} />
          <Field label="Date" type="date" value={data.date} onChange={f('date')} />
        </Row>
        {doc.dateRange && (
          <Row>
            <Field label="Check-in" type="date" value={data.date} onChange={f('date')} />
            <Field label="Check-out" type="date" value={data.dateEnd} onChange={f('dateEnd')} />
          </Row>
        )}
      </Section>

      {/* ── Issuer ── */}
      <Section title="Your Info (pre-filled)">
        <Field label="Business Name" value={data.issuerName} onChange={f('issuerName')} />
        <Row>
          <Field label="Phone" value={data.issuerPhone} onChange={f('issuerPhone')} />
          <Field label="Email" value={data.issuerEmail} onChange={f('issuerEmail')} />
        </Row>
        <Field label="Address" value={data.issuerAddress} onChange={f('issuerAddress')} />
        <Field label="City, State ZIP" value={data.issuerCityStateZip} onChange={f('issuerCityStateZip')} />
        {data.issuerTaxId && (
          <Field label="Tax ID" value={data.issuerTaxId} onChange={f('issuerTaxId')} />
        )}
      </Section>

      {/* ── Recipient ── */}
      <Section title={doc.recipientLabel || 'OTHER PARTY'}>
        <Field label="Name / Company" value={data.recipientName} onChange={f('recipientName')} placeholder="Customer or Vendor name" />
        <Field label="Address"        value={data.recipientAddress} onChange={f('recipientAddress')} placeholder="Street, City, State" />
        <Row>
          <Field label="Phone" value={data.recipientPhone} onChange={f('recipientPhone')} />
          <Field label="Email" value={data.recipientEmail} onChange={f('recipientEmail')} />
        </Row>
      </Section>

      {/* ── Dog fields ── */}
      {doc.dogFields && (
        <Section title="Dog / Animal Info">
          <Row>
            <Field label="Dog Name"  value={data.dogName}  onChange={f('dogName')}  placeholder="Registered name" />
            <Field label="Breed"     value={data.dogBreed} onChange={f('dogBreed')} placeholder="French Bulldog" />
          </Row>
          <Row>
            <Field label="Date of Birth" type="date" value={data.dogDob} onChange={f('dogDob')} />
            <Field label="Sex" value={data.dogSex} onChange={f('dogSex')} type="select" options={['Male','Female']} />
          </Row>
          <Row>
            <Field label="Color / Markings" value={data.dogColor}  onChange={f('dogColor')}  placeholder="Blue Merle" />
            <Field label="Reg / ID #"       value={data.dogRegNum} onChange={f('dogRegNum')} placeholder="BDI-000001" />
          </Row>
          {(doc.id === 'puppy-sale' || doc.id === 'breeding-service') && (
            <Field label="Microchip #" value={data.dogMicrochip} onChange={f('dogMicrochip')} />
          )}
        </Section>
      )}

      {/* ── Line items (receipt layout) ── */}
      {doc.layout === 'receipt' && (
        <Section title="Line Items">
          {/* Quick-add from profile */}
          {profile.commonItems?.length > 0 && (
            <div className="quick-add">
              <span className="quick-add-label">Quick add:</span>
              {profile.commonItems.map((it, i) => (
                <button key={i} className="quick-chip"
                  onClick={() => addItem({ description: it.name, qty: '1', price: it.price })}>
                  {it.name}
                </button>
              ))}
            </div>
          )}
          <div className="items-table">
            <div className="items-header">
              <span style={{flex:3}}>Description</span>
              <span style={{flex:1}}>Qty</span>
              <span style={{flex:1}}>Price</span>
              <span style={{width:28}}></span>
            </div>
            {(data.items || []).map((it, i) => (
              <div key={i} className="item-row">
                <input className="q-input" style={{flex:3}} value={it.description} placeholder="Item / service"
                  onChange={e => updateItem(i,'description',e.target.value)} />
                <input className="q-input" style={{flex:1}} value={it.qty} type="number" min="1"
                  onChange={e => updateItem(i,'qty',e.target.value)} />
                <input className="q-input" style={{flex:1}} value={it.price} type="number" step="0.01" placeholder="0.00"
                  onChange={e => updateItem(i,'price',e.target.value)} />
                <button className="q-rm" onClick={() => removeItem(i)}>✕</button>
              </div>
            ))}
            <button className="q-add-item" onClick={() => addItem()}>+ Add Row</button>
          </div>
          <Row>
            <Field label="Tax Rate %" value={data.taxRate} onChange={f('taxRate')} type="number" />
            <Field label="Discount ($)" value={data.discount} onChange={f('discount')} type="number" />
          </Row>
          <div className="totals-preview">
            <div>Subtotal: <strong>${computed.subtotal.toFixed(2)}</strong></div>
            {parseFloat(data.taxRate) > 0 && <div>Tax: <strong>${computed.taxAmt.toFixed(2)}</strong></div>}
            {parseFloat(data.discount) > 0 && <div>Discount: <strong>-${computed.discount.toFixed(2)}</strong></div>}
            <div className="total-line">TOTAL: <strong>${computed.total.toFixed(2)}</strong></div>
          </div>
        </Section>
      )}

      {/* ── Log entries (log layout) ── */}
      {doc.layout === 'log' && (
        <Section title="Log Entries">
          <Row>
            <Field label="Log Date" type="date" value={data.logDate} onChange={f('logDate')} />
            <Field label="Period" value={data.logPeriod} onChange={f('logPeriod')} type="select"
              options={['Daily','Weekly','Monthly','Custom']} />
          </Row>
          <div className="log-entry-list">
            {(data.logEntries || []).map((row, i) => (
              <div key={i} className="log-entry-row">
                <span className="log-row-num">{i+1}</span>
                {[0,1,2,3,4].map(c => (
                  <input key={c} className="q-input log-cell"
                    value={row[`c${c}`] || ''} placeholder={(doc.logColumns||[])[c] || ''}
                    onChange={e => updateLogEntry(i, `c${c}`, e.target.value)} />
                ))}
                <button className="q-rm" onClick={() => removeLogRow(i)}>✕</button>
              </div>
            ))}
            <button className="q-add-item" onClick={addLogRow}>+ Add Row</button>
          </div>
        </Section>
      )}

      {/* ── Footer ── */}
      <Section title="Footer & Signature">
        <Field label="Payment Method" value={data.paymentMethod} onChange={f('paymentMethod')}
          type="select" options={payMethods} />
        <Field label="Notes" value={data.notes} onChange={f('notes')} multiline placeholder="Any additional notes..." />
        {doc.isInvoice && (
          <Field label="Terms" value={data.terms} onChange={f('terms')} multiline placeholder="Payment terms..." />
        )}
        <Row>
          <Field label="Signatory Name"  value={data.signatureName}  onChange={f('signatureName')} />
          <Field label="Signatory Title" value={data.signatureTitle} onChange={f('signatureTitle')} />
        </Row>
      </Section>
    </div>
  )
}

// Pedigree cert form (reuses the structure from original CertificateForm)
function CertFormFields({ data, set, setNested }) {
  const f  = k => e => set(k, e.target.value)
  const fn = (k1,k2) => e => setNested(k1, k2, e.target.value)
  return (
    <div className="form-sections">
      <Section title="Certificate">
        <Field label="Type" value={data.certType} onChange={f('certType')} type="select"
          options={['Heritage Pedigree','Certified Pedigree','Registration Certificate']} />
        <Field label="Certificate #" value={data.certNumber} onChange={f('certNumber')} />
      </Section>
      <Section title="Dog">
        <Field label="Registered Name" value={data.dogName2} onChange={f('dogName2')} placeholder="CH BDI IRON LEGEND" />
        <Row>
          <Field label="Reg #" value={data.regNumber} onChange={f('regNumber')} />
          <Field label="Breed" value={data.breed} onChange={f('breed')} />
        </Row>
        <Row>
          <Field label="Sex" value={data.sex} onChange={f('sex')} type="select" options={['Male','Female']} />
          <Field label="Color" value={data.color} onChange={f('color')} />
        </Row>
        <Row>
          <Field label="Date Whelped" type="date" value={data.dob} onChange={f('dob')} />
          <Field label="Owner" value={data.owner} onChange={f('owner')} />
        </Row>
        <Field label="Breeder" value={data.breeder} onChange={f('breeder')} />
      </Section>
      <Section title="Sire">
        <Field label="Sire Name" value={data.sire?.name} onChange={fn('sire','name')} />
        <Row>
          <Field label="Reg #" value={data.sire?.reg} onChange={fn('sire','reg')} />
          <Field label="Color" value={data.sire?.color} onChange={fn('sire','color')} />
        </Row>
      </Section>
      <Section title="Dam">
        <Field label="Dam Name" value={data.dam?.name} onChange={fn('dam','name')} />
        <Row>
          <Field label="Reg #" value={data.dam?.reg} onChange={fn('dam','reg')} />
          <Field label="Color" value={data.dam?.color} onChange={fn('dam','color')} />
        </Row>
      </Section>
    </div>
  )
}

// ── Shared UI helpers ──────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="form-section">
      <div className="form-section-title">{title}</div>
      {children}
    </div>
  )
}

function Row({ children }) {
  return <div className="form-row">{children}</div>
}

function Field({ label, value, onChange, placeholder, type = 'text', options, multiline }) {
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      {multiline
        ? <textarea className="q-input form-textarea" value={value||''} onChange={onChange} placeholder={placeholder} rows={3} />
        : type === 'select'
          ? (
            <select className="q-input" value={value||''} onChange={onChange}>
              {(options||[]).map(o => <option key={o}>{o}</option>)}
            </select>
          )
          : <input className="q-input" type={type} value={value||''} onChange={onChange} placeholder={placeholder} />
      }
    </div>
  )
}
