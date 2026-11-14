import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { WebGLRenderer, type Mesh } from 'three';

interface Props {
  /** Kutsutakse, kui renderdamine ebaõnnestub või kontekst kaob. */
  onFail: (reason: unknown) => void;
}

function SpinningShape({ onFail }: Props) {
  const ref = useRef<Mesh>(null);
  useFrame((_, delta) => {
    // useFrame jookseb requestAnimationFrame'is, väljaspool Reacti veapiiri –
    // seepärast püüame vead siin ise kinni.
    try {
      const mesh = ref.current;
      if (!mesh) return;
      mesh.rotation.x += delta * 0.4;
      mesh.rotation.y += delta * 0.6;
    } catch (err) {
      onFail(err);
    }
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.4, 0]} />
      <meshStandardMaterial color="#5b77f0" flatShading />
    </mesh>
  );
}

/** Jälgib renderduskonteksti kadumist (GPU lähtestus, draiveri krahh, liiga palju kontekste). */
function ContextLossGuard({ onFail }: Props) {
  const canvas = useThree((s) => s.gl.domElement);
  useEffect(() => {
    const onLost = (event: Event) => {
      event.preventDefault();
      onFail(new Error('WebGL context lost'));
    };
    canvas.addEventListener('webglcontextlost', onLost);
    return () => canvas.removeEventListener('webglcontextlost', onLost);
  }, [canvas, onFail]);
  return null;
}

/**
 * Tegelik 3D-stseen. Laaditakse laisalt (React.lazy), nii et three.js-i tüki
 * laadimise tõrge püütakse samuti Decor3DErrorBoundary poolt kinni.
 */
export default function DecorScene({ onFail }: Props) {
  return (
    <Canvas
      className="decor-canvas"
      data-testid="decor-canvas"
      // R3F seab ümbrisele vaikimisi pointer-events: auto – dekoratsioon ei tohi klikke püüda.
      style={{ pointerEvents: 'none' }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      // Loome renderdaja ise, et konteksti loomise tõrge oleks selgelt käsitletud.
      gl={(canvas) => {
        try {
          return new WebGLRenderer({
            canvas: canvas as HTMLCanvasElement,
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
          });
        } catch (err) {
          onFail(err);
          // Viskame edasi, et R3F ei jätkaks poolikult; Decor3DErrorBoundary püüab selle kinni.
          throw err;
        }
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} />
      <SpinningShape onFail={onFail} />
      <ContextLossGuard onFail={onFail} />
    </Canvas>
  );
}
