import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useLockScroll } from "./useLockScroll";

describe("useLockScroll", () => {
  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("aplica overflow:hidden mientras está locked", () => {
    const { unmount } = renderHook(() => useLockScroll(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
  });

  it("restaura el overflow original al desmontar", () => {
    document.body.style.overflow = "scroll";
    const { unmount } = renderHook(() => useLockScroll(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("no toca el overflow cuando locked es false", () => {
    document.body.style.overflow = "scroll";
    const { unmount } = renderHook(() => useLockScroll(false));
    expect(document.body.style.overflow).toBe("scroll");
    unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("no desbloquea hasta que el último consumidor libera", () => {
    document.body.style.overflow = "scroll";
    const first = renderHook(() => useLockScroll(true));
    const second = renderHook(() => useLockScroll(true));
    expect(document.body.style.overflow).toBe("hidden");

    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    second.unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });
});
