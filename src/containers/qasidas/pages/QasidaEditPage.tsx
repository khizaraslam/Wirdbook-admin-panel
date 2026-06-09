import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import QasidaDetailsFields, {
  buildQasidaFormData,
  QasidaFormValues,
} from "../components/QasidaDetailsFields";
import WirdsTab from "../components/WirdsTab";
import useQasidas from "../useHooks";
import { siteRoutes } from "@/utils/helpers/enums/routes.enum";
import { ArrowLeft } from "lucide-react";
import type { Qasida } from "@/utils/helpers/models/qasidas/qasida.dto";

type TabId = "details" | "wirds";

const qasidaToFormValues = (q: Qasida): QasidaFormValues => ({
  titleEn: q.title.en || "",
  titleAr: q.title.ar || "",
  authorEn: q.author?.en || "",
  authorAr: q.author?.ar || "",
  modeEn: q.mode?.en || "",
  modeAr: q.mode?.ar || "",
  typeEn: q.type?.en || "",
  typeAr: q.type?.ar || "",
  singerEn: q.singer?.en || "",
  singerAr: q.singer?.ar || "",
  infoEn: q.info?.en || "",
  infoAr: q.info?.ar || "",
  audioDuration: q.audioDuration != null ? String(q.audioDuration) : "",
  isEnabled: q.isEnabled,
  indexOrder: String(q.indexOrder ?? 0),
  audio: null,
});

const QasidaEditPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  const { getQasida, updateQasida } = useQasidas();
  const [qasida, setQasida] = useState<Qasida | null>(null);
  const [tab, setTab] = useState<TabId>(
    (location.state as { tab?: TabId })?.tab === "wirds" ? "wirds" : "details",
  );
  const [removeAudio, setRemoveAudio] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<QasidaFormValues>({
    mode: "onChange",
  });

  const watchAudio = watch("audio");

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    getQasida(id).then((data) => {
      if (cancelled || !data) return;
      setQasida(data);
      reset(qasidaToFormValues(data));
      setRemoveAudio(false);
    });

    return () => {
      cancelled = true;
    };
  }, [id, getQasida, reset]);

  useEffect(() => {
    if (watchAudio && watchAudio.length > 0) {
      setRemoveAudio(false);
    }
  }, [watchAudio]);

  const onSubmit = async (data: QasidaFormValues) => {
    setSubmitting(true);
    const ok = await updateQasida(
      id,
      buildQasidaFormData(data, { removeAudio, includeEmpty: true }),
    );
    setSubmitting(false);
    if (ok) {
      const refreshed = await getQasida(id);
      if (refreshed) {
        setQasida(refreshed);
        reset(qasidaToFormValues(refreshed));
        setRemoveAudio(false);
      }
    }
  };

  if (!qasida) {
    return (
      <p className="text-muted mt-8">Loading qasida…</p>
    );
  }

  return (
    <div>
      <Link
        to={siteRoutes.qasidas}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-4"
      >
        <ArrowLeft size={16} />
        Back to list
      </Link>
      <h1 className="text-3xl font-bold text-primary">
        {qasida.title.en || qasida.title.ar}
      </h1>
      <p className="text-muted mt-1">{qasida.totalWirds} wirds</p>

      <div className="flex gap-2 mt-6 border-b border-gray-200">
        {(["details", "wirds"] as TabId[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px capitalize ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "details" ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm max-w-3xl space-y-6"
          >
            <QasidaDetailsFields
              register={register}
              errors={errors}
              watchAudio={watchAudio}
              onClearAudio={() =>
                setValue("audio", null as unknown as FileList, {
                  shouldValidate: true,
                })
              }
              currentAudioUrl={qasida.audioUrl}
              removeCurrentAudio={removeAudio}
              onRemoveCurrentAudio={() => {
                setValue("audio", null as unknown as FileList);
                setRemoveAudio(true);
              }}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                disabled={!isValid}
                isLoading={submitting}
              >
                Save Details
              </Button>
            </div>
          </form>
        ) : (
          <WirdsTab qasidaId={id} />
        )}
      </div>
    </div>
  );
};

export default QasidaEditPage;
