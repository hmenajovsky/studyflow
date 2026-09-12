export type InstituteInput = {
  name: string;
  description: string;
  city: string;
  country: string;
};

export function parseInstitute(formData: FormData): InstituteInput {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value.trim() : "";
  };

  return {
    name: get("name"),
    description: get("description"),
    city: get("city"),
    country: get("country"),
  };
}

export function validateInstitute(input: InstituteInput): string | null {
  if (!input.name) return "Le nom de l'institut est requis.";
  if (!input.city) return "La ville est requise.";
  if (!input.country) return "Le pays est requis.";
  return null;
}