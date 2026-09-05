// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { runInitialPass, observeMutations } from "./content";

function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("content script DOM glue", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("replaces matching text already in the DOM on the initial pass", () => {
    document.body.innerHTML = "<p>I have a Trump Account today.</p>";
    runInitialPass(document.body);
    expect(document.body.textContent).toBe("I have a 530A IRA today.");
  });

  it("leaves script, style, textarea, and contenteditable content untouched", () => {
    document.body.innerHTML = `
      <script>var x = "Trump Account";</script>
      <style>.a::before { content: "Trump Account"; }</style>
      <textarea>Trump Account</textarea>
      <div contenteditable="true">Trump Account</div>
      <p>Trump Account</p>
    `;
    runInitialPass(document.body);

    expect(document.querySelector("script")!.textContent).toContain("Trump Account");
    expect(document.querySelector("style")!.textContent).toContain("Trump Account");
    expect(document.querySelector("textarea")!.textContent).toContain("Trump Account");
    expect(document.querySelector("[contenteditable]")!.textContent).toBe("Trump Account");
    expect(document.querySelector("p")!.textContent).toBe("530A IRA");
  });

  it("replaces text in nodes appended after the initial pass, and settles without looping", async () => {
    const observer = observeMutations(document.body);
    try {
      const p = document.createElement("p");
      p.textContent = "Trump Accounts";
      document.body.appendChild(p);

      await flushMicrotasks();

      expect(p.textContent).toBe("530A IRAs");

      const mutationCountBefore = vi.fn();
      const checkObserver = new MutationObserver(mutationCountBefore);
      checkObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

      await flushMicrotasks();

      expect(mutationCountBefore).not.toHaveBeenCalled();
      checkObserver.disconnect();
    } finally {
      observer.disconnect();
    }
  });
});
