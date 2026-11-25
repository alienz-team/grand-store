import Link from "next/link";
import { getI18n } from "@/lib/i18n-server";

export default async function NotFound() {
  const { L } = await getI18n();
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="num font-display text-7xl font-black text-gold" dir="ltr">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-bold">{L("الصفحة غير موجودة", "Page not found")}</h1>
      <p className="mt-2 text-haze">{L("ربما تم حذف المنتج أو تغيير الرابط.", "The product may have been removed or the link changed.")}</p>
      <Link href="/" className="btn btn-primary mt-8">
        {L("العودة للرئيسية", "Back to home")}
      </Link>
    </div>
  );
}
