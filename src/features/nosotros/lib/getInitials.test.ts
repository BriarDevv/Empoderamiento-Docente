import { describe, expect, it } from "vitest";
import { getInitials } from "./getInitials";

describe("getInitials", () => {
  it("toma las dos primeras letras cuando hay un solo token", () => {
    expect(getInitials("Daniela")).toBe("DA");
  });

  it("toma primera y última inicial cuando hay dos tokens", () => {
    expect(getInitials("Daniela Reyes")).toBe("DR");
  });

  it("ignora tokens del medio en nombres compuestos largos", () => {
    expect(getInitials("Pedro Vidal-Szabo Antunes")).toBe("PA");
  });

  it("colapsa espacios múltiples", () => {
    expect(getInitials("Karla   Gómez")).toBe("KG");
  });

  it("recorta espacios al inicio y al final", () => {
    expect(getInitials("  Iván Pérez  ")).toBe("IP");
  });

  it("devuelve cadena vacía cuando el nombre está vacío", () => {
    expect(getInitials("")).toBe("");
    expect(getInitials("   ")).toBe("");
  });

  it("siempre devuelve mayúsculas", () => {
    expect(getInitials("daniela reyes")).toBe("DR");
    expect(getInitials("daniela")).toBe("DA");
  });
});
