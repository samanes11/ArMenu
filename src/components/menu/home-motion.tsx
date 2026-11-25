"use client";

import { useEffect, useLayoutEffect } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

let seen = false;

export function HomeMotion() {
  useIsoLayoutEffect(() => {
    if (seen) document.documentElement.dataset.homeRevisit = "1";
    const t = setTimeout(() => { seen = true; }, 0);
    return () => {
      clearTimeout(t);
      delete document.documentElement.dataset.homeRevisit;
    };
  }, []);

  return null;
}