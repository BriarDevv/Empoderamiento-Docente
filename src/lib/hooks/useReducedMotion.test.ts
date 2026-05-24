import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "./useReducedMotion";

type Listener = (e: MediaQueryListEvent) => void;

interface MockMediaQueryList {
  matches: boolean;
  media: string;
  addEventListener: (type: "change", l: Listener) => void;
  removeEventListener: (type: "change", l: Listener) => void;
  fire: (matches: boolean) => void;
  __listeners: Set<Listener>;
}

function installMatchMedia(initial: boolean) {
  const cache = new Map<string, MockMediaQueryList>();
  const factory = vi.fn((query: string): MockMediaQueryList => {
    const cached = cache.get(query);
    if (cached) return cached;
    const listeners = new Set<Listener>();
    const mql: MockMediaQueryList = {
      matches: initial,
      media: query,
      addEventListener: (_type, l) => {
        listeners.add(l);
      },
      removeEventListener: (_type, l) => {
        listeners.delete(l);
      },
      __listeners: listeners,
      fire(matches) {
        this.matches = matches;
        for (const l of listeners) {
          l({ matches } as MediaQueryListEvent);
        }
      },
    };
    cache.set(query, mql);
    return mql;
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: factory,
  });
  return { factory, cache };
}

describe("useReducedMotion", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: originalMatchMedia,
    });
  });

  it("devuelve false cuando el SO no solicita reduced-motion", () => {
    installMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("devuelve true cuando el SO solicita reduced-motion", () => {
    installMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it("re-renderiza cuando el usuario cambia la preferencia en vivo", () => {
    const { cache } = installMatchMedia(false);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      const mql = cache.get("(prefers-reduced-motion: reduce)")!;
      mql.fire(true);
    });
    expect(result.current).toBe(true);
  });

  it("limpia el listener al desmontar", () => {
    const { cache } = installMatchMedia(false);
    const { unmount } = renderHook(() => useReducedMotion());
    const mql = cache.get("(prefers-reduced-motion: reduce)")!;
    expect(mql.__listeners.size).toBeGreaterThan(0);
    unmount();
    expect(mql.__listeners.size).toBe(0);
  });
});
