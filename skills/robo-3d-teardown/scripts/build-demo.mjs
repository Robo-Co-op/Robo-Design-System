#!/usr/bin/env node
// A reproducible bridge: canonical Robo tokens + pinned third-party Three.js kit.
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync, copyFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import {create3DTheme} from './export-theme.mjs';

const HERE=dirname(fileURLToPath(import.meta.url));
const ROOT=resolve(HERE,'../../..');
const SKILL=resolve(HERE,'..');
const upstream=resolve(process.env.TEARDOWN_DIR||'');
if (!process.env.TEARDOWN_DIR) throw new Error('TEARDOWN_DIR must point to a reviewed, pinned checkout of elvarofficial/teardown.');
if (!existsSync(join(upstream,'sims/build.mjs'))) throw new Error('Missing upstream sims/build.mjs');
if (!existsSync(join(upstream,'node_modules/esbuild'))) throw new Error('Missing upstream node_modules. Run npm ci --ignore-scripts in reviewed upstream directory.');

const sha=execFileSync('git',['-C',upstream,'rev-parse','HEAD'],{encoding:'utf8'}).trim();
const PIN='a91262ac1109051e014662d42ecb0b7bc1f113b1';
if(sha!==PIN) throw new Error(`Unexpected upstream revision #${sha}; must be #${PIN}`);

const resolvedPath=join(ROOT,'dist/tokens.json');
if(!existsSync(resolvedPath))throw new Error('Missing dist/tokens.json; run npm run tokens first.');
const resolved=JSON.parse(readFileSync(resolvedPath,'utf8'));
const theme=create3DTheme(resolved,'robo-lab','light');
const logo=readFileSync(join(ROOT,'assets/logos/robo-lab/inline/robo-lab-horizontal-current.svg'));
const logoData='data:image/svg+xml;base64,'+logo.toString('base64');
const source=readFileSync(join(SKILL,'demo/main.js'),'utf8');
if(!source.includes('__R3D_THEME_JSON__')||!source.includes('__R3D_LOGO_DATA_URI__')) throw new Error('Demo templates missing required theme or logo marker');
const work=mkdtempSync(join(tmpdir(),'robo3d-'));
const demoDir=join(work,'robo-slider-crank');
mkdirSync(demoDir,{recursive:true});
writeFileSync(join(demoDir,'main.js'),source.replace('__R3D_THEME_JSON__',JSON.stringify(theme)).replace('__R3D_LOGO_DATA_URI__',JSON.stringify(logoData)));
copyFileSync(join(SKILL,'demo/model.js'),join(demoDir,'model.js'));
copyFileSync(join(SKILL,'demo/style.css'),join(demoDir,'style.css'));

const outputRoot=join(ROOT,'build/3d');
execFileSync(process.execPath,[join(upstream,'sims/build.mjs'),demoDir],{
  cwd:ROOT,
  env:{...process.env,TEARDOWN_DEPS:join(upstream,'node_modules'),TEARDOWN_OUT:outputRoot},
  stdio:'inherit',
});
const htmlPath=join(outputRoot,'dist/robo-slider-crank.html');
let html=readFileSync(htmlPath,'utf8');
const legal=readFileSync(join(SKILL,'LICENSE-UPSTREAM.txt'),'utf8').replaceAll('--','—');
const comment=`<!--
Based on elvarofficial/teardown at #${PIN} (MIT).
#${legal}
Original 3D demo source: Robo Design System, skills/robo-3d-teardown/demo/.
-->
`;
html=html.replace('<!doctype html>','<!doctype html>\n'+comment).replace('<title>robo-slider-crank</title>','<title>Robo Lab — Interactive 3D Teardown</title>');
writeFileSync(htmlPath,html,'utf8');
writeFileSync(join(outputRoot,'build-manifest.json'),JSON.stringify({source:PIN,brand:'robo-lab',theme:'light',html:'dist/robo-slider-crank.html',sizeBytes:Buffer.byteLength(html),license:'MIT'},null,2)+'\n');
console.log(`Built offline branded 3D demo at #${htmlPath} (#${Math.round(Buffer.byteLength(html)/1024)} KiB)`);
