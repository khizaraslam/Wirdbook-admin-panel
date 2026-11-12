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
import { confirmationPopup } from "@/utils/helpers/common/alert-service";
import type { Qasida } from "@/utils/helpers/models/qasidas/qasida.dto";
import type { ReciterAudioDraft } from "../components/ReciterAudiosEditor";
import ReciterAudiosPlayer from "../components/ReciterAudiosPlayer";
import { getQasidaPlayableAudios } from "@/utils/helpers/qasidas/helpers";

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
  isEnabled: q.isEnabled,
  indexOrder: String(q.indexOrder ?? 0),
});

const audiosToDrafts = (q: Qasida): ReciterAudioDraft[] =>
  getQasidaPlayableAudios(q).map((item) => ({
    reciter_name: item.reciter_name || "",
    audio_link: item.audio_link || "",
    audio_duration: item.audio_duration != null ? String(item.audio_duration) : "",
    audio_key: item.audio_key || "",
    file: null,
  }));

const QasidaEditPage = () => {
  const { id = "" } = useParams<{ id: string }>();
  const location = useLocation();
  const { getQasida, updateQasida, approveQasida, rejectQasida } = useQasidas();
  const [qasida, setQasida] = useState<Qasida | null>(null);
  const [tab, setTab] = useState<TabId>(
    (location.state as { tab?: TabId })?.tab === "wirds" ? "wirds" : "details",
  );
  const [submitting, setSubmitting] = useState(false);
  const [reciters, setReciters] = useState<ReciterAudioDraft[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<QasidaFormValues>({
    mode: "onChange",
  });

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    getQasida(id).then((data) => {
      if (cancelled || !data) return;
      setQasida(data);
      reset(qasidaToFormValues(data));
      setReciters(audiosToDrafts(data));
    });

    return () => {
      cancelled = true;
    };
  }, [id, getQasida, reset]);

  const onSubmit = async (data: QasidaFormValues) => {
    setSubmitting(true);
    const ok = await updateQasida(
      id,
      buildQasidaFormData(data, reciters, { includeEmpty: true }),
    );
    setSubmitting(false);
    if (ok) {
      const refreshed = await getQasida(id);
      if (refreshed) {
        setQasida(refreshed);
        reset(qasidaToFormValues(refreshed));
        setReciters(audiosToDrafts(refreshed));
      }
    }
  };

  const refresh = async () => {
    const data = await getQasida(id);
    if (!data) return;
    setQasida(data);
    reset(qasidaToFormValues(data));
    setReciters(audiosToDrafts(data));
  };

  const handleApprove = async () => {
    const result = await confirmationPopup(
      "Approve this qasida?",
      "It will appear in the public qasida API for everyone.",
    );
    if (!result.isConfirmed) return;
    const ok = await approveQasida(id);
    if (ok) await refresh();
  };

  const handleReject = async () => {
    const result = await confirmationPopup(
      "Reject this qasida?",
      "It stays on the user’s personal list and will not appear in the public qasida API.",
    );
    if (!result.isConfirmed) return;
    const ok = await rejectQasida(id);
    if (ok) await refresh();
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
      <p className="text-muted mt-1">
        {qasida.totalWirds} verses
        {qasida.sourceId != null ? ` · source #${qasida.sourceId}` : ""}
        {qasida.reviewStatus === "pending"
          ? " · Pending review"
          : qasida.reviewStatus === "rejected"
            ? " · Rejected"
            : ""}
      </p>
      {qasida.submittedBy && (
        <div className="flex flex-wrap gap-2 mt-4">
          {qasida.reviewStatus !== "approved" && (
            <Button type="button" variant="primary" onClick={handleApprove}>
              Approve
            </Button>
          )}
          {qasida.reviewStatus !== "rejected" && (
            <Button type="button" variant="secondary" onClick={handleReject}>
              Reject
            </Button>
          )}
        </div>
      )}

      <div className="mt-6 max-w-3xl">
        <ReciterAudiosPlayer qasida={qasida} />
      </div>

      <div className="flex gap-2 mt-6 border-b border-gray-200">
        {(["details", "wirds"] as TabId[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px ${
              tab === t
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-gray-700"
            }`}
          >
            {t === "wirds" ? "Verses" : "Details"}
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
              setValue={setValue}
              watch={watch}
              reciters={reciters}
              onRecitersChange={setReciters}
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
