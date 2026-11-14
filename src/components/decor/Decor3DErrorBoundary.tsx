import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  /** Mida näidata tõrke korral (staatiline illustratsioon või `null`). */
  fallback: ReactNode;
  onError?: (error: unknown) => void;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Eraldi veapiir ainult dekoratiivse 3D-komponendi jaoks.
 * Püüab kinni renderdamise, three.js laadimise ja renderduskonteksti loomise vead
 * ning EI lase neil jõuda lehe/marsruudi tasandi veavaateni.
 */
export class Decor3DErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    // Dekoratsioon pole kriitiline – logime hoiatusena, mitte veana.
    console.warn('[Decor3D] 3D-animatsioon keelati, kuvatakse staatiline variant.', error, info.componentStack);
    this.props.onError?.(error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
