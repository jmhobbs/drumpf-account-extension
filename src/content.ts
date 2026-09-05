import { replaceTrumpAccountMentions } from "./matcher";

const SKIPPED_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT"]);

function isWithinContentEditable(parent: Element): boolean {
  const closest = parent.closest("[contenteditable]");
  if (!closest) return false;
  return closest.getAttribute("contenteditable") !== "false";
}

function shouldSkip(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  if (SKIPPED_TAGS.has(parent.tagName)) return true;
  if (isWithinContentEditable(parent)) return true;
  return false;
}

function applyReplacement(node: Text): void {
  const next = replaceTrumpAccountMentions(node.data);
  if (next !== node.data) node.data = next;
}

function walkTextNodes(root: Node, visit: (node: Text) => void): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    visit(current as Text);
    current = walker.nextNode();
  }
}

export function runInitialPass(root: Node): void {
  walkTextNodes(root, (node) => {
    if (!shouldSkip(node)) applyReplacement(node);
  });
}

export function observeMutations(root: Node): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "characterData") {
        const node = mutation.target as Text;
        if (!shouldSkip(node)) applyReplacement(node);
      } else if (mutation.type === "childList") {
        for (const added of mutation.addedNodes) {
          if (added.nodeType === Node.TEXT_NODE) {
            const node = added as Text;
            if (!shouldSkip(node)) applyReplacement(node);
          } else {
            walkTextNodes(added, (node) => {
              if (!shouldSkip(node)) applyReplacement(node);
            });
          }
        }
      }
    }
  });

  observer.observe(root, { childList: true, subtree: true, characterData: true });
  return observer;
}

if (typeof document !== "undefined") {
  runInitialPass(document.body);
  observeMutations(document.body);
}
