import { describe, expect, it } from "vitest";
import { parseInstitute, validateInstitute } from "../institute";

describe("validateInstitute", () => {
  it("accepte un institut complet", () => {
    expect(
      validateInstitute({
        name: "Institut de Recherche de Paris",
        description: "Centre de référence.",
        city: "Paris",
        country: "France",
      }),
    ).toBeNull();
  });

  it("refuse un nom manquant", () => {
    expect(
      validateInstitute({
        name: "",
        description: "Centre de référence.",
        city: "Paris",
        country: "France",
      }),
    ).toBe("Le nom de l'institut est requis.");
  });

  it("refuse une ville manquante", () => {
    expect(
      validateInstitute({
        name: "Institut de Paris",
        description: "Centre de référence.",
        city: "",
        country: "France",
      }),
    ).toBe("La ville est requise.");
  });

  it("refuse un pays manquant", () => {
    expect(
      validateInstitute({
        name: "Institut de Paris",
        description: "Centre de référence.",
        city: "Paris",
        country: "",
      }),
    ).toBe("Le pays est requis.");
  });
});

describe("parseInstitute", () => {
  it("extrait les champs du formulaire en les nettoyant", () => {
    const formData = new FormData();
    formData.set("name", "  Institut de Paris  ");
    formData.set("description", "  Centre de référence. ");
    formData.set("city", "  Paris ");
    formData.set("country", " France ");

    expect(parseInstitute(formData)).toEqual({
      name: "Institut de Paris",
      description: "Centre de référence.",
      city: "Paris",
      country: "France",
    });
  });

  it("renvoie une chaîne vide pour un champ absent", () => {
    const formData = new FormData();
    formData.set("name", "Institut de Paris");

    expect(parseInstitute(formData)).toEqual({
      name: "Institut de Paris",
      description: "",
      city: "",
      country: "",
    });
  });
});