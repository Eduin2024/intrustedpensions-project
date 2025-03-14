export interface ReferenceItem {
  value: string;
  label: string;
}

export const countries: ReferenceItem[] = [
  { value: "GB", label: "United Kingdom" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "FR", label: "France" },
  { value: "DE", label: "Germany" },
  // Add more countries as needed
];

export const addressTypes: ReferenceItem[] = [
  { value: "residential", label: "Residential" },
  { value: "business", label: "Business" },
  { value: "postal", label: "Postal" },
]; 

export const titles = [
  { value: "mr", label: "Mr." },
  { value: "mrs", label: "Mrs." },
  { value: "miss", label: "Miss" },
  { value: "dr", label: "Dr." },
  // Add more titles
];

export const genderOptions: ReferenceItem[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" }
];

export const employmentTypes: ReferenceItem[] = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "temporary", label: "Temporary" },
  { value: "self_employed", label: "Self Employed" }
];

export const marketingPreferences: ReferenceItem[] = [
  { value: "email", label: "Email" },
  { value: "post", label: "Post" },
  { value: "sms", label: "SMS" },
  { value: "phone", label: "Phone" },
  { value: "none", label: "No Marketing" }
];

export const nationalities: ReferenceItem[] = [
  { value: "british", label: "British" },
  { value: "american", label: "American" },
  { value: "canadian", label: "Canadian" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "indian", label: "Indian" },
  { value: "australian", label: "Australian" },
  { value: "new_zealand", label: "New Zealand" },
  { value: "south_african", label: "South African" },
  { value: "other", label: "Other" }
];
