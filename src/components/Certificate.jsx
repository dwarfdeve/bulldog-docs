function fmt(date) {
  if (!date) return '—'
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
}

function PedCell({ label, name, reg, color, rowSpan = 1, style = {} }) {
  return (
    <div className="ped-cell" style={{ flex: rowSpan, ...style }}>
      {label && <span className="ped-cell-label">{label}</span>}
      <span className="ped-cell-name">{name || '—'}</span>
      {(reg || color) && (
        <span className="ped-cell-info">
          {[reg, color].filter(Boolean).join(' · ')}
        </span>
      )}
    </div>
  )
}

export default function Certificate({ data }) {
  const today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })

  return (
    <div className="cert-wrap">
      {/* Stamp watermark */}
      <img src="./bdi-logo.jpeg" className="cert-stamp" alt="" aria-hidden="true" />

      <div className="cert-border-inner" />

      <div className="cert-body">
        {/* ── Header ── */}
        <div className="cert-header">
          <div className="cert-company-name">BULLDOG INC. · REGISTERING OFFICES</div>
          <div className="cert-founded">ESTABLISHED · QUALITY ASSURED BY BDI</div>
        </div>

        <div className="cert-title-block">
          <div className="cert-title">{data.certType}</div>
          <div className="cert-subtitle">OFFICIAL DOCUMENT — BULLDOG INC. (BDI)</div>
        </div>

        <div className="cert-divider" />
        <div className="cert-divider-thin" />

        {/* ── Dog Name ── */}
        <div className="cert-dog-name">{data.dogName || 'DOG REGISTERED NAME'}</div>

        {/* ── Dog Info Grid ── */}
        <div className="cert-dog-info">
          {[
            ['BDI Reg #', data.regNumber],
            ['Breed', data.breed],
            ['Sex', data.sex],
            ['Color', data.color],
            ['Date Whelped', fmt(data.dob)],
            ['Breeder', data.breeder],
            ['Owner', data.owner],
            ['Certificate #', data.certNumber],
          ].map(([label, val]) => (
            <div className="cert-dog-info-row" key={label}>
              <span className="cert-dog-info-label">{label}:</span>
              <span className="cert-dog-info-value">{val || '—'}</span>
            </div>
          ))}
        </div>

        <div className="cert-divider" />

        {/* ── Pedigree Tree ── */}
        <div style={{ display:'flex', gap:0, border:'1px solid rgba(139,105,20,0.4)', marginTop:8 }}>

          {/* Col 0 — Sire / Dam labels */}
          <div style={{ display:'flex', flexDirection:'column', width:130, borderRight:'1px solid rgba(139,105,20,0.4)' }}>
            <div className="ped-cell-label" style={{textAlign:'center',padding:'4px 0 6px',borderBottom:'1px solid rgba(139,105,20,0.3)',fontFamily:'Cinzel,serif',fontSize:'0.55rem',letterSpacing:'2px',color:'#8b6914'}}>Parents</div>
            {/* Sire half */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', borderBottom:'1px solid rgba(139,105,20,0.4)' }}>
              <PedCell label="Sire" name={data.sire.name} reg={data.sire.reg} color={data.sire.color} style={{flex:1,background:'rgba(196,30,30,0.03)'}} />
            </div>
            {/* Dam half */}
            <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
              <PedCell label="Dam" name={data.dam.name} reg={data.dam.reg} color={data.dam.color} style={{flex:1}} />
            </div>
          </div>

          {/* Col 1 — Grandparents */}
          <div style={{ display:'flex', flexDirection:'column', width:160, borderRight:'1px solid rgba(139,105,20,0.4)' }}>
            <div className="ped-cell-label" style={{textAlign:'center',padding:'4px 0 6px',borderBottom:'1px solid rgba(139,105,20,0.3)',fontFamily:'Cinzel,serif',fontSize:'0.55rem',letterSpacing:'2px',color:'#8b6914'}}>Grandparents</div>
            <PedCell label="Sire's Sire" name={data.siresSire.name} reg={data.siresSire.reg} color={data.siresSire.color} style={{flex:1}} />
            <PedCell label="Sire's Dam"  name={data.siresDam.name}  reg={data.siresDam.reg}  color={data.siresDam.color}  style={{flex:1}} />
            <PedCell label="Dam's Sire"  name={data.damsSire.name}  reg={data.damsSire.reg}  color={data.damsSire.color}  style={{flex:1}} />
            <PedCell label="Dam's Dam"   name={data.damsDam.name}   reg={data.damsDam.reg}   color={data.damsDam.color}   style={{flex:1}} />
          </div>

          {/* Col 2 — Great-grandparents */}
          <div style={{ display:'flex', flexDirection:'column', width:210, borderRight:'1px solid rgba(139,105,20,0.4)' }}>
            <div className="ped-cell-label" style={{textAlign:'center',padding:'4px 0 6px',borderBottom:'1px solid rgba(139,105,20,0.3)',fontFamily:'Cinzel,serif',fontSize:'0.55rem',letterSpacing:'2px',color:'#8b6914'}}>Great-Grandparents</div>
            {[
              [data.ssss,'SS/Sire'],[data.sssd,'SS/Dam'],
              [data.ssds,'SD/Sire'],[data.ssdd,'SD/Dam'],
              [data.sdss,'DS/Sire'],[data.sdsd,'DS/Dam'],
              [data.sdds,'DD/Sire'],[data.sddd,'DD/Dam'],
            ].map(([dog, lbl], i) => (
              <PedCell key={i} label={lbl} name={dog.name} reg={dog.reg} style={{flex:1}} />
            ))}
          </div>

          {/* Col 3 — 4th generation */}
          <div style={{ display:'flex', flexDirection:'column', flex:1 }}>
            <div className="ped-cell-label" style={{textAlign:'center',padding:'4px 0 6px',borderBottom:'1px solid rgba(139,105,20,0.3)',fontFamily:'Cinzel,serif',fontSize:'0.55rem',letterSpacing:'2px',color:'#8b6914'}}>4th Generation</div>
            {[
              data.g4ss1,data.g4ss2,data.g4ss3,data.g4ss4,
              data.g4ss5,data.g4ss6,data.g4ss7,data.g4ss8,
              data.g4ds1,data.g4ds2,data.g4ds3,data.g4ds4,
              data.g4ds5,data.g4ds6,data.g4ds7,data.g4ds8,
            ].map((name, i) => (
              <div key={i} className="ped-cell" style={{flex:1,padding:'3px 6px'}}>
                <span className="ped-cell-name" style={{fontSize:'0.62rem'}}>{name || '—'}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cert-divider-thin" style={{marginTop:14}} />

        {/* ── Footer ── */}
        <div className="cert-footer">
          {/* Left — stamp */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
            <img src="./bdi-logo.jpeg" className="cert-footer-stamp" alt="BDI Seal" />
            <span style={{fontFamily:'Cinzel,serif',fontSize:'0.58rem',letterSpacing:'2px',color:'#8b6914'}}>BDI · QUALITY STAMP</span>
          </div>

          {/* Center — attestation + sig */}
          <div className="cert-footer-center">
            <p className="cert-footer-seal-text">
              The seal of Bulldog Inc. (BDI) affixed hereto certifies that this pedigree was compiled
              from official Stud Book records and is accurate to the best of our knowledge.
              Issued: {today}
            </p>
            <div className="cert-sig-line">
              {data.breeder || 'Authorized Representative'}
            </div>
            <div className="cert-sig-role">Executive Director — Bulldog Inc.</div>
          </div>

          {/* Right — cert number */}
          <div className="cert-reg-block">
            <span className="bdi-label">BDI</span>
            <span>{data.certType}</span>
            <br />
            {data.certNumber && <span style={{fontWeight:600}}>{data.certNumber}</span>}
            <br />
            <span style={{fontFamily:'Cinzel,serif',fontSize:'0.6rem',letterSpacing:'1px',color:'#8b6914'}}>BULLDOG INC.™</span>
          </div>
        </div>
      </div>
    </div>
  )
}
