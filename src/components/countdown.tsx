"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./preferences";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function Countdown({ endsAt }: { endsAt: string }) {
  const { L } = useI18n();
  const end = new Date(endsAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const p = parts(now == null ? 0 : end - now);
  const done = now != null && end <= now;
  const cells = [
    { v: p.d, l: L("يوم", "Days") },
    { v: p.h, l: L("ساعة", "Hours") },
    { v: p.m, l: L("دقيقة", "Min") },
    { v: p.s, l: L("ثانية", "Sec") },
  ];

  if (done) return <p className="font-display text-lg text-haze">{L("انتهى العرض", "This deal has ended")}</p>;

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label={L("الوقت المتبقي على انتهاء العرض", "Time left on this deal")}>
      {cells.map((c) => (
        <div key={c.l} className="w-[4.25rem] rounded-xl border border-steel bg-graphite py-2 text-center sm:w-20">
          <span className="num block font-display text-2xl font-extrabold text-gold sm:text-3xl" suppressHydrationWarning>
            {now == null ? "--" : String(c.v).padStart(2, "0")}
          </span>
          <span className="text-xs text-haze">{c.l}</span>
        </div>
      ))}
    </div>
  );
}
