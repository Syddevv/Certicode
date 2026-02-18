const TOAST_EVENT = "certicode:toast";

const dispatchToast = (type, message) => {
  if (!message || typeof window === "undefined") return;

  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message: String(message),
      },
    }),
  );
};

export const showSuccessToast = (message) => {
  dispatchToast("success", message);
};

export const showErrorToast = (message) => {
  dispatchToast("error", message);
};

export { TOAST_EVENT };
