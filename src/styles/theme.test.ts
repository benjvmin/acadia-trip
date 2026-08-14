import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/app.css', 'utf8');

describe('warm travel marketplace theme', () => {
  it('uses an airy surface system with a single coral accent', () => {
    expect(css).toContain('--surface: #ffffff;');
    expect(css).toContain('--accent: #c84850;');
    expect(css).toContain('--radius: 16px;');
    expect(css).toContain('"Avenir Next"');
    const bodyRule = css.match(/body \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(bodyRule).not.toContain('background-image');
  });

  it('gives one dashboard destination personality while keeping audit calm', () => {
    expect(css).not.toContain('.journey-callout::after');
    expect(css).toMatch(/\.route-callout \{[^}]*background: var\(--accent\);[^}]*color: var\(--surface\);/);
    expect(css).toMatch(/\.audit-callout \{[^}]*background: var\(--surface\);[^}]*color: var\(--ink\);/);
  });

  it('uses the same accent for selected navigation and primary actions', () => {
    expect(css).toMatch(/\.ledger-summary \{[^}]*background: var\(--surface\);[^}]*color: var\(--ink\);/);
    expect(css).toMatch(/\.tab\.router-link-active \{[^}]*background: var\(--accent\);/);
    expect(css).toMatch(/\.expense-form button \{[^}]*background: var\(--accent\);/);
    expect(css).toMatch(/body:has\(\.unlock\) \{[^}]*background: var\(--ink\);/);
  });
});
