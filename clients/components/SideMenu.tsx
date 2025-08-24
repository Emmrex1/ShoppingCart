"use client";

import React, { FC, useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Logo from "./Logo";
import { X } from "lucide-react";
import { headerData } from "./constants/data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SocialMedia from "./SocialMedia";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  // Avoid SSR hydration mismatch by rendering the portal only after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll when open
  useEffect(() => {
    if (!mounted) return;
    const { style } = document.body;
    const prev = style.overflow;
    style.overflow = isOpen ? "hidden" : "";
    return () => {
      style.overflow = prev;
    };
  }, [isOpen, mounted]);

  // Close when route changes
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape, and trap focus inside the panel when open
  const panelRef = useRef<HTMLDivElement>(null);

  const focusFirstElement = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    (focusables[0] || panel).focus();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Focus first interactive element when opening
    focusFirstElement();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!panelRef.current) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        // Shift+Tab on first -> loop to last
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
        // Tab on last -> loop to first
        else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, focusFirstElement]);

  if (!mounted) return null;
  if (typeof window === "undefined") return null;

  const portalTarget = document.body;
  if (!portalTarget) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="side-menu-title"
        className={`fixed inset-y-0 left-0 z-[101] w-full max-w-xs bg-black text-white/80 shadow-xl outline-none transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        tabIndex={-1}
      >
        <div className="h-full p-6 flex flex-col gap-6 overflow-y-auto">
          <div className="flex items-center justify-between">
            <Logo className="text-white" spanDesign="group-hover:text-white" />
            <button
              onClick={onClose}
              className="hover:text-shop_light_green transition-colors p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-shop_light_green/60"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
          </div>

          <h2 id="side-menu-title" className="sr-only">
            Main navigation
          </h2>

          <nav className="flex flex-col space-y-3.5 font-semibold tracking-wide">
            {headerData.map((item) => (
              <Link
                href={item.href}
                key={item.title}
                className={`hover:text-shop_light_green hoverEffect text-lg ${
                  pathname === item.href ? "text-white" : ""
                }`}
                onClick={onClose}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <SocialMedia />
          </div>
        </div>
      </div>
    </>,
    portalTarget
  );
};

export default SideMenu;
