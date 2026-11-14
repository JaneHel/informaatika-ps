// Kontrollib, et avaleht ja blogipostitus jäävad loetavaks ja kasutatavaks
// igas WebGL-i olukorras. Käivitus: npm run build && npm run test:e2e
// (eeldab, et `npm run preview` jookseb pordil 4173, või BASE_URL on seatud).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const SHOTS = process.env.SCREENSHOT_DIR;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const GPU_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];

// Esimene (lahtine) canvas = tuvastus õnnestub; DOM-is olev canvas = renderdaja loomine ebaõnnestub.
const FAIL_CONTEXT_CREATION = () => {
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (/webgl/i.test(type) && this.isConnected) return null;
    return orig.call(this, type, ...rest);
  };
};
const THROW_ON_GETCONTEXT = () => {
  const orig = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...rest) {
    if (/webgl/i.test(type)) throw new Error('WebGL keelatud laienduse poolt');
    return orig.call(this, type, ...rest);
  };
};

const scenarios = [
  { name: 'tavaline brauser', args: GPU_ARGS, expect: '3d' },
  { name: 'WebGL blokeeritud (--disable-webgl)', args: [...GPU_ARGS, '--disable-webgl', '--disable-3d-apis'], expect: 'no-webgl' },
  { name: 'getContext viskab erindi', args: GPU_ARGS, init: THROW_ON_GETCONTEXT, expect: 'no-webgl' },
  { name: 'renderduskonteksti loomine ebaõnnestub', args: GPU_ARGS, init: FAIL_CONTEXT_CREATION, expect: 'error' },
  { name: 'three.js tüki laadimine ebaõnnestub', args: GPU_ARGS, blockScene: true, expect: 'error' },
  { name: 'kontekst kaob töö ajal', args: GPU_ARGS, loseContext: true, expect: 'error' },
  { name: 'prefers-reduced-motion', args: GPU_ARGS, reducedMotion: 'reduce', expect: 'reduced-motion', noSceneLoad: true },
];

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };
let failures = 0;

for (const s of scenarios) {
  const browser = await chromium.launch({ args: s.args });
  const context = await browser.newContext({ reducedMotion: s.reducedMotion ?? 'no-preference' });
  if (s.init) await context.addInitScript(s.init);
  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', (e) => pageErrors.push(e.message));
  let sceneRequested = false;
  await page.route('**/assets/DecorScene-*.js', (route) => {
    sceneRequested = true;
    return s.blockScene ? route.abort() : route.continue();
  });

  try {
    for (const path of ['/', '/blogi/mis-on-webgl']) {
      const isHome = path === '/';
      await page.goto(BASE + path);
      const decor = page.getByTestId('decor');
      await decor.waitFor({ state: 'attached' });

      if (s.loseContext) {
        await page.getByTestId('decor-canvas').locator('canvas').waitFor();
        await page.waitForTimeout(300);
        await page.evaluate(() => {
          const c = document.querySelector('[data-testid="decor"] canvas');
          const gl = c.getContext('webgl2') || c.getContext('webgl');
          gl.getExtension('WEBGL_lose_context').loseContext();
        });
      }

      // Oota, kuni olek stabiliseerub.
      await page.waitForFunction(
        (want) => document.querySelector('[data-testid="decor"]')?.dataset.decorState === want,
        s.expect, { timeout: 10000 },
      ).catch(() => {});
      const state = await decor.getAttribute('data-decor-state');
      assert(state === s.expect, `${path}: oodati olekut "${s.expect}", saadi "${state}"`);

      // Leht on loetav ja kasutatav
      assert(await page.getByTestId('page-error').count() === 0, `${path}: kuvati kogu lehe veavaade`);
      await page.locator('h1').first().waitFor({ state: 'visible' });
      const nav = page.getByRole('navigation', { name: 'Peamenüü' });
      assert(await nav.getByRole('link', { name: 'Avaleht' }).isVisible(), `${path}: menüü puudub`);
      if (isHome) {
        assert((await page.locator('h1').innerText()).includes('Tere tulemast'), 'avalehe pealkiri puudub');
        assert(await page.getByRole('link', { name: 'Mis on WebGL?' }).isVisible(), 'postituse link puudub');
      } else {
        assert(await page.locator('article p').count() >= 2, 'postituse tekst puudub');
      }

      // Dekoratsioon ei sega: aria-hidden, ei püüa klikke
      assert(await decor.getAttribute('aria-hidden') === 'true', 'dekoratsioon pole aria-hidden');
      assert(await decor.evaluate((el) => getComputedStyle(el).pointerEvents) === 'none', 'dekoratsioon püüab klikke');

      // Varuvariant: avalehel staatiline illustratsioon, blogis peidus
      const hasCanvas = await page.getByTestId('decor').locator('canvas').count();
      const hasStatic = await page.getByTestId('decor-static').count();
      if (s.expect === '3d') {
        assert(hasCanvas === 1, `${path}: 3D-canvas puudub`);
        const blocking = await decor.evaluate((el) =>
          [...el.querySelectorAll('*')].filter((n) => getComputedStyle(n).pointerEvents !== 'none').length);
        assert(blocking === 0, `${path}: 3D-canvas püüab klikke (pointer-events)`);
        await page.waitForTimeout(500); // lase esimesed kaadrid joonistada enne ekraanipilti
      } else {
        assert(hasCanvas === 0, `${path}: varuolukorras on canvas alles`);
        assert(hasStatic === (isHome ? 1 : 0), `${path}: staatiline illustratsioon ${isHome ? 'puudub' : 'ei tohiks olla nähtav'}`);
      }

      if (SHOTS) await page.screenshot({ path: `${SHOTS}/${s.expect}-${isHome ? 'home' : 'post'}-${scenarios.indexOf(s)}.png`, fullPage: true });

      // Menüülink töötab
      await nav.getByRole('link', { name: 'Blogi' }).click();
      await page.waitForURL(BASE + '/blogi');
      await page.getByRole('heading', { level: 1, name: 'Blogi', exact: true }).waitFor({ timeout: 5000 })
        .catch(() => { throw new Error(`${path}: navigeerimine blogisse ebaõnnestus`); });
    }
    if (s.noSceneLoad) assert(!sceneRequested, 'vähendatud liikumisel ei tohi three.js-i laadida');
    assert(pageErrors.length === 0, `püüdmata vead lehel: ${pageErrors.join(' | ')}`);
    console.log(`✔ ${s.name} → ${s.expect}`);
  } catch (err) {
    failures++;
    console.log(`✘ ${s.name}: ${err.message}`);
  } finally {
    await browser.close();
  }
}

console.log(failures ? `\n${failures} stsenaarium(i) ebaõnnestus` : '\nKõik stsenaariumid läbitud');
process.exit(failures ? 1 : 0);
