export interface CompanySettings {
  companyName: string;
  crmv: string;
  mapaRegistration: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  email: string;
  logoUrl?: string;
}

export interface UserSettings {
  userName: string;
  userEmail: string;
  userCrmv: string;
  userMapaRegistration: string;
  signatureText: string;
}