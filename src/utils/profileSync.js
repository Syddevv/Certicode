export const PROFILE_UPDATED_EVENT = "certicode:profile-updated";

export const emitProfileUpdated = (user) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(PROFILE_UPDATED_EVENT, {
      detail: user || {},
    }),
  );
};
