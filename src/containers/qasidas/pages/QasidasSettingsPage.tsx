import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useQasidas from "../useHooks";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import { ArrowLeft } from "lucide-react";

interface SettingsForm {
  titleEn: string;
  titleAr: string;
  infoEn: string;
  infoAr: string;
}

const QasidasSettingsPage = () => {
  const { getSettings, updateSettings } = useQasidas();
  const [totalQasidas, setTotalQasidas] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SettingsForm>();

  useEffect(() => {
    getSettings().then((data) => {
      if (data) {
        reset({
          titleEn: data.title.en || "",
          titleAr: data.title.ar || "",
          infoEn: data.info.en || "",
          infoAr: data.info.ar || "",
        });
        setTotalQasidas(data.totalQasidas);
      }
    });
  }, [getSettings, reset]);

  const onSubmit = async (values: SettingsForm) => {
    await updateSettings({
      titleEn: values.titleEn.trim(),
      titleAr: values.titleAr.trim(),
      infoEn: values.infoEn.trim(),
      infoAr: values.infoAr.trim(),
    });
  };

  return (
    <div className="max-w-3xl">
      <Link
        to={siteRoutes.qasidas}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to Qasidas
      </Link>
      <h1 className="text-4xl font-bold text-primary">Qasidas Settings</h1>
      <p className="text-muted mt-2">
        Module title and intro shown in the mobile app
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mt-8 space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Title (English)" {...register("titleEn")} />
          <Input
            label="Title (Arabic)"
            className="text-right"
            dir="rtl"
            {...register("titleAr")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              Info (English)
            </label>
            <textarea
              className="form-input min-h-[120px] resize-y"
              {...register("infoEn")}
            />
            <p className="text-xs text-muted">Use # for paragraph breaks on mobile</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="form-label text-sm font-bold text-gray-900">
              Info (Arabic)
            </label>
            <textarea
              className="form-input min-h-[120px] resize-y text-right"
              dir="rtl"
              {...register("infoAr")}
            />
          </div>
        </div>
        <Input
          label="Total qasidas"
          value={String(totalQasidas)}
          disabled
          readOnly
        />
        <div className="flex justify-end">
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QasidasSettingsPage;
