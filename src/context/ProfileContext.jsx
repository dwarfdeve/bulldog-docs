import { createContext, useContext, useState, useEffect } from 'react'

const ProfileContext = createContext(null)

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
  paymentMethods: ['Cash', 'Zelle', 'Venmo', 'Credit Card'],
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

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('bdi-profile')
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
    } catch { return DEFAULTS }
  })

  useEffect(() => {
    localStorage.setItem('bdi-profile', JSON.stringify(profile))
  }, [profile])

  function updateProfile(updates) {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  function completeProfile() {
    setProfile(prev => ({ ...prev, completed: true }))
  }

  function resetProfile() {
    setProfile({ ...DEFAULTS, completed: false })
    localStorage.removeItem('bdi-profile')
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, completeProfile, resetProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
