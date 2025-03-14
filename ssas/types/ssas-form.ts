// types/ssas-form.ts
export interface CorporateFormData {
    // Contact Details
    pstrId: string;
    pensionSchemeName: string;
    contactName: string;
    positionInOrganization: string;
    pensionProvider: string;
    telephone: string;
    mobile: string;
    email: string;
    
    // Address Details
    addressType: string;
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postcode: string;
    country: string;
    isCurrentAddress: boolean;
    isPermanentAddress: boolean;
    isCommunicationAddress: boolean;
    
    // Pension Scheme Details
    howManyToSign: number;
    howManyFromCorporateTrustee: number;
    howManyMembers: number;
    isOccupationalScheme: boolean;
    permitAssignmentOfInterest: boolean;
    hasDeductionFromEmployeeWages: boolean;
    dateOfRegistration: string;
    hasCorporateTrustee: boolean;
    depositPerAnnum: number;
    annualOutgoings: number;
    anticipatedActivity: number;
    anticipatedTransactions: number;
    countryOfPayments: string[];
    schemeRegistrationCountry: string;
    
    // Principal Employer Details
    contributorLegalName: string;
    contributorTradingName: string;
    contributorAddress1: string;
    contributorAddress2: string;
    contributorAddress3: string;
    contributorAddress4: string;
    contributorPostcode: string;
    contributorCountry: string;
    contributorDateOfIncorporation: string;
    contributorDateOfRegistration: string;
    contributorDateStartedTrading: string;
    contributorNatureOfBusiness: string;
    contributorCountriesOperatesIn: string[];
    contributorManagement: Array<{
      firstName: string;
      middleName: string;
      surname: string;
      position: string;
    }>;
    
    // Co-sign Details
    professionalCoSignatory: string;
    coSignCompanyName: string;
    coSignAddress: string;
    coSignTelephone: string;
    coSignEmail: string;
    regulatorReferenceNumber: string;
    
    // Account Details
    tcAcknowledgement: boolean;
    accountType: string[];
    openingBalance: string;
    sourceOfInitialFunds: string;
    sourceOfFunds: string[];
    otherSourceOfFunds: string;
    valueOfFunds: string;
    countryOfFunds: string[];
  }
  
  export interface IndividualFormData {
    // Individual Contact Details
    pstrId: string;
    employeeId: number;
    title: string;
    firstName: string;
    middleName: string;
    surname: string;
    isSigner: boolean;
    isTrusteeOfScheme: boolean;
    dateOfBirth: string;
    gender: string;
    primaryNationality: string;
    countryOfBirth: string;
    hasDualNationality: boolean;
    secondNationality: string;
    telephone: string;
    mobile: string;
    email: string;
    typeOfEmployment: string;
    occupation: string;
    marketingPreferences: string[];
    
    // Individual Address Details
    address1: string;
    address2: string;
    address3: string;
    address4: string;
    postcode: string;
    country: string;
    isCurrentAddress: boolean;
    isPermanentAddress: boolean;
    isCommunicationAddress: boolean;
    yearsAtAddress: number;
    monthsAtAddress: number;
    previousAddresses: Array<{
      address1: string;
      address2: string;
      address3: string;
      address4: string;
      postcode: string;
      country: string;
      yearsAtAddress: number;
      monthsAtAddress: number;
    }>;
    communicationAddress: {
      address1: string;
      address2: string;
      address3: string;
      address4: string;
      postcode: string;
      country: string;
    };
    taxContributingCountry: string[];
    foreignTinId: string;
  }
  