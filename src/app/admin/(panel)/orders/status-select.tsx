"use client";

import { STATUS_LABELS, STATUSES } from "@/lib/format";

/** Submits its parent form as soon as a new status is picked. */
export function StatusSelect({ id, defaultValue }: { id: string; defaultValue: string }) {
  return (
    <>
      <select
        id={id}
        name="status"
        defaultValue={defaultValue}
        className="field w-auto! py-1.5! text-sm"
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      <noscript>
        <button type="submit" className="btn btn-ghost py-1! text-sm">
          حفظ
        </button>
      </noscript>
    </>
  );
}
