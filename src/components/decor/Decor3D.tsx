import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Decor3DErrorBoundary } from './Decor3DErrorBoundary';
import { StaticDecor } from './StaticDecor';
import { useReducedMotion } from './useReducedMotion';
import { isWebGLAvailable } from './webgl';

// Laisk import: three.js laaditakse ainult siis, kui seda päriselt vaja on.
const DecorScene = lazy(() => import('./DecorScene'));

export type Decor3DFallback = 'illustration' | 'hidden';

/** Testides ja silumisel kasulik: miks just see variant kuvati. */
export type Decor3DState = 'pending' | '3d' | 'reduced-motion' | 'no-webgl' | 'error';

interface Props {
  /** Mida kuvada 3D asemel: staatiline illustratsioon (vaikimisi) või mitte midagi. */
  fallback?: Decor3DFallback;
  className?: string;
}

/**
 * Dekoratiivne 3D-animatsioon, mis ei saa kunagi lehte katki teha.
 *
 * - prefers-reduced-motion → staatiline variant, three.js-i ei laadita üldse
 * - WebGL puudub/blokeeritud → staatiline variant
 * - renderduskonteksti loomine, three.js tüki laadimine või renderdamine ebaõnnestub,
 *   kontekst kaob → eraldi veapiir vahetab staatilise variandi vastu
 *
 * Komponent on aria-hidden ja pointer-events: none, nii et see ei sega teksti, menüüd ega linke.
 */
export function Decor3D({ fallback = 'illustration', className }: Props) {
  const reducedMotion = useReducedMotion();
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setWebgl(isWebGLAvailable());
  }, []);

  const handleFail = useCallback((reason: unknown) => {
    console.warn('[Decor3D] 3D-animatsioon peatati:', reason);
    setFailed(true);
  }, []);

  let state: Decor3DState;
  if (reducedMotion) state = 'reduced-motion';
  else if (failed) state = 'error';
  else if (webgl === null) state = 'pending';
  else if (!webgl) state = 'no-webgl';
  else state = '3d';

  const fallbackNode = fallback === 'hidden' ? null : <StaticDecor />;

  return (
    <div
      className={['decor', className].filter(Boolean).join(' ')}
      aria-hidden="true"
      data-testid="decor"
      data-decor-state={state}
      data-decor-fallback={fallback}
    >
      {state === '3d' ? (
        <Decor3DErrorBoundary fallback={fallbackNode} onError={handleFail}>
          <Suspense fallback={fallbackNode}>
            <DecorScene onFail={handleFail} />
          </Suspense>
        </Decor3DErrorBoundary>
      ) : (
        fallbackNode
      )}
    </div>
  );
}
