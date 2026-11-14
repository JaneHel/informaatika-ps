/**
 * Kontrollib, kas brauser suudab WebGL-renderduskonteksti üldse luua.
 * Ei viska kunagi erindit: blokeeritud WebGL, puuduv GPU-tugi, poliitika või
 * laiendus, mis getContext'i üle kirjutab – kõik need annavad tulemuseks `false`.
 */
export function isWebGLAvailable(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    if (!('WebGLRenderingContext' in window)) return false;
    const canvas = document.createElement('canvas');
    const gl =
      (canvas.getContext('webgl2') as WebGL2RenderingContext | null) ??
      (canvas.getContext('webgl') as WebGLRenderingContext | null);
    if (!gl) return false;
    // Vabastame testkonteksti kohe, et mitte raisata brauseri piiratud konteksti-limiiti.
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
