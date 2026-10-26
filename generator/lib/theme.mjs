import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,"../..");
const readJson=(rel)=>JSON.parse(fs.readFileSync(path.join(ROOT,rel),"utf8"));
export function loadTheme(meta={}){
 const contract=readJson("contracts/variants.json"),aliases=contract.$meta.aliases||{};
 const requested=meta.preset||"robo-lab-core",presetName=aliases[requested]||requested;
 const variant=contract.variants.find(v=>v.id===presetName);
 if(!variant)throw new Error(`Unknown presentation variant: ${requested}`);
 return {brand:variant.brand,presetName:variant.id,label:variant.label,mode:variant.mode,scheme:variant.scheme,dark:variant.scheme==="dark",...variant.visual,...variant.composition,...variant.features};
}
export function paths(){return {root:ROOT};}
