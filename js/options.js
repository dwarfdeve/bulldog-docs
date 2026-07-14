// Shared dropdown option lists — used across the questionnaire and document forms
// so every relevant field offers a fast, comprehensive dropdown instead of
// free typing, while still allowing a custom value when needed.

export const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC',
]

export const TITLES = [
  'Owner & Breeder',
  'Owner',
  'Breeder',
  'Co-Owner',
  'Kennel Manager',
  'Handler',
  'Stud Manager',
  'Veterinarian',
  'Office Manager',
]

// Breed list — Bulldog family first (this business's focus), plus common
// related breeds a multi-breed kennel might also produce or service.
export const BREEDS = [
  'French Bulldog',
  'English Bulldog',
  'American Bulldog',
  'Olde English Bulldogge',
  'Victorian Bulldog',
  'American Bully',
  'Mini French Bulldog',
  'French Bulldog Mix',
  'English Bulldog Mix',
  'Boston Terrier',
  'Pug',
  'Other',
]

// Colors & markings — French Bulldog AKC/UKC-recognized standard colors plus
// the common non-standard ("rare") colors seen across bulldog kennels today.
export const COLORS = [
  // Standard
  'Fawn',
  'Cream',
  'White',
  'Brindle',
  'Fawn Brindle',
  'Brindle & White (Pied)',
  'Fawn & White (Pied)',
  'White & Brindle',
  'White & Fawn',
  'Black Brindle',
  // Non-standard / rare
  'Blue',
  'Blue Fawn',
  'Blue Brindle',
  'Blue Pied',
  'Chocolate',
  'Chocolate Brindle',
  'Chocolate Pied',
  'Lilac',
  'Lilac Fawn',
  'Lilac Pied',
  'Isabella',
  'Black',
  'Black & Tan',
  'Blue & Tan',
  'Chocolate & Tan',
  'Merle',
  'Blue Merle',
  'Chocolate Merle',
  'Sable',
  'Platinum',
  'Tan Points',
]

// Common vaccines / preventatives tracked for puppies and adults
export const VACCINES = [
  'Rabies',
  'DHPP (Distemper/Parvo Combo)',
  'DHLPP',
  'Bordetella',
  'Leptospirosis',
  'Canine Influenza (CIV)',
  'Lyme Disease',
  'Parvovirus',
  'Coronavirus',
  'Heartworm Preventative',
  'Flea & Tick Preventative',
  'Deworming',
]
