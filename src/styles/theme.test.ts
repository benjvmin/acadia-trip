import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const css = readFileSync('src/styles/app.css', 'utf8');

describe('quiet field guide theme', () => {
  it('uses one neutral surface system without decorative page texture', () => {
    expect(css).toContain('--surface: #faf7ef;');
    const bodyRule = css.match(/body \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(bodyRule).not.toContain('background-image');
  });

  it('keeps dashboard navigation neutral and removes ornamental callout art', () => {
    expect(css).not.toContain('.journey-callout::after');
    expect(css).toMatch(/\.route-callout \{[^}]*background: var\(--surface\);[^}]*color: var\(--ink\);/);
    expect(css).toMatch(/\.audit-callout \{[^}]*background: var\(--surface\);[^}]*color: var\(--ink\);/);
  });

  it('reserves dark spruce fills for actions and the unlock screen', () => {
    expect(css).toMatch(/\.ledger-summary \{[^}]*background: var\(--surface\);[^}]*color: var\(--ink\);/);
    expect(css).toMatch(/\.expense-form button \{[^}]*background: var\(--spruce\);/);
    expect(css).toMatch(/body:has\(\.unlock\) \{[^}]*background: var\(--spruce\);/);
  });
});
