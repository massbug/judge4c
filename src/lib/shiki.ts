import { createHighlighter, Highlighter } from "shiki";

let highlighter: Highlighter;

async function initializeHighlighter() {
  highlighter = await createHighlighter({
    themes: ["github-light-default", "github-dark-default"],
    langs: ["c"],
  });
}

initializeHighlighter();

export { highlighter };
