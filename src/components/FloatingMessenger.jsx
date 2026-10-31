import { useEffect, useState } from "react";
import { IconBrandMessenger } from "@tabler/icons-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const fallbackLink = "https://m.me/valdez.jerson.5";

export default function FloatingMessenger() {
  const [link, setLink] = useState(fallbackLink);
  useEffect(() => {
    let active = true;
    getDoc(doc(db, "settings", "store")).then((snapshot) => {
      const savedLink = snapshot.exists() && snapshot.data().messengerLink;
      if (active && savedLink) setLink(savedLink);
    }).catch((error) => console.error("Could not load Messenger link:", error));
    return () => { active = false; };
  }, []);

  return <a href={link} target="_blank" rel="noopener noreferrer" aria-label="Open our Messenger chat" title="Message us on Messenger" className="fixed bottom-24 right-4 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0084ff] text-white shadow-xl transition hover:scale-105 hover:bg-[#006edb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0084ff] focus-visible:ring-offset-2 lg:bottom-6 lg:right-6"><IconBrandMessenger size={25} /></a>;
}
