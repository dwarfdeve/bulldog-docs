// Central registry of all 19 document types

export const CATEGORIES = [
  'Sales & Revenue',
  'Purchases',
  'Services',
  'Food Logs',
  'Medical & Health',
  'Finance',
  'Certificates',
]

export const DOCS = [
  // ── Sales & Revenue ──────────────────────────────────────────
  {
    id: 'sales-receipt', name: 'Sales Receipt', icon: '🧾',
    category: 'Sales & Revenue', color: '#16a34a',
    layout: 'receipt', prefix: 'SR',
    recipientLabel: 'SOLD TO',
    description: 'Customer purchase receipt for goods or services sold',
  },
  {
    id: 'invoice', name: 'Invoice', icon: '📄',
    category: 'Sales & Revenue', color: '#15803d',
    layout: 'receipt', prefix: 'INV',
    recipientLabel: 'BILLED TO',
    description: 'Formal billing invoice for clients',
    isInvoice: true,
  },
  {
    id: 'puppy-sale', name: 'Puppy Sale Receipt', icon: '🐶',
    category: 'Sales & Revenue', color: '#166534',
    layout: 'receipt', prefix: 'PS',
    recipientLabel: 'PURCHASED BY',
    description: 'Official puppy sale document with dog details',
    dogFields: true,
  },
  {
    id: 'breeding-service', name: 'Breeding Service', icon: '🐕',
    category: 'Sales & Revenue', color: '#14532d',
    layout: 'receipt', prefix: 'BS',
    recipientLabel: 'SERVICE PROVIDED TO',
    description: 'Stud service and breeding contract receipt',
    dogFields: true,
  },

  // ── Purchases ────────────────────────────────────────────────
  {
    id: 'purchase-receipt', name: 'Purchase Receipt', icon: '🛒',
    category: 'Purchases', color: '#ca8a04',
    layout: 'receipt', prefix: 'PR',
    recipientLabel: 'PURCHASED FROM',
    description: 'Receipt for goods and supplies purchased',
    isPurchase: true,
  },
  {
    id: 'petty-cash', name: 'Petty Cash Receipt', icon: '💵',
    category: 'Purchases', color: '#a16207',
    layout: 'receipt', prefix: 'PC',
    recipientLabel: 'VENDOR',
    description: 'Small cash transaction record',
    isPurchase: true,
  },
  {
    id: 'pet-food', name: 'Pet Food Receipt', icon: '🛍',
    category: 'Purchases', color: '#92400e',
    layout: 'receipt', prefix: 'PF',
    recipientLabel: 'PURCHASED FROM',
    description: 'Pet food and supply purchase receipt',
    isPurchase: true,
  },

  // ── Services ─────────────────────────────────────────────────
  {
    id: 'service-receipt', name: 'Service Receipt', icon: '🔧',
    category: 'Services', color: '#7c3aed',
    layout: 'receipt', prefix: 'SV',
    recipientLabel: 'SERVICE PROVIDED TO',
    description: 'Service completion receipt',
  },
  {
    id: 'grooming', name: 'Grooming Receipt', icon: '✂️',
    category: 'Services', color: '#6d28d9',
    layout: 'receipt', prefix: 'GR',
    recipientLabel: 'GROOMED FOR',
    description: 'Professional grooming services',
    dogFields: true,
  },
  {
    id: 'boarding', name: 'Boarding Receipt', icon: '🏠',
    category: 'Services', color: '#5b21b6',
    layout: 'receipt', prefix: 'BO',
    recipientLabel: 'BOARDED FOR',
    description: 'Boarding and daycare services',
    dogFields: true,
    dateRange: true,
  },

  // ── Food Logs ────────────────────────────────────────────────
  {
    id: 'food-consumption', name: 'Food Consumption Log', icon: '🍖',
    category: 'Food Logs', color: '#ea580c',
    layout: 'log', prefix: 'FC',
    description: 'Daily feeding and food consumption records',
    dogFields: true,
    logColumns: ['Dog Name / ID', 'AM Feed', 'PM Feed', 'Water Intake', 'Notes'],
    logColumnWidths: ['22%', '16%', '16%', '16%', '30%'],
  },
  {
    id: 'feed-supplement', name: 'Feed / Supplement Log', icon: '💊',
    category: 'Food Logs', color: '#c2410c',
    layout: 'log', prefix: 'FS',
    description: 'Nutritional supplement and feeding tracker',
    dogFields: true,
    logColumns: ['Dog Name / ID', 'Supplement / Food', 'Amount', 'Time Given', 'Notes'],
    logColumnWidths: ['22%', '26%', '14%', '14%', '24%'],
  },
  {
    id: 'meal-expense', name: 'Meal Expense Report', icon: '🍽',
    category: 'Food Logs', color: '#9a3412',
    layout: 'receipt', prefix: 'ME',
    recipientLabel: 'BUSINESS PURPOSE / GUESTS',
    description: 'Business meal and entertainment expenses',
  },

  // ── Medical & Health ─────────────────────────────────────────
  {
    id: 'vet-receipt', name: 'Vet Receipt', icon: '🏥',
    category: 'Medical & Health', color: '#0d9488',
    layout: 'receipt', prefix: 'VR',
    recipientLabel: 'CLINIC / PROVIDER',
    description: 'Veterinary visit and treatment record',
    dogFields: true,
    isPurchase: true,
  },
  {
    id: 'vaccination', name: 'Vaccination Record', icon: '💉',
    category: 'Medical & Health', color: '#0f766e',
    layout: 'log', prefix: 'VAC',
    description: 'Official vaccination tracking document',
    dogFields: true,
    logColumns: ['Dog Name / ID', 'Vaccine Type', 'Date Given', 'Next Due Date', 'Lot # / Vet'],
    logColumnWidths: ['20%', '22%', '16%', '16%', '26%'],
  },

  // ── Finance ──────────────────────────────────────────────────
  {
    id: 'expense-report', name: 'Expense Report', icon: '📊',
    category: 'Finance', color: '#1d4ed8',
    layout: 'receipt', prefix: 'ER',
    recipientLabel: 'SUBMITTED BY',
    description: 'Business expense tracking and reimbursement',
    isPurchase: true,
  },
  {
    id: 'delivery', name: 'Delivery Receipt', icon: '📦',
    category: 'Finance', color: '#1e40af',
    layout: 'receipt', prefix: 'DL',
    recipientLabel: 'DELIVERED TO',
    description: 'Proof of delivery acknowledgment',
  },
  {
    id: 'donation', name: 'Donation Receipt', icon: '❤️',
    category: 'Finance', color: '#dc2626',
    layout: 'receipt', prefix: 'DN',
    recipientLabel: 'DONOR',
    description: 'Charitable donation acknowledgment',
    isDonation: true,
  },

  // ── Certificates ─────────────────────────────────────────────
  {
    id: 'pedigree', name: 'Pedigree Certificate', icon: '📜',
    category: 'Certificates', color: '#78716c',
    layout: 'cert', prefix: 'PED',
    description: 'Heritage pedigree certificate (AKC/UKC style)',
  },
]

export function getDoc(id) {
  return DOCS.find(d => d.id === id)
}

export function getDocsByCategory() {
  const map = {}
  CATEGORIES.forEach(cat => { map[cat] = [] })
  DOCS.forEach(doc => {
    if (map[doc.category]) map[doc.category].push(doc)
  })
  return map
}

// Auto-generate doc number and store counter in localStorage
export function nextDocNumber(prefix) {
  const key = `bdi-counter-${prefix}`
  const n = parseInt(localStorage.getItem(key) || '0', 10) + 1
  localStorage.setItem(key, String(n))
  return `BDI-${prefix}-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`
}

// Build initial form state for a document
export function buildInitialState(doc, profile) {
  const today = new Date().toISOString().split('T')[0]
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
  const address = [profile.street, `${profile.city}, ${profile.state} ${profile.zip}`]
    .filter(Boolean).join(', ')

  const base = {
    docNumber: nextDocNumber(doc.prefix),
    date: today,
    dateEnd: today,

    // Issuer (always pre-filled)
    issuerName: profile.businessName || 'Bulldog Inc.',
    issuerTitle: profile.title || '',
    issuerAddress: profile.street || '',
    issuerCityStateZip: `${profile.city || ''}, ${profile.state || ''} ${profile.zip || ''}`,
    issuerPhone: profile.phone || '',
    issuerEmail: profile.email || '',
    issuerWebsite: profile.website || '',
    issuerTaxId: profile.taxId || '',
    issuerLicense: profile.licenseNum || '',

    // Recipient
    recipientName: '',
    recipientAddress: '',
    recipientPhone: '',
    recipientEmail: '',

    // Dog info (for dogFields docs)
    dogName: '',
    dogBreed: profile.defaultBreed || 'French Bulldog',
    dogDob: '',
    dogColor: '',
    dogSex: 'Male',
    dogRegNum: '',
    dogMicrochip: '',

    // Line items
    items: profile.commonItems?.length
      ? [{ description: profile.commonItems[0].name, qty: '1', price: profile.commonItems[0].price }]
      : [{ description: '', qty: '1', price: '' }],

    // Totals
    taxRate: profile.taxRate || '0',
    discount: '0',

    // Log entries (for log layout)
    logDate: today,
    logPeriod: 'Daily',
    logEntries: Array(5).fill(null).map(() => ({
      c0: '', c1: '', c2: '', c3: '', c4: '',
    })),

    // Footer
    paymentMethod: profile.paymentMethods?.[0] || 'Cash',
    notes: '',
    terms: doc.isInvoice ? 'Payment due within 30 days.' : '',
    signatureName: fullName,
    signatureTitle: profile.title || 'Owner',

    // Cert (pedigree) state — matches Certificate.jsx expectations
    certType: 'Heritage Pedigree',
    certNumber: nextDocNumber('PED'),
    dogName2: '', regNumber: '', breed: profile.defaultBreed || 'French Bulldog',
    sex: 'Male', color: '', dob: '', breeder: fullName, owner: '',
    sire: { name: '', reg: '', color: '' }, dam: { name: '', reg: '', color: '' },
    siresSire: { name: '', reg: '', color: '' }, siresDam: { name: '', reg: '', color: '' },
    damsSire: { name: '', reg: '', color: '' }, damsDam:  { name: '', reg: '', color: '' },
    ssss:{name:'',reg:''}, sssd:{name:'',reg:''}, ssds:{name:'',reg:''}, ssdd:{name:'',reg:''},
    sdss:{name:'',reg:''}, sdsd:{name:'',reg:''}, sdds:{name:'',reg:''}, sddd:{name:'',reg:''},
    g4ss1:'',g4ss2:'',g4ss3:'',g4ss4:'',g4ss5:'',g4ss6:'',g4ss7:'',g4ss8:'',
    g4ds1:'',g4ds2:'',g4ds3:'',g4ds4:'',g4ds5:'',g4ds6:'',g4ds7:'',g4ds8:'',
  }

  return base
}
