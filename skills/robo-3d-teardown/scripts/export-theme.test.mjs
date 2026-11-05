import assert from 'node:assert/strict';
import test from 'node:test';
import { create3DTheme } from './export-theme.mjs';

const t = {
  surface: '#eef8ff',
  'surface-raised': '#ffffff',
  'surface-sunken': '#deefff',
  text: '#20305b',
  'text-muted': '#354562',
  'border-strong': '#7088aa',
  'primary-strong': '#007dd1',
  'on-primary': '#ffffff',
  accent: '#00c3ff',
  focus: '#007dd1',
};
const tokens = {brands: {'robo-lab': {themes: {light: {tokens: t}}}}};

test('uses canonical resolved role names, not a slide variant', () => {
  const result = create3DTheme(tokens, 'robo-lab', 'light');
  assert.equal(result.stage.background, '#eef8ff');
  assert.equal(result.stage.activePart, '#00c3ff');
  assert.equal(result.hud.action, '#007dd1');
  assert.equal(result.hud.onAction, '#ffffff');
});

test('fails closed for unknown brand', () => {
  assert.throws(() => create3DTheme(tokens, 'unknown', 'light'), /Unknown brand/);
});

test('requires resolved accessible UI roles', () => {
  assert.throws(() => create3DTheme({brands: {'robo-lab': {themes: {light: {tokens: {}}}}}}, 'robo-lab', 'light'), /Missing resolved token/);
});
