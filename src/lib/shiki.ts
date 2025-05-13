import {
  createHighlighterCore,
  createOnigurumaEngine,
  HighlighterCore,
} from "shiki";

let highlighter: HighlighterCore;

const initHighlighter = async () => {
  highlighter = await createHighlighterCore({
    themes: [
      import("@shikijs/themes/github-light-default"),
      import("@shikijs/themes/github-dark-default"),
    ],
    langs: [import("@shikijs/langs/c"), import("@shikijs/langs/cpp")],
    engine: createOnigurumaEngine(import("shiki/wasm")),
  });
};

initHighlighter();

export const getHighlighter = () => {
  if (!highlighter) {
    throw new Error(
      "Highlighter not initialized yet! Call initHighlighter() first."
    );
  }
  return highlighter;
};
