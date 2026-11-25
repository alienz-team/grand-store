"use client";

import { useEffect, useState } from "react";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export function Countdown({ endsAt }: { endsAt: string }) {
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
    { v: p.d, l: "يوم" },
    { v: p.h, l: "ساعة" },
    { v: p.m, l: "دقيقة" },
    { v: p.s, l: "ثانية" },
  ];

  if (done) return <p className="font-display text-lg text-haze">انتهى العرض</p>;

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label="الوقت المتبقي على انتهاء العرض">
      {cells.map((c) => (
        <div key={c.l} className="w-16 rounded-xl border border-steel bg-graphite py-2 text-center sm:w-20">
          <span className="num block font-display text-2xl font-extrabold text-saffron sm:text-3xl" suppressHydrationWarning>
            {now == null ? "--" : String(c.v).padStart(2, "0")}
          </span>
          <span className="text-xs text-haze">{c.l}</span>
        </div>
      ))}
    </div>
  );
}
