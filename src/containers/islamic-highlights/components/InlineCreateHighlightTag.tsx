import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CreateIslamicHighlightTagDTO } from "@/utils/helpers/models/islamic-highlights/create-islamic-highlight-tag.dto";
import { IslamicHighlightTagDTO } from "@/utils/helpers/models/islamic-highlights/islamic-highlight-tag.dto";
import {
  HIGHLIGHT_TAG_SLUG_PATTERN,
  HIGHLIGHT_TAG_SLUG_VALIDATION_MESSAGE,
  toHighlightTagSlug,
  type HighlightTagMutationResult,
} from "@/utils/helpers/islamic-highlights/helpers";

interface InlineCreateHighlightTagProps {
  createTag: (
    body: CreateIslamicHighlightTagDTO,
  ) => Promise<HighlightTagMutationResult>;
  onCreated: (tag: IslamicHighlightTagDTO) => void;
}

const InlineCreateHighlightTag: React.FC<InlineCreateHighlightTagProps> = ({
  createTag,
  onCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [labelEn, setLabelEn] = useState("");
  const [labelAr, setLabelAr] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!slugTouched) {
      setSlug(toHighlightTagSlug(labelEn));
    }
  }, [labelEn, slugTouched]);

  const reset = () => {
    setLabelEn("");
    setLabelAr("");
    setSlug("");
    setSlugTouched(false);
    setError("");
    setIsOpen(false);
  };

  const handleCreate = async () => {
    const trimmedEn = labelEn.trim();
    const trimmedAr = labelAr.trim();
    const trimmedSlug = slug.trim() || toHighlightTagSlug(trimmedEn);

    if (!trimmedEn) {
      setError("English label is required");
      return;
    }
    if (!trimmedAr) {
      setError("Arabic label is required");
      return;
    }
    if (!HIGHLIGHT_TAG_SLUG_PATTERN.test(trimmedSlug)) {
      setError(HIGHLIGHT_TAG_SLUG_VALIDATION_MESSAGE);
      return;
    }

    setIsSubmitting(true);
    setError("");
    const result = await createTag(
      new CreateIslamicHighlightTagDTO({
        labelEn: trimmedEn,
        labelAr: trimmedAr,
        slug: trimmedSlug,
      }),
    );
    setIsSubmitting(false);

    if (!result.success) {
      setError(
        result.fieldErrors?.slug ||
          result.fieldErrors?.labelEn ||
          result.message ||
          "Failed to create tag",
      );
      return;
    }

    onCreated(
      result.tag?.id
        ? result.tag
        : new IslamicHighlightTagDTO({
            labelEn: trimmedEn,
            labelAr: trimmedAr,
            slug: trimmedSlug,
          }),
    );
    reset();
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mt-1.5"
      >
        <Plus size={12} />
        Add new tag
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-primary/15 bg-primary/5 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
          New tag
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close new tag form"
        >
          <X size={14} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Input
          label="Label (EN) *"
          value={labelEn}
          onChange={(e) => setLabelEn(e.target.value)}
          placeholder="e.g. Patience"
        />
        <Input
          label="Label (AR) *"
          value={labelAr}
          onChange={(e) => setLabelAr(e.target.value)}
          placeholder="الصبر"
          dir="rtl"
        />
      </div>
      <Input
        label="Slug"
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
        hint="Auto-generated from English label"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={reset}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="sm"
          isLoading={isSubmitting}
          onClick={handleCreate}
        >
          Create & select
        </Button>
      </div>
    </div>
  );
};

export default InlineCreateHighlightTag;
