import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          "ios-src"?: string;
          alt?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "ar-scale"?: string;
          "ar-placement"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "rotation-per-second"?: string;
          "shadow-intensity"?: string;
          "environment-image"?: string;
          "interaction-prompt"?: string;
          exposure?: string;
          poster?: string;
          loading?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
