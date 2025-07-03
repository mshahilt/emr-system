declare module "vanta/dist/vanta.globe.min" {
  interface VantaEffect {
    destroy: () => void;
  }

  interface Vanta {
    GLOBE: (options: {
      el: HTMLElement;
      mouseControls?: boolean;
      touchControls?: boolean;
      gyroControls?: boolean;
      minHeight?: number;
      minWidth?: number;
      scale?: number;
      scaleMobile?: number;
      color?: number;
      backgroundColor?: number;
      size?: number;
      THREE: typeof import("three");
    }) => VantaEffect;
  }

  const VANTA: Vanta;
  export default VANTA;
}
