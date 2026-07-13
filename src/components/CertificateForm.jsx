export default function CertificateForm({ data, onChange, onGenerate }) {
  const f = (path) => (e) => onChange(path, e.target.value)

  return (
    <>
      {/* Certificate type */}
      <div className="form-section">
        <h2>Certificate Info</h2>
        <div>
          <label>Certificate Type</label>
          <select value={data.certType} onChange={f('certType')}>
            <option>Heritage Pedigree</option>
            <option>Certified Pedigree</option>
            <option>Registration Certificate</option>
          </select>
        </div>
        <div>
          <label>Certificate / Reg #</label>
          <input value={data.certNumber} onChange={f('certNumber')} placeholder="BDI-2024-00001" />
        </div>
      </div>

      {/* Dog info */}
      <div className="form-section">
        <h2>Dog Information</h2>
        <div>
          <label>Registered Name *</label>
          <input value={data.dogName} onChange={f('dogName')} placeholder="CH BULLDOG INC'S IRON LEGEND" />
        </div>
        <div className="field-pair">
          <div>
            <label>Reg Number</label>
            <input value={data.regNumber} onChange={f('regNumber')} placeholder="BDI-000001" />
          </div>
          <div>
            <label>Breed</label>
            <input value={data.breed} onChange={f('breed')} />
          </div>
        </div>
        <div className="field-pair">
          <div>
            <label>Sex</label>
            <select value={data.sex} onChange={f('sex')}>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label>Color</label>
            <input value={data.color} onChange={f('color')} placeholder="Blue Merle" />
          </div>
        </div>
        <div className="field-pair">
          <div>
            <label>Date Whelped</label>
            <input type="date" value={data.dob} onChange={f('dob')} />
          </div>
          <div>
            <label>Owner</label>
            <input value={data.owner} onChange={f('owner')} placeholder="Owner Name" />
          </div>
        </div>
        <div>
          <label>Breeder</label>
          <input value={data.breeder} onChange={f('breeder')} placeholder="Breeder Name" />
        </div>
      </div>

      {/* Parents */}
      <div className="form-section">
        <h2>Parents (1st Generation)</h2>
        <div>
          <label>Sire — Registered Name</label>
          <input value={data.sire.name} onChange={f('sire.name')} placeholder="CH BDI KING BULLDOZER" />
        </div>
        <div className="field-pair">
          <div>
            <label>Sire Reg #</label>
            <input value={data.sire.reg} onChange={f('sire.reg')} />
          </div>
          <div>
            <label>Sire Color</label>
            <input value={data.sire.color} onChange={f('sire.color')} />
          </div>
        </div>
        <div>
          <label>Dam — Registered Name</label>
          <input value={data.dam.name} onChange={f('dam.name')} placeholder="CH BDI QUEEN OF HEARTS" />
        </div>
        <div className="field-pair">
          <div>
            <label>Dam Reg #</label>
            <input value={data.dam.reg} onChange={f('dam.reg')} />
          </div>
          <div>
            <label>Dam Color</label>
            <input value={data.dam.color} onChange={f('dam.color')} />
          </div>
        </div>
      </div>

      {/* Grandparents */}
      <div className="form-section">
        <h2>Grandparents (2nd Generation)</h2>
        {[
          ['Sire\'s Sire', 'siresSire'],
          ['Sire\'s Dam', 'siresDam'],
          ['Dam\'s Sire', 'damsSire'],
          ['Dam\'s Dam', 'damsDam'],
        ].map(([label, key]) => (
          <div key={key}>
            <label>{label}</label>
            <input value={data[key].name} onChange={f(`${key}.name`)} placeholder="Registered Name" />
            <div className="field-pair" style={{marginTop:4}}>
              <input value={data[key].reg} onChange={f(`${key}.reg`)} placeholder="Reg #" />
              <input value={data[key].color} onChange={f(`${key}.color`)} placeholder="Color" />
            </div>
          </div>
        ))}
      </div>

      {/* Great-grandparents */}
      <div className="form-section">
        <h2>Great-Grandparents (3rd Gen)</h2>
        <div className="ancestor-grid">
          {[
            ['Sire/Sire/Sire', 'ssss'],
            ['Sire/Sire/Dam',  'sssd'],
            ['Sire/Dam/Sire',  'ssds'],
            ['Sire/Dam/Dam',   'ssdd'],
            ['Dam/Sire/Sire',  'sdss'],
            ['Dam/Sire/Dam',   'sdsd'],
            ['Dam/Dam/Sire',   'sdds'],
            ['Dam/Dam/Dam',    'sddd'],
          ].map(([label, key]) => (
            <div className="ancestor-row" key={key}>
              <label>{label}</label>
              <input value={data[key].name} onChange={f(`${key}.name`)} placeholder="Name" />
              <input value={data[key].reg} onChange={f(`${key}.reg`)} placeholder="Reg #" style={{marginTop:2}} />
            </div>
          ))}
        </div>
      </div>

      {/* 4th gen */}
      <div className="form-section">
        <h2>4th Generation (Names Only)</h2>
        <div className="ancestor-grid">
          {Array.from({length:16}, (_,i) => {
            const side = i < 8 ? 'Sire' : 'Dam'
            const num  = (i % 8) + 1
            const key  = i < 8 ? `g4ss${num}` : `g4ds${num}`
            return (
              <div className="ancestor-row" key={key}>
                <label>{side} line {num}</label>
                <input value={data[key]} onChange={f(key)} placeholder="Name" />
              </div>
            )
          })}
        </div>
      </div>

      <button
        className="btn btn-primary"
        style={{width:'100%', padding:'13px', fontSize:'0.9rem', letterSpacing:'2px'}}
        onClick={onGenerate}
      >
        Generate Certificate
      </button>
    </>
  )
}
