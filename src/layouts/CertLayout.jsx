// Wraps the existing Certificate component for the pedigree doc type
import Certificate from '../components/Certificate'

export default function CertLayout({ doc, data, handlers, setNested }) {
  // Map the flat data state to the shape Certificate.jsx expects
  const certData = {
    certType:   data.certType   || 'Heritage Pedigree',
    certNumber: data.certNumber || data.docNumber,
    dogName:    data.dogName2   || '',
    regNumber:  data.regNumber  || '',
    breed:      data.breed      || 'French Bulldog',
    sex:        data.sex        || 'Male',
    color:      data.color      || '',
    dob:        data.dob        || '',
    breeder:    data.breeder    || data.signatureName || '',
    owner:      data.owner      || '',
    sire:     data.sire     || { name:'', reg:'', color:'' },
    dam:      data.dam      || { name:'', reg:'', color:'' },
    siresSire: data.siresSire || { name:'', reg:'', color:'' },
    siresDam:  data.siresDam  || { name:'', reg:'', color:'' },
    damsSire:  data.damsSire  || { name:'', reg:'', color:'' },
    damsDam:   data.damsDam   || { name:'', reg:'', color:'' },
    ssss: data.ssss || {name:'',reg:''}, sssd: data.sssd || {name:'',reg:''},
    ssds: data.ssds || {name:'',reg:''}, ssdd: data.ssdd || {name:'',reg:''},
    sdss: data.sdss || {name:'',reg:''}, sdsd: data.sdsd || {name:'',reg:''},
    sdds: data.sdds || {name:'',reg:''}, sddd: data.sddd || {name:'',reg:''},
    g4ss1: data.g4ss1||'', g4ss2: data.g4ss2||'', g4ss3: data.g4ss3||'', g4ss4: data.g4ss4||'',
    g4ss5: data.g4ss5||'', g4ss6: data.g4ss6||'', g4ss7: data.g4ss7||'', g4ss8: data.g4ss8||'',
    g4ds1: data.g4ds1||'', g4ds2: data.g4ds2||'', g4ds3: data.g4ds3||'', g4ds4: data.g4ds4||'',
    g4ds5: data.g4ds5||'', g4ds6: data.g4ds6||'', g4ds7: data.g4ds7||'', g4ds8: data.g4ds8||'',
  }

  return <Certificate data={certData} />
}
