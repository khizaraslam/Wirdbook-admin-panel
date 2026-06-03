// Common utility functions

/**
 * Converts a 12-hour AM/PM time string (e.g., "10:00 AM") or 24-hour string to a robust 24-hour HH:mm:ss string 
 * suitable for ISO date generation.
 */
export const formatTimeForISO = (timeString: string | undefined): string => {
  let formattedTime = "00:00:00";
  if (!timeString) return formattedTime;

  const match = timeString.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (match) {
    let hours = parseInt(match[1], 10);
    const mins = match[2];
    const ampm = match[3]?.toUpperCase();
    
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    
    const hh = hours.toString().padStart(2, "0");
    formattedTime = `${hh}:${mins}:00`;
  } else {
    // Fallback if input is already 24-hour or missing AM/PM
    formattedTime = timeString.padEnd(8, ":00");
  }

  return formattedTime;
};

/**
 * Converts a datetime-local value (YYYY-MM-DDTHH:mm) to the backend-required format (YYYY-MM-DDTHH:mm:ss+0000).
 */
export const formatDateTimeLocalForBackend = (dateTimeLocal: string | undefined): string => {
  if (!dateTimeLocal) return "";
  // Check if it already has seconds or timezone
  if (dateTimeLocal.includes("+") || dateTimeLocal.split(":").length > 2) {
    return dateTimeLocal;
  }
  return `${dateTimeLocal}:00+0000`;
};

/**
 * Converts a Date object or ISO string to the format required by datetime-local input (YYYY-MM-DDTHH:mm).
 */
export const formatDateForDateTimeLocal = (dateInput: Date | string | undefined): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Extracts the filename from a backend URL (e.g., "/uploads/audio/uuid-name.mp3" -> "name.mp3").
 */
export const getFileNameFromUrl = (url: string | null | undefined): string => {
  if (!url) return "";
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  // Remove the UUID prefix if it follows the pattern (e.g., uuid-filename.ext)
  const nameParts = lastPart.split("-");
  if (nameParts.length > 1) {
    return nameParts.slice(1).join("-");
  }
  return lastPart;
};
