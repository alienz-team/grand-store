"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CloseIcon, DownloadIcon, ShareIcon } from "./icons";
import { useI18n } from "./preferences";

type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

/*
 * Chrome/Edge/Samsung fire `beforeinstallprompt` once per page load, often
 * before React mounts, so the listener lives at module level and keeps the event.
 */
let deferred: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e as InstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

function isStandalone(): boolean {
  return matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

function isIOS(): boolean {
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

/** "Install app" button: native prompt where supported, otherwise step-by-step instructions. */
export function InstallAppButton({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const { L } = useI18n();
  const prompt = useSyncExternalStore(subscribe, () => deferred, () => null);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setInstalled(isStandalone());
    setIos(isIOS());
  }, []);

  if (installed) return null;

  const onClick = async () => {
    if (prompt) {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      deferred = null;
      notify();
      if (outcome === "accepted") setInstalled(true);
      return;
    }
    dialog.current?.showModal();
  };

  const label = L("تنزيل التطبيق", "Install app");

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={onClick}
          aria-label={label}
          title={label}
          className="grid size-10 shrink-0 place-items-center rounded-full border border-steel text-mist transition-colors hover:border-saffron"
        >
          <DownloadIcon />
        </button>
      ) : (
        <button type="button" onClick={onClick} className="btn btn-ghost w-full sm:w-auto">
          <DownloadIcon /> {label}
        </button>
      )}

      <dialog
        ref={dialog}
        aria-labelledby="install-title"
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto w-[min(92vw,26rem)] rounded-3xl border border-steel bg-slab p-0 text-mist shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="install-title" className="font-display text-xl font-bold">
              {L("ثبّت Grand Store على جهازك", "Install Grand Store")}
            </h2>
            <button type="button" onClick={() => dialog.current?.close()} className="-m-1 rounded-full p-2 hover:bg-steel" aria-label={L("إغلاق", "Close")}>
              <CloseIcon />
            </button>
          </div>
          <p className="mt-2 text-sm text-haze">
            {L("افتح المتجر من شاشتك الرئيسية مثل أي تطبيق، بدون متجر تطبيقات.", "Open the store from your home screen like any app, no app store needed.")}
          </p>
          <ol className="mt-5 space-y-3 text-sm">
            {ios ? (
              <>
                <li className="flex items-center gap-3">
                  <Step n={1} />
                  <span>
                    {L("اضغط زر المشاركة", "Tap the Share button")} <ShareIcon className="inline size-5 align-text-bottom text-gold" />{" "}
                    {L("في Safari", "in Safari")}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Step n={2} />
                  <span>{L("اختر «إضافة إلى الشاشة الرئيسية»", "Choose “Add to Home Screen”")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Step n={3} />
                  <span>{L("اضغط «إضافة»", "Tap “Add”")}</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-3">
                  <Step n={1} />
                  <span>{L("افتح قائمة المتصفح (⋮ أو ⋯)", "Open the browser menu (⋮ or ⋯)")}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Step n={2} />
                  <span>{L("اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»", "Choose “Install app” or “Add to Home screen”")}</span>
                </li>
              </>
            )}
          </ol>
          <button type="button" onClick={() => dialog.current?.close()} className="btn btn-primary mt-6 w-full">
            {L("حسنًا", "Got it")}
          </button>
        </div>
      </dialog>
    </>
  );
}

function Step({ n }: { n: number }) {
  return <span className="num grid size-7 shrink-0 place-items-center rounded-full bg-saffron text-xs font-bold text-ink">{n}</span>;
}

/** Registers the service worker (production only) so the site is installable and has an offline page. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* installability is a progressive enhancement */
    });
  }, []);
  return null;
}
