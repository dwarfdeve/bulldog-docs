import { useState, useRef } from 'react'
import CertificateForm from './components/CertificateForm'
import Certificate from './components/Certificate'

const defaultData = {
  // Dog
  dogName: '',
  regNumber: '',
  breed: 'French Bulldog',
  sex: 'Male',
  color: '',
  dob: '',
  breeder: '',
  owner: '',

  // Sire (col 1)
  sire: { name: '', reg: '', color: '' },
  // Dam (col 1)
  dam:  { name: '', reg: '', color: '' },

  // Sire's parents (col 2)
  siresSire: { name: '', reg: '', color: '' },
  siresDam:  { name: '', reg: '', color: '' },
  // Dam's parents (col 2)
  damsSire: { name: '', reg: '', color: '' },
  damsDam:  { name: '', reg: '', color: '' },

  // Great-grandparents sire side (col 3)
  ssss: { name: '', reg: '' },
  sssd: { name: '', reg: '' },
  ssds: { name: '', reg: '' },
  ssdd: { name: '', reg: '' },
  // Great-grandparents dam side (col 3)
  sdss: { name: '', reg: '' },
  sdsd: { name: '', reg: '' },
  sdds: { name: '', reg: '' },
  sddd: { name: '', reg: '' },

  // 4th generation sire side (col 4) — 8 entries
  g4ss1: '', g4ss2: '', g4ss3: '', g4ss4: '',
  g4ss5: '', g4ss6: '', g4ss7: '', g4ss8: '',
  // 4th gen dam side
  g4ds1: '', g4ds2: '', g4ds3: '', g4ds4: '',
  g4ds5: '', g4ds6: '', g4ds7: '', g4ds8: '',

  certType: 'Heritage Pedigree',
  certNumber: '',
}

export default function App() {
  const [data, setData] = useState(defaultData)
  const [generated, setGenerated] = useState(false)
  const certRef = useRef(null)

  function handleChange(path, value) {
    setData(prev => {
      const parts = path.split('.')
      if (parts.length === 1) return { ...prev, [path]: value }
      return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } }
    })
  }

  function handleGenerate() { setGenerated(true) }

  function handlePrint() {
    window.print()
  }

  function handleReset() {
    setData(defaultData)
    setGenerated(false)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <img src="/bdi-logo.jpeg" alt="BDI Logo" />
        <div className="brand">
          <span className="brand-title">BULLDOG INC.</span>
          <span className="brand-sub">Pedigree Certificate Generator</span>
        </div>
        <div className="header-actions">
          {generated && (
            <>
              <button className="btn btn-secondary" onClick={handleReset}>New Certificate</button>
              <button className="btn btn-primary" onClick={handlePrint}>Print / Save PDF</button>
            </>
          )}
        </div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <CertificateForm data={data} onChange={handleChange} onGenerate={handleGenerate} />
        </aside>

        <section className="preview-panel" ref={certRef}>
          {!generated ? (
            <p className="no-cert">Fill in the form and click<br />Generate Certificate</p>
          ) : (
            <>
              <div className="print-bar">
                <button className="btn btn-secondary" onClick={handleReset}>New Certificate</button>
                <button className="btn btn-primary" onClick={handlePrint}>🖨 Print / Save PDF</button>
              </div>
              <Certificate data={data} />
            </>
          )}
        </section>
      </div>
    </div>
  )
}
