import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,"../..");
const lc=JSON.parse(fs.readFileSync(path.join(ROOT,"contracts/layouts.json"),"utf8"));
const vc=JSON.parse(fs.readFileSync(path.join(ROOT,"contracts/variants.json"),"utf8"));
const ac=JSON.parse(fs.readFileSync(path.join(ROOT,"contracts/archetypes.json"),"utf8"));
const LAYOUTS=new Map(lc.layouts.map(l=>[l.id,l]));
const VARIANTS=new Map(vc.variants.map(v=>[v.id,v]));
const INTENTS=new Map(ac.intents.map(i=>[i.id,i]));
const ARCHETYPES=new Map(ac.archetypes.map(a=>[a.id,a]));
const ALIASES=vc.$meta.aliases||{};
const GENERIC=new Set(["overview","agenda","market","solution","problem","results","next steps","summary","introduction"]);
const SELF_REF=/\b(this slide|this page|on this slide|on this page)\b/i;
const words=(v="")=>String(v).trim().split(/\s+/).filter(Boolean).length;
function resolveVariant(id){const canonical=ALIASES[id]||id;return {canonical,variant:VARIANTS.get(canonical),deprecated:Boolean(ALIASES[id])};}
function validateField(value,rule,where,errors,warnings){
 if(rule.required&&(value===undefined||value===null||value==="")){errors.push(`${where}: required.`);return;}
 if(value===undefined||value===null)return;
 if(rule.type==="array"&&!Array.isArray(value))errors.push(`${where}: must be an array.`);
 if(rule.type==="object"&&(typeof value!=="object"||Array.isArray(value)))errors.push(`${where}: must be an object.`);
 if(rule.type==="string"&&typeof value!=="string")errors.push(`${where}: must be a string.`);
 if(Array.isArray(value)){if(rule.minItems&&value.length<rule.minItems)errors.push(`${where}: needs at least ${rule.minItems} item(s).`);if(rule.maxItems&&value.length>rule.maxItems)errors.push(`${where}: allows at most ${rule.maxItems} item(s).`);}
 if(typeof value==="string"){if(rule.maxChars&&value.length>rule.maxChars)warnings.push(`${where}: ${value.length} chars exceeds guidance of ${rule.maxChars}.`);if(rule.maxWords&&words(value)>rule.maxWords)warnings.push(`${where}: ${words(value)} words exceeds guidance of ${rule.maxWords}.`);}
}
export function validateDeck(deck){
 const errors=[],warnings=[];
 if(!deck||typeof deck!=="object")errors.push("Deck must be an object.");
 if(!deck?.meta?.title)errors.push("meta.title is required.");
 if(!deck?.meta?.brand)errors.push("meta.brand is required.");
 if(!Array.isArray(deck?.slides)||deck.slides.length===0)errors.push("slides must contain at least one slide.");
 if(errors.length)return {errors,warnings};
 const preset=deck.meta.preset||"robo-lab-core",resolved=resolveVariant(preset);
 if(!resolved.variant)errors.push(`meta.preset "${preset}" is not defined in contracts/variants.json.`);
 else{if(resolved.deprecated)warnings.push(`meta.preset "${preset}" is a deprecated alias; use "${resolved.canonical}".`);if(resolved.variant.brand!==deck.meta.brand)errors.push(`meta.brand "${deck.meta.brand}" does not match variant "${resolved.canonical}" (brand: ${resolved.variant.brand}).`);}
 const titles=new Map();let repeatedType=null,repeatedCount=0;
 deck.slides.forEach((slide,i)=>{
  const n=i+1,contract=LAYOUTS.get(slide.type);
  if(!contract){errors.push(`Slide ${n}: unsupported type "${slide.type}".`);return;}
  for(const [field,rule] of Object.entries(contract.fields))validateField(slide[field],rule,`Slide ${n} ${field}`,errors,warnings);

  let archetype=null;
  if(slide.intent!==undefined&&!INTENTS.has(slide.intent))errors.push(`Slide ${n}: unknown intent "${slide.intent}".`);
  if(slide.archetype!==undefined){
    archetype=ARCHETYPES.get(String(slide.archetype).padStart(2,"0"));
    if(!archetype)errors.push(`Slide ${n}: unknown archetype "${slide.archetype}".`);
    else{
      if(slide.intent!==undefined&&slide.intent!==archetype.intent)errors.push(`Slide ${n}: intent "${slide.intent}" conflicts with archetype ${archetype.id} ("${archetype.intent}").`);
      if(!archetype.rendererHints.includes(slide.type))warnings.push(`Slide ${n}: archetype ${archetype.id} ("${archetype.label}") usually maps to ${archetype.rendererHints.join(", ")}; current type is "${slide.type}".`);
    }
  }

  const key=String(slide.title||"").trim().toLowerCase();
  if(key){
    if(titles.has(key))warnings.push(`Slide ${n}: title duplicates slide ${titles.get(key)}.`);else titles.set(key,n);
    if(GENERIC.has(key))warnings.push(`Slide ${n}: generic topic title; prefer a conclusion-oriented title.`);
    if(SELF_REF.test(slide.title))warnings.push(`Slide ${n}: title is self-referential; state the claim directly.`);
    if(/^ja\b/i.test(String(deck.meta.language||""))&&slide.type!=="cover"&&slide.title.length>60)warnings.push(`Slide ${n}: Japanese title is ${slide.title.length} chars; story-first guidance prefers roughly 30–60 characters when practical.`);
  }

  const bodyWords=words([slide.body,slide.proof,slide.subtitle].filter(Boolean).join(" "));
  if(bodyWords>90)warnings.push(`Slide ${n}: body copy is dense (${bodyWords} words; default max 90).`);
  if(/\b(TODO|TBD|LOREM)\b/i.test(JSON.stringify(slide)))warnings.push(`Slide ${n}: contains placeholder text.`);
  if(slide.type===repeatedType)repeatedCount+=1;else{repeatedType=slide.type;repeatedCount=1;}
  if(repeatedCount===3)warnings.push(`Slide ${n}: layout "${slide.type}" appears three times in a row; check composition variety.`);
 });
 if(deck.slides[0]?.type!=="cover")warnings.push("First slide is not a cover.");
 return {errors,warnings};
}
export function formatQa(result){const lines=[];for(const e of result.errors)lines.push(`FAIL  ${e}`);for(const w of result.warnings)lines.push(`WARN  ${w}`);if(!result.errors.length)lines.push(`PASS  ${result.warnings.length} warning(s), 0 failures.`);return lines.join("\n");}
