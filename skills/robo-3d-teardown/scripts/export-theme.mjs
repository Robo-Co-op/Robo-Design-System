#!/usr/bin/env node
/** Portable theme bridge for Robo-branded Three.js stages and HTML HUDs.
 * Reads only the resolved token export produced by `npm run tokens`.
 * No third-party runtime and no modification of existing brand tokens.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function options(args) {
  const opts = { brand: 'robo-lab', theme: 'light' };
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!['--brand', '--theme', '--tokens', '--out'].includes(key) || !args[i + 1]) {
      throw new Error(`Expected --brand, --theme, --tokens or --out with a value; got ${key}`);
    }
    opts[key.slice(2)] = args[++i];
  }
  if (!['light', 'dark'].includes(opts.theme)) throw new Error('--theme must be light or dark');
  if (!/^[a-z][a-z0-9-]*$/.test(opts.brand)) throw new Error('Invalid brand slug');
  return opts;
}

function findTokens(filePath) {
  if (filePath) {
    const explicit = resolve(filePath);
    if (!existsSync(explicit)) throw new Error(`Token file not found: ${explicit}`);
    return explicit;
  }
  let current = dirname(fileURLToPath(import.meta.url));
  while (true) {
    const candidate = join(current, 'dist', 'tokens.json');
    if (existsSync(candidate)) return candidate;
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  throw new Error('Resolved dist/tokens.json missing. Run npm run tokens in Robo Design System or pass --tokens /path/to/dist/tokens.json.');
}

export function create3DTheme(resolvedTokens, brand, theme) {
  const item = resolvedTokens?.brands?.[brand];
  if (!item) throw new Error(`Unknown brand: ${brand}. Available: ${Object.keys(resolvedTokens?.brands || {}).join(', ')}`);
  const t = item.themes?.[theme]?.tokens;
  if (!t) throw new Error(`No resolved ${brand}/${theme} theme`);
  const required = ['surface', 'surface-raised', 'surface-sunken', 'text', 'text-muted', 'border-strong', 'primary-strong', 'on-primary', 'accent', 'focus'];
  for (const k of required) if (typeof t[k] !== 'string' || !t[k]) throw new Error(`Missing resolved token: ${brand}/${theme}/${k}`);
  return {
    brand, theme,
    stage: { background: t.surface, floor: t['surface-sunken'], activePart: t.accent, passivePart: t['border-strong'] },
    hud: { panel: t['surface-raised'], text: t.text, muted: t['text-muted'], border: t['border-strong'], action: t['primary-strong'], onAction: t['on-primary'], focus: t.focus },
    guidance: 'Color roles are visual only; mechanism geometry and verified measurements are independent.'
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const opts = options(process.argv.slice(2));
    const resolvedTokens = JSON.parse(readFileSync(findTokens(opts.tokens), 'utf8'));
    const result = JSON.stringify(create3DTheme(resolvedTokens, opts.brand, opts.theme), null, 2) + '\n';
    if (opts.out) writeFileSync(resolve(opts.out), result, 'utf8');
    else process.stdout.write(result);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
