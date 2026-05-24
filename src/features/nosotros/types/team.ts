export type Tier = "direccion" | "lideres" | "facilitacion";
export type CountryCode = "AR" | "MX" | "CL" | "CO" | "CR";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: Tier;
  country: string;
  countryCode: CountryCode;
  photo: string | null;
  bio: string;
  credentials: string[];
  specialty: string;
  linkedin: string;
}
