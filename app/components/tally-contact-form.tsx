"use client";

import { useEffect, useRef } from "react";

const WIDGET_SCRIPT_SRC = "https://tally.so/widgets/embed.js";
const FORM_SRC =
  "https://tally.so/embed/ODpX2R?transparentBackground=1&dynamicHeight=1";

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

export function TallyContactForm() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const loadEmbed = () => {
      if (window.Tally) {
        window.Tally.loadEmbeds();
        return;
      }

      const iframe = iframeRef.current;
      if (iframe && !iframe.getAttribute("src")) {
        iframe.src = FORM_SRC;
      }
    };

    if (window.Tally) {
      loadEmbed();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${WIDGET_SCRIPT_SRC}"]`,
    );
    const script = existingScript ?? document.createElement("script");

    script.addEventListener("load", loadEmbed);
    script.addEventListener("error", loadEmbed);

    if (!existingScript) {
      script.src = WIDGET_SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      script.removeEventListener("load", loadEmbed);
      script.removeEventListener("error", loadEmbed);
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="contact-form-frame"
      data-tally-src={FORM_SRC}
      title="Contact Settra"
      width="100%"
      height="216"
      loading="eager"
    />
  );
}
