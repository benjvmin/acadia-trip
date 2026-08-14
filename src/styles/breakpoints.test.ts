// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

describe('desktop navigation breakpoint', () => {
  it('replaces the mobile tabbar at 1024px', () => {
    const css = readFileSync(fileURLToPath(new URL('./app.css', import.meta.url)), 'utf8');
    expect(css).toMatch(/@media \(min-width: 1024px\)[\s\S]*nav\.tabbar \{\s*display: none;/);
  });
});
