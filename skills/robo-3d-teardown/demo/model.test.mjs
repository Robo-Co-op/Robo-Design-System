import test from 'node:test';
import assert from 'node:assert/strict';
import {pose, DIMENSIONS} from './model.js';

test('slider travels exactly twice the crank radius', () => {
  const top=pose(0), bottom=pose(Math.PI);
  assert.ok(Math.abs(top.sliderY-bottom.sliderY-2*DIMENSIONS.crankRadiusMm/10)<1e-9);
  assert.ok(Math.abs(bottom.strokeMm)<1e-9);
  assert.ok(Math.abs(top.strokeMm-36)<1e-9);
});
test('rod length remains constant through a complete cycle', () => {
  for(let i=0;i<=360;i++){
    const p=pose(i*Math.PI/180);
    assert.ok(Math.abs(p.rodLength*10-DIMENSIONS.connectingRodMm)<1e-9);
    assert.ok(p.strokeMm>=-1e-8 && p.strokeMm<=36+1e-8);
  }
});
test('pose is periodic and deterministic',()=>{
  for(const theta of [0,0.2,1.4,2.6,4.7]){
    const a=pose(theta),b=pose(theta+Math.PI*2);
    assert.ok(Math.abs(a.sliderY-b.sliderY)<1e-12);
    assert.ok(Math.abs(a.crankX-b.crankX)<1e-12);
  }
  assert.throws(()=>pose(NaN),/finite/);
});
