// Printable receipt / invoice layout used by 16 of the 19 document types
import bdiLogo from '../assets/bdi-logo.jpeg'

function fmtDate(d) {
  if (!d) return '—'
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
}

function fmtMoney(n) {
  return '$' + parseFloat(n||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export default function ReceiptLayout({ doc, data, computed }) {
  const lineTotal = (it) => {
    const q = parseFloat(it.qty || 1)
    const p = parseFloat(it.price || 0)
    return q * p
  }

  return (
    <div className="receipt-wrap">
      {/* Watermark */}
      <img src={bdiLogo} className="receipt-watermark" alt="" aria-hidden />

      {/* ── Header ── */}
      <div className="receipt-header">
        <div className="receipt-header-left">
          <img src={bdiLogo} alt="BDI" className="receipt-logo" />
        </div>
        <div className="receipt-header-right">
          <div className="receipt-biz-name">{data.issuerName || 'Bulldog Inc.'}</div>
          {data.issuerTitle && <div className="receipt-biz-sub">{data.issuerTitle}</div>}
          {data.issuerAddress && <div className="receipt-biz-detail">{data.issuerAddress}</div>}
          {data.issuerCityStateZip && <div className="receipt-biz-detail">{data.issuerCityStateZip}</div>}
          <div className="receipt-biz-detail">
            {[data.issuerPhone, data.issuerEmail, data.issuerWebsite].filter(Boolean).join('  ·  ')}
          </div>
          {data.issuerTaxId && <div className="receipt-biz-detail">Tax ID: {data.issuerTaxId}</div>}
        </div>
      </div>

      <div className="receipt-divider gold" />

      {/* ── Document title + meta ── */}
      <div className="receipt-title-row">
        <div>
          <div className="receipt-doc-type">{doc.name.toUpperCase()}</div>
          <div className="receipt-doc-bdi">BULLDOG INC. · BDI</div>
        </div>
        <div className="receipt-meta">
          <div className="receipt-meta-row">
            <span>Document #</span><strong>{data.docNumber}</strong>
          </div>
          <div className="receipt-meta-row">
            <span>Date</span><strong>{fmtDate(data.date)}</strong>
          </div>
          {doc.dateRange && data.dateEnd && (
            <div className="receipt-meta-row">
              <span>Check-out</span><strong>{fmtDate(data.dateEnd)}</strong>
            </div>
          )}
          {doc.isInvoice && (
            <div className="receipt-meta-row">
              <span>Due Date</span><strong>{fmtDate(data.dateEnd)}</strong>
            </div>
          )}
        </div>
      </div>

      <div className="receipt-divider thin" />

      {/* ── Parties ── */}
      <div className="receipt-parties">
        <div className="receipt-party">
          <div className="receipt-party-label">
            {doc.isPurchase ? 'ISSUED BY' : 'FROM'}
          </div>
          <div className="receipt-party-name">{data.issuerName}</div>
          <div className="receipt-party-detail">{data.issuerAddress}</div>
          <div className="receipt-party-detail">{data.issuerCityStateZip}</div>
          <div className="receipt-party-detail">{data.issuerPhone}</div>
          <div className="receipt-party-detail">{data.issuerEmail}</div>
        </div>

        <div className="receipt-party-arrow">→</div>

        <div className="receipt-party">
          <div className="receipt-party-label">{doc.recipientLabel || 'TO'}</div>
          <div className="receipt-party-name">{data.recipientName || '________________________'}</div>
          <div className="receipt-party-detail">{data.recipientAddress}</div>
          <div className="receipt-party-detail">{data.recipientPhone}</div>
          <div className="receipt-party-detail">{data.recipientEmail}</div>
        </div>
      </div>

      {/* ── Dog info block ── */}
      {doc.dogFields && (data.dogName || data.dogBreed) && (
        <>
          <div className="receipt-divider thin" />
          <div className="receipt-dog-block">
            <div className="receipt-dog-label">ANIMAL / DOG INFORMATION</div>
            <div className="receipt-dog-grid">
              {[
                ['Name', data.dogName],
                ['Breed', data.dogBreed],
                ['Date of Birth', fmtDate(data.dogDob)],
                ['Sex', data.dogSex],
                ['Color', data.dogColor],
                ['Reg / ID #', data.dogRegNum],
                data.dogMicrochip ? ['Microchip #', data.dogMicrochip] : null,
              ].filter(Boolean).map(([k,v]) => v ? (
                <div key={k} className="receipt-dog-cell">
                  <span className="receipt-dog-key">{k}</span>
                  <span className="receipt-dog-val">{v}</span>
                </div>
              ) : null)}
            </div>
          </div>
        </>
      )}

      <div className="receipt-divider thin" />

      {/* ── Line items ── */}
      <table className="receipt-items">
        <thead>
          <tr>
            <th className="item-desc">Description</th>
            <th className="item-num">Qty</th>
            <th className="item-num">Unit Price</th>
            <th className="item-num">Amount</th>
          </tr>
        </thead>
        <tbody>
          {(data.items || []).map((it, i) => (
            <tr key={i}>
              <td className="item-desc">{it.description || '—'}</td>
              <td className="item-num">{it.qty || 1}</td>
              <td className="item-num">{fmtMoney(it.price)}</td>
              <td className="item-num">{fmtMoney(lineTotal(it))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Totals ── */}
      <div className="receipt-totals">
        <div className="receipt-total-row">
          <span>Subtotal</span><span>{fmtMoney(computed.subtotal)}</span>
        </div>
        {parseFloat(data.taxRate) > 0 && (
          <div className="receipt-total-row">
            <span>Tax ({data.taxRate}%)</span><span>{fmtMoney(computed.taxAmt)}</span>
          </div>
        )}
        {parseFloat(data.discount) > 0 && (
          <div className="receipt-total-row">
            <span>Discount</span><span>-{fmtMoney(computed.discount)}</span>
          </div>
        )}
        <div className="receipt-total-row total-final">
          <span>{doc.isDonation ? 'DONATION AMOUNT' : 'TOTAL'}</span>
          <span>{fmtMoney(computed.total)}</span>
        </div>
        <div className="receipt-total-row">
          <span>Payment Method</span><span>{data.paymentMethod}</span>
        </div>
      </div>

      {/* ── Notes / Terms ── */}
      {(data.notes || data.terms) && (
        <div className="receipt-notes">
          {data.notes && (
            <div><strong>Notes:</strong> {data.notes}</div>
          )}
          {data.terms && (
            <div style={{marginTop:4}}><strong>Terms:</strong> {data.terms}</div>
          )}
          {doc.isDonation && (
            <div style={{marginTop:6,fontStyle:'italic',fontSize:'0.68rem'}}>
              Bulldog Inc. is organized under applicable law. No goods or services were provided in exchange for this donation. This receipt serves as your official acknowledgment.
            </div>
          )}
        </div>
      )}

      <div className="receipt-divider thin" />

      {/* ── Signature / Footer ── */}
      <div className="receipt-footer">
        <div className="receipt-sig-block">
          <div className="receipt-sig-line" />
          <div className="receipt-sig-name">{data.signatureName}</div>
          <div className="receipt-sig-title">{data.signatureTitle}</div>
        </div>
        <div className="receipt-stamp-block">
          <img src={bdiLogo} alt="BDI" className="receipt-stamp" />
          <div className="receipt-stamp-text">BDI · QUALITY ASSURED</div>
        </div>
      </div>

      <div className="receipt-fine-print">
        Thank you for your business. · Bulldog Inc. (BDI) · {data.issuerEmail}
      </div>
    </div>
  )
}
