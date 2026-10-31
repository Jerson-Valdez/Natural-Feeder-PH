import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";

export default function FeedbackDialog({
  open,
  variant = "info",
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onClose,
  busy = false,
}) {
  if (!open) return null;
  const confirm = variant === "confirm";
  const Icon = confirm ? IconAlertTriangle : IconInfoCircle;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center bg-black/10 justify-center p-4 backdrop-blur-xs"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-dialog-title"
        className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl sm:p-6"
      >
        <header className="flex items-start gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${confirm ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
          >
            <Icon size={23} />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              id="feedback-dialog-title"
              className="text-lg font-bold text-gray-900"
            >
              {title}
            </h2>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {message}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            disabled={busy}
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition-all duration-300 hover:cursor-pointer"
          >
            <IconX size={19} />
          </button>
        </header>
        <footer className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {confirm && (
            <button
              type="button"
              disabled={busy}
              onClick={onClose}
              className="min-h-11 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl"
            >
              Cancel
            </button>
          )}
          {confirm ? (
            <button
              type="button"
              disabled={busy}
              onClick={onConfirm}
              className="min-h-11 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-50 transition-all duration-300 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl"
            >
              <IconCheck size={17} className="mr-1 inline" />
              {busy ? "Working…" : confirmLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl bg-green-800 px-5 py-2 text-sm font-semibold text-white hover:bg-green-900 transition-all duration-300 hover:cursor-pointer hover:-translate-y-0.5 hover:shadow-xl"
            >
              Got it
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
