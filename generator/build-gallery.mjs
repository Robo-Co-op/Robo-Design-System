#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,"..");
const layouts=JSON.parse(fs.readFileSync(path.join(ROOT,"contracts/layouts.json"),"utf8"));
const variants=JSON.parse(fs.readFileSync(path.join(ROOT,"contracts/variants.json"),"utf8"));
const active=variants.variants.filter(v=>!v.deprecated);
const jsonDir=path.join(ROOT,"generator/output/gallery-json"),pptxDir=path.join(ROOT,"generator/output/gallery");
fs.mkdirSync(jsonDir,{recursive:true});fs.mkdirSync(pptxDir,{recursive:true});
for(const variant of active){
 const deck={meta:{title:`Robo Layout Gallery — ${variant.label}`,subtitle:`${layouts.layouts.length} semantic layouts · ${variant.fit}`,brand:variant.brand,preset:variant.id,author:"Robo Co-op",language:"en"},slides:layouts.layouts.map(l=>structuredClone(l.example))};
 const json=path.join(jsonDir,`${variant.id}.json`),pptx=path.join(pptxDir,`${variant.id}.pptx`);
 fs.writeFileSync(json,JSON.stringify(deck,null,2)+"\n");
 const run=spawnSync(process.execPath,[path.join(ROOT,"generator/render-deck.mjs"),json,pptx],{stdio:"inherit"});
 if(run.status!==0)process.exit(run.status||1);
}
console.log(`WROTE ${active.length} gallery decks (${active.length*layouts.layouts.length} layout × variant renders).`);
