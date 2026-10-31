import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { IconDeviceFloppy, IconSettings } from "@tabler/icons-react";
import { toast } from "sonner";
import { db } from "../../config/firebase";

const defaultMessengerLink = "https://m.me/valdez.jerson.5";
export default function AdminSettings() {
  const [messengerLink, setMessengerLink] = useState(defaultMessengerLink);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    getDoc(doc(db, "settings", "store"))
      .then((snapshot) => {
        if (snapshot.exists() && snapshot.data().messengerLink)
          setMessengerLink(snapshot.data().messengerLink);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Could not load store settings.");
      })
      .finally(() => setLoading(false));
  }, []);
  async function save(event) {
    event.preventDefault();
    let url;
    try {
      url = new URL(messengerLink.trim());
    } catch {
      toast.error("Enter a valid Messenger URL.");
      return;
    }
    if (
      url.protocol !== "https:" ||
      !["m.me", "www.facebook.com", "facebook.com"].includes(url.hostname)
    ) {
      toast.error("Use a valid https Messenger link (m.me or Facebook).");
      return;
    }
    setSaving(true);
    try {
      await setDoc(
        doc(db, "settings", "store"),
        { messengerLink: url.toString(), updatedAt: serverTimestamp() },
        { merge: true },
      );
      toast.success("Settings saved.");
    } catch (error) {
      console.error(error);
      toast.error("Could not save settings.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <main className="page-container" aria-busy={loading}>
      <div className="w-full">
        <div className="flex items-center gap-2">
          <IconSettings className="text-green-800" />
          <h1 className="text-xl font-bold text-green-800">Settings</h1>
        </div>
        <p className="text-sm text-gray-600">
          Manage store links used in customer order actions.
        </p>
      </div>
      <form
        onSubmit={save}
        className="w-full rounded-2xl border border-gray-100 bg-white p-5 shadow-xl sm:p-6"
      >
        <h2 className="font-bold text-green-900">Messenger</h2>
        <label className="mt-4 block text-sm font-medium text-gray-700">
          Store Messenger link
          <input
            type="url"
            required
            value={messengerLink}
            onChange={(event) => setMessengerLink(event.target.value)}
            placeholder="https://m.me/your-page"
            disabled={loading}
            className="mt-1 min-h-11 w-full rounded-xl border border-gray-200 px-3 py-2 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">
          Used by the order confirmation and Continue to Messenger actions.
        </p>
        <button
          disabled={loading || saving}
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-green-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-900 disabled:opacity-50 hover:cursor-pointer"
        >
          <IconDeviceFloppy size={18} />
          {saving ? "Saving…" : "Save settings"}
        </button>
      </form>
    </main>
  );
}
