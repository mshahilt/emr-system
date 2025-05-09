import { format } from "date-fns";

/**
 * Format a date string to a readable format
 * @param {string} dateString - The date string to format
 * @param {string} formatString - Optional format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatString = "MMM dd, yyyy") => {
  try {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || "N/A";
  }
};

/**
 * Format time in 12-hour format with AM/PM
 * @param {string} timeString - Time string in 24-hour format (HH:MM)
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString) => {
  try {
    if (!timeString) return "N/A";

    // For full datetime strings
    if (timeString.includes("T")) {
      const date = new Date(timeString);
      return format(date, "h:mm a");
    }

    // For time-only strings (HH:MM)
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;

    return `${formattedHour}:${minutes} ${ampm}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString || "N/A";
  }
};

/**
 * Format phone number to a standard format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return "N/A";

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else if (cleaned.length > 10) {
    // Handle international numbers
    return `+${cleaned.slice(0, cleaned.length - 10)} (${cleaned.slice(
      -10,
      -7
    )}) ${cleaned.slice(-7, -4)}-${cleaned.slice(-4)}`;
  }

  return phone; // Return original if we can't format it
};
