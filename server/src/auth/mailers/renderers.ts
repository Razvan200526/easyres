import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';

export function renderTemplate(element: ReactElement): string {
  const html = renderToStaticMarkup(element);
  return `<!doctype html>${html}`;
}
