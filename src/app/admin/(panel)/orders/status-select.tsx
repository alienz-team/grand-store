"use client";

import { useI18n } from "@/components/preferences";
import { statusLabel, STATUSES } from "@/lib/format";

/** Submits its parent form as soon as a new status is picked. */
export function StatusSelect({ id, defaultValue }: { id: string; defaultValue: string }) {
  const { lang, L } = useI18n();
  return (
    <>
      <select
        id={id}
        name="status"
        defaultValue={defaultValue}
        className="field w-auto! py-2! text-sm"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {statusLabel(s, lang)}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="btn btn-ghost py-1! text-sm">
          {L("حفظ", "Save")}
        </button>
      </noscript>
    </>
  );
}
