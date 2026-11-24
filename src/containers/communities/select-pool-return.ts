import Swal from "sweetalert2";
import type { DhikrClaimReportDTO } from "@/utils/helpers/models/communities/dhikr-assignment.dto";

export function claimedAndUnreadJuz(claim: DhikrClaimReportDTO) {
  const uniqueSorted = (values: number[]) =>
    [...new Set(values)].sort((a, b) => a - b);

  const held = uniqueSorted(
    claim.juzNumbers ?? [
      ...(claim.completedJuz ?? []),
      ...(claim.pendingJuz ?? []),
    ],
  );
  const recorded = uniqueSorted(claim.completedJuz ?? []);
  const done = new Set(
    recorded.length === claim.currentProgress
      ? recorded
      : held.length === claim.claimedQuantity && claim.remaining === 0
        ? held
        : recorded,
  );
  const pending = claim.pendingJuz ?? held;
  const candidates = held.filter(
    (juz) => pending.includes(juz) && !done.has(juz),
  );
  const unread =
    held.length === claim.claimedQuantity &&
    done.size === claim.currentProgress &&
    candidates.length === claim.remaining
      ? candidates
      : [];
  return { held, unread, done };
}

const dialogOptions = {
  showCancelButton: true,
  confirmButtonText: "Return",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#4f9c37",
  cancelButtonColor: "#d33",
};

export async function selectPoolReturn(
  claim: DhikrClaimReportDTO,
  isKhitma: boolean,
): Promise<{ juzNumbers: number[] } | { quantity: number } | null> {
  if (!isKhitma) {
    const available = claim.remaining;
    const result = await Swal.fire({
      ...dialogOptions,
      titleText: `Return dhikr for ${claim.userName}`,
      text: `Available to return: ${available}.`,
      input: "number",
      inputPlaceholder: String(available),
      inputAttributes: { min: "1", max: String(available), step: "1" },
      inputValidator: (value) => {
        const amount = Number(value);
        if (!Number.isInteger(amount) || amount < 1)
          return "Enter a whole number of at least 1.";
        if (amount > available) return `You can return at most ${available}.`;
        return undefined;
      },
    });
    return result.isConfirmed ? { quantity: Number(result.value) } : null;
  }

  const { held, unread, done } = claimedAndUnreadJuz(claim);
  if (!unread.length) {
    await Swal.fire({
      titleText: "No unread juz available to return",
      icon: "info",
    });
    return null;
  }

  const fields = document.createElement("fieldset");
  fields.className = "grid grid-cols-2 gap-2 text-left text-sm sm:grid-cols-3";
  const legend = document.createElement("legend");
  legend.className = "mb-3 text-sm font-medium";
  legend.textContent = "Claimed juz · Select unread juz to return";
  fields.append(legend);
  const inputs = held.map((juz) => {
    const label = document.createElement("label");
    label.className =
      "flex items-center gap-2 rounded-lg border border-gray-200 p-2";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = String(juz);
    input.disabled = !unread.includes(juz);
    const text = document.createElement("span");
    text.textContent = `Juz ${juz}${done.has(juz) ? " · Read" : ""}`;
    label.append(input, text);
    fields.append(label);
    return input;
  });
  const result = await Swal.fire<number[]>({
    ...dialogOptions,
    titleText: `Return juz for ${claim.userName}`,
    html: fields,
    preConfirm: () => {
      const selected = inputs.filter(
        (input) => input.checked && !input.disabled,
      );
      if (!selected.length) {
        Swal.showValidationMessage("Select at least one unread juz.");
        return false;
      }
      return selected.map((input) => Number(input.value));
    },
  });
  return result.isConfirmed && result.value?.length
    ? { juzNumbers: result.value }
    : null;
}
