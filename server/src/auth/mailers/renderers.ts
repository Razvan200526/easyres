import type { HtmlEscapedString } from 'hono/utils/html';

export async function renderTemplate(
  element: Promise<HtmlEscapedString> | HtmlEscapedString,
): Promise<string> {
  return `<!doctype html>${await element}`;
}
