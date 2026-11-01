#!/usr/bin/env node
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';

const ROOT=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const upstream=process.env.TEARDOWN_DIR&&resolve(process.env.TEARDOWN_DIR);
if(!upstream)throw new Error('Set TEARDOWN_DIR for Playwright');
const require=createRequire(join(upstream,'package.json'));
const {chromium}=require('playwright');
const html=join(ROOT,'build/3d/dist/robo-slider-crank.html');
const shots=join(ROOT,'build/3d/screenshots');
if(!existsSync(html))throw new Error('3D HTML missing: run npm run 3d:build');
mkdirSync(shots,{recursive:true});
const results=[];
const browser=await chromium.launch({
  headless:true,
  args:['--enable-webgl','--ignore-gpu-blocklist','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']
});
try{
  for(const device of [{name:'desktop',viewport:{width:1440,height:900},deviceScaleFactor:1},{name:'mobile',viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true}]){
    const context=await browser.newContext({...device,locale:'ja-JP',colorScheme:'light',reducedMotion:'no-preference'});
    const page=await context.newPage();
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(pathToFileURL(html).href,{waitUntil:'load'});
    await page.waitForFunction(()=>document.documentElement.dataset.robo3dReady==='true',null,{timeout:30000});
    await page.waitForTimeout(700);
    const status=await page.evaluate(()=>{
      const canvas=document.querySelector('canvas#gl');
      return {
        loaded:!!window.ROBO_3D,
        canvasWidth:canvas?.width,canvasHeight:canvas?.height,
        dataUriLength:canvas?.toDataURL('image/png').length||0,
        webgl:!!(canvas?.getContext('webgl2')||canvas?.getContext('webgl')),
        theme:window.ROBO_3D?.getState()?.theme,
        bodyOverflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth
      };
    });
    assert.equal(status.loaded,true,'Interactive API should be available');
    assert.equal(status.webgl,true,'WebGL context must exist');
    assert.ok(status.canvasWidth>100&&status.canvasHeight>100,'Canvas has visible dimensions');
    assert.ok(status.dataUriLength>5000,'Canvas should contain rendered pixels');
    assert.equal(status.theme.brand,'robo-lab');
    assert.equal(status.theme.theme,'light');
    assert.ok(status.bodyOverflow<3,'No unintended horizontal overflow');
    assert.equal(errors.length,0,'No page errors on initial render');
    await page.screenshot({path:join(shots,device.name+'-overview.png'),fullPage:true});
    await page.locator('#explode').click();
    assert.equal(await page.evaluate(()=>window.ROBO_3D.getState().exploded),true);
    await page.waitForTimeout(1000);
    await page.screenshot({path:join(shots,device.name+'-exploded.png'),fullPage:true});
    await page.locator('#cut').click();
    assert.equal(await page.evaluate(()=>window.ROBO_3D.getState().cut),true);
    await page.locator('#part-rod').click();
    assert.equal(await page.evaluate(()=>window.ROBO_3D.getState().selected),'rod');
    await page.locator('#play').click();
    assert.equal(await page.evaluate(()=>window.ROBO_3D.getState().playing),false);
    await page.evaluate(()=>window.ROBO_3D.setAngle(Math.PI));
    await page.waitForTimeout(120);
    const last=await page.evaluate(()=>window.__ROBO3D_LASTPOSE__);
    assert.ok(Math.abs(last.strokeMm)<1e-5,'Stroke readout follows single mechanism model');
    assert.ok(Math.abs(last.rodLengthMm-57)<1e-5,'Rod length is held across frames');
    assert.equal(errors.length,0,'No JS exceptions during interaction');
    for(const button of ['play','cut','explode','tour','reset'])assert.equal(await page.locator('#'+button).isVisible(),true);
    for(const file of ['overview','exploded'])assert.ok(statSync(join(shots,device.name+'-'+file+'.png')).size>20000,'Screenshot not blank');
    results.push({device:device.name,ok:true,dimensions:[status.canvasWidth,status.canvasHeight],pixels:status.dataUriLength,errors:errors.length});
    await context.close();
  }
  const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  await page.goto(pathToFileURL(html).href);
  await page.waitForFunction(()=>!!window.ROBO_3D,null,{timeout:30000});
  assert.equal(await page.evaluate(()=>window.ROBO_3D.getState().playing),false,'Reduced motion disables auto animation');
  results.push({device:'reduced-motion',ok:true});
  await ctx.close();
}finally{await browser.close()}
writeFileSync(join(ROOT,'build/3d/qa-report.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
