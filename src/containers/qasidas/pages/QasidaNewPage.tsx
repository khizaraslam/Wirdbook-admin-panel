import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import QasidaDetailsFields, {
  buildQasidaFormData,
  QasidaFormValues,
} from "../components/QasidaDetailsFields";
import useQasidas from "../useHooks";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import { ArrowLeft } from "lucide-react";
import {
  emptyReciterDraft,
  type ReciterAudioDraft,
} from "../components/ReciterAudiosEditor";

const defaultValues: QasidaFormValues = {
  titleEn: "",
  titleAr: "",
  authorEn: "",
  authorAr: "",
  modeEn: "",
  modeAr: "",
  typeEn: "",
  typeAr: "",
  singerEn: "",
  singerAr: "",
  infoEn: "",
  infoAr: "",
  isEnabled: true,
  indexOrder: "",
};

const QasidaNewPage = () => {
  const navigate = useNavigate();
  const { createQasida } = useQasidas();
  const [submitting, setSubmitting] = useState(false);
  const [reciters, setReciters] = useState<ReciterAudioDraft[]>([
    emptyReciterDraft(),
  ]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<QasidaFormValues>({
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = async (data: QasidaFormValues) => {
    setSubmitting(true);
    const created = await createQasida(buildQasidaFormData(data, reciters));
    setSubmitting(false);
    if (created?.id) {
      navigate(`${siteRoutes.qasidas}/${created.id}/edit`, {
        state: { tab: "wirds" },
      });
    }
  };

  return (
    <div className="max-w-3xl">
      <Link
        to={siteRoutes.qasidas}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to list
      </Link>
      <h1 className="text-4xl font-bold text-primary">Add Qasida</h1>
      <p className="text-muted mt-2">
        Required: title in English and Arabic. After save you can add wirds.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm mt-8 space-y-6"
      >
        <QasidaDetailsFields
          register={register}
          errors={errors}
          setValue={setValue}
          watch={watch}
          reciters={reciters}
          onRecitersChange={setReciters}
        />
        <div className="flex justify-end gap-3">
          <Link to={siteRoutes.qasidas}>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            disabled={!isValid}
            isLoading={submitting}
          >
            Create Qasida
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QasidaNewPage;
