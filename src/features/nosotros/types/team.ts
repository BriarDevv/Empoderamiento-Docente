export type Tier = "direccion" | "lideres" | "facilitacion";
export type CountryCode = "AR" | "MX" | "CL" | "CO" | "CR";

export interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly tier: Tier;
  readonly country: string;
  readonly countryCode: CountryCode;
  readonly photo: string | null;
  readonly bio: string;
  readonly credentials: readonly string[];
  readonly specialty: string;
  readonly linkedin: string | null;
}
