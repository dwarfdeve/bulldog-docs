// Simple localStorage-backed profile store (replaces React ProfileContext)

const DEFAULTS = {
  // Step 1 – Identity
  firstName: 'John',
  lastName: 'Doe',
  businessName: 'Bulldog Inc.',
  title: 'Breeder & Owner',
  estYear: '2020',
  // Step 2 – Contact
  street: '123 Kennel Lane',
  city: 'Atlanta',
  state: 'GA',
  zip: '30301',
  phone: '(404) 555-0100',
  email: 'info@bulldoginc.com',
  website: 'www.bulldoginc.com',
  // Step 3 – Business
  taxId: '',
  licenseNum: '',
  defaultBreed: 'French Bulldog',
  taxRate: '0',
  paymentMethods: ['Cash', 'Zelle', 'Venmo', 'PayPal', 'Credit Card', 'Gift Card', 'Cryptocurrency'],
  commonItems: [
    { name: 'French Bulldog Puppy', price: '3500' },
    { name: 'Stud Service Fee', price: '1500' },
    { name: 'Royal Canin Bulldog Adult (17.6 lb)', price: '65' },
    { name: 'Veterinary Exam', price: '75' },
    { name: 'Vaccination (Combo)', price: '45' },
  ],
  // Internal
  completed: false,
}

let profile = load()

function load() {
  try {
    const saved = localStorage.getItem('bdi-profile')
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

function persist() {
  localStorage.setItem('bdi-profile', JSON.stringify(profile))
}

export function getProfile() {
  return profile
}

export function updateProfile(updates) {
  profile = { ...profile, ...updates }
  persist()
  return profile
}

export function completeProfile() {
  profile = { ...profile, completed: true }
  persist()
  return profile
}

export function resetProfile() {
  profile = { ...DEFAULTS, completed: false }
  localStorage.removeItem('bdi-profile')
  return profile
}
