// Table-based log layout: Food Consumption Log, Feed/Supplement Log, Vaccination Record

function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
}

export default function LogLayout({ doc, data }) {
  const cols    = doc.logColumns    || ['Subject','Col 1','Col 2','Col 3','Notes']
  const widths  = doc.logColumnWidths || ['20%','20%','20%','20%','20%']
  const entries = (data.logEntries || []).filter(r => r.c0 || r.c1 || r.c2 || r.c3 || r.c4)

  return (
    <div className="log-wrap">
      {/* Watermark */}
      <img src="./bdi-logo.jpeg" className="receipt-watermark" alt="" aria-hidden />

      {/* ── Header ── */}
      <div className="log-header">
        <div className="log-header-left">
          <img src="./bdi-logo.jpeg" alt="BDI" className="log-logo" />
        </div>
        <div className="log-header-center">
          <div className="log-biz-name">{data.issuerName || 'Bulldog Inc.'}</div>
          <div className="log-doc-type">{doc.name.toUpperCase()}</div>
          <div className="log-bdi-tag">BULLDOG INC. · BDI · OFFICIAL RECORD</div>
        </div>
        <div className="log-header-right">
          <div className="log-meta">
            <div className="log-meta-row"><span>Record #</span><strong>{data.docNumber}</strong></div>
            <div className="log-meta-row"><span>Date</span><strong>{fmtDate(data.logDate || data.date)}</strong></div>
            <div className="log-meta-row"><span>Period</span><strong>{data.logPeriod || 'Daily'}</strong></div>
          </div>
        </div>
      </div>

      <div className="receipt-divider gold" />

      {/* ── Keeper info ── */}
      <div className="log-keeper">
        <div className="log-keeper-item">
          <span className="log-keeper-label">Facility / Kennel</span>
          <span className="log-keeper-val">{data.issuerName}</span>
        </div>
        <div className="log-keeper-item">
          <span className="log-keeper-label">Keeper / Handler</span>
          <span className="log-keeper-val">{data.signatureName || '—'}</span>
        </div>
        <div className="log-keeper-item">
          <span className="log-keeper-label">Address</span>
          <span className="log-keeper-val">{[data.issuerAddress, data.issuerCityStateZip].filter(Boolean).join(', ')}</span>
        </div>
        <div className="log-keeper-item">
          <span className="log-keeper-label">Contact</span>
          <span className="log-keeper-val">{[data.issuerPhone, data.issuerEmail].filter(Boolean).join('  ·  ')}</span>
        </div>
      </div>

      <div className="receipt-divider thin" />

      {/* ── Log table ── */}
      <div className="log-table-title">{doc.name} — {fmtDate(data.logDate || data.date)}</div>
      <table className="log-table">
        <thead>
          <tr>
            <th style={{width:'5%'}}>#</th>
            {cols.map((c, i) => (
              <th key={i} style={{width: widths[i] || 'auto'}}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {entries.length > 0
            ? entries.map((row, i) => (
              <tr key={i}>
                <td className="log-num">{i + 1}</td>
                <td>{row.c0}</td>
                <td>{row.c1}</td>
                <td>{row.c2}</td>
                <td>{row.c3}</td>
                <td>{row.c4}</td>
              </tr>
            ))
            : Array(8).fill(null).map((_, i) => (
              <tr key={i} className="log-empty-row">
                <td className="log-num">{i + 1}</td>
                <td /><td /><td /><td /><td />
              </tr>
            ))
          }
        </tbody>
      </table>

      {/* ── Notes ── */}
      <div className="log-notes">
        <strong>Notes / Observations:</strong>
        <div className="log-notes-box">{data.notes || ''}</div>
      </div>

      <div className="receipt-divider thin" />

      {/* ── Signature / Footer ── */}
      <div className="receipt-footer">
        <div className="receipt-sig-block">
          <div className="receipt-sig-line" />
          <div className="receipt-sig-name">{data.signatureName}</div>
          <div className="receipt-sig-title">{data.signatureTitle || 'Handler / Keeper'}</div>
        </div>
        <div className="receipt-stamp-block">
          <img src="./bdi-logo.jpeg" alt="BDI" className="receipt-stamp" />
          <div className="receipt-stamp-text">BDI · QUALITY ASSURED</div>
        </div>
      </div>

      <div className="receipt-fine-print">
        This is an official Bulldog Inc. (BDI) record. · {data.issuerEmail}
      </div>
    </div>
  )
}
