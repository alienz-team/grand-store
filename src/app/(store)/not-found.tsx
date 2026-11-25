import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="num font-display text-7xl font-black text-saffron" dir="ltr">
        404
      </p>
      <h1 className="mt-4 font-display text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="mt-2 text-haze">ربما تم حذف المنتج أو تغيير الرابط.</p>
      <Link href="/" className="btn btn-primary mt-8">
        العودة للرئيسية
      </Link>
    </div>
  );
}
