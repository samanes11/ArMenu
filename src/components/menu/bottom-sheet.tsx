"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

export function BottomSheet({
  open,
  onClose,
  ariaLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            role="dialog"
            aria-label={ariaLabel}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-y-auto rounded-t-3xl border border-menu-line bg-[#161616] text-white"
            style={{ maxHeight: "80dvh" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 38 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}