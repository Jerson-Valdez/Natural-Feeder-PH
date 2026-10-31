import { IconInbox } from "@tabler/icons-react";

export default function EmptyState({ title, description, action, className = "" }) {
  return (
    <section className={`flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-8 text-center shadow-lg ${className}`}>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-800"><IconInbox size={24} /></span>
      <h3 className="mt-3 font-semibold text-gray-800">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-gray-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </section>
  );
}
