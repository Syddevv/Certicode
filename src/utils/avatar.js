const API_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

export const resolveAvatarUrl = (avatarUrl) => {
  if (!avatarUrl || typeof avatarUrl !== "string") return "";
  const trimmed = avatarUrl.trim();
  if (!trimmed) return "";
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:")
  ) {
    return trimmed;
  }
  if (trimmed.startsWith("//")) {
    return `${window.location.protocol}${trimmed}`;
  }
  if (trimmed.startsWith("/")) {
    return `${API_ORIGIN}${trimmed}`;
  }
  return `${API_ORIGIN}/${trimmed}`;
};
