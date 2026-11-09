import { Field } from "@/components/form-bits";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MENU_SECTIONS } from "@/lib/menu-sections";

export type DishFormData = {
  _id: string;
  name: string;
  nameEn: string;
  description: string;
  modelUrlGlb: string;
  modelUrlUsdz: string;
  price: number;
  category: string;
  thumbnailUrl: string;
};

// Shared by create + edit forms (pass `dish` for edit mode)
export function DishFields({ dish }: { dish?: DishFormData }) {
  const edit = Boolean(dish);
  return (
    <>
      {dish && <input type="hidden" name="dishId" value={dish._id} />}

      <Field label="نام غذا">
        <Input name="name" required defaultValue={dish?.name} />
      </Field>
      <Field label="نام انگلیسی (اختیاری)">
        <Input name="nameEn" dir="ltr" defaultValue={dish?.nameEn} />
      </Field>
      <Field label="قیمت (تومان)">
        <Input name="price" type="number" min={0} step={1000} required defaultValue={dish?.price} />
      </Field>
      <Field label="دسته‌بندی">
        <Select name="category" required defaultValue={dish?.category ?? ""}>
          {!edit && (
            <option value="" disabled>
              انتخاب دسته‌بندی
            </option>
          )}
          {MENU_SECTIONS.map((s) => (
            <optgroup key={s.key} label={s.label}>
              {s.categories.map((c) => (
                <option key={c.label} value={c.label}>
                  {c.label}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </Field>

      <Field label={edit ? "تصویر بندانگشتی (برای تغییر، فایل جدید انتخاب کنید)" : "تصویر بندانگشتی"}>
        {dish?.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.thumbnailUrl} alt={dish.name} className="h-16 w-16 rounded-lg bg-black object-cover" />
        )}
        <Input name="thumbnail" type="file" accept="image/*" />
      </Field>
      <Input name="thumbnailUrl" type="url" dir="ltr" defaultValue={dish?.thumbnailUrl} placeholder="یا لینک تصویر: https://..." className="mt-2 self-start" />

      <Field label="توضیحات" className="sm:col-span-2">
        <Textarea name="description" rows={2} defaultValue={dish?.description} />
      </Field>

      <div className="space-y-3 rounded-xl border border-gold-500 bg-gold-400/5 p-3 sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0">
        <Field label={edit ? "مدل سه‌بعدی (GLB) — برای تغییر، فایل جدید انتخاب کنید" : "مدل سه‌بعدی (GLB) — اندروید و وب"}>
          <Input name="modelGlb" type="file" accept=".glb" />
        </Field>
        <Input name="modelUrlGlb" type="url" dir="ltr" defaultValue={dish?.modelUrlGlb} placeholder="یا لینک GLB: https://...glb" className="mt-2 self-start" />
        <Field label={edit ? "مدل سه‌بعدی (USDZ) — اختیاری" : "مدل سه‌بعدی (USDZ) — اختیاری، برای آیفون"}>
          <Input name="modelUsdz" type="file" accept=".usdz" />
        </Field>
        <Input name="modelUrlUsdz" type="url" dir="ltr" defaultValue={dish?.modelUrlUsdz} placeholder="یا لینک USDZ: https://...usdz" className="mt-2 self-start" />
        {!edit && <p className="text-footnote text-white/50 sm:col-span-2">بدون GLB، دکمه‌ی «مشاهده روی میز» برای این غذا نمایش داده نمی‌شود.</p>}
      </div>
    </>
  );
}
