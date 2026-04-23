"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShortcutsHelp } from "@/components/keyboard/shortcuts-help";
import { hasModifier, isTypingInField, SHORTCUTS } from "@/lib/keyboard/shortcuts";

const CHORD_TIMEOUT_MS = 1000;

export function ShortcutsProvider() {
  const router = useRouter();
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    let leader: string | null = null;
    let leaderTimer: ReturnType<typeof setTimeout> | null = null;

    const resetLeader = () => {
      leader = null;
      if (leaderTimer) {
        clearTimeout(leaderTimer);
        leaderTimer = null;
      }
    };

    const handler = (event: KeyboardEvent) => {
      if (hasModifier(event)) return;
      if (isTypingInField(event.target)) return;

      const key = event.key;

      // Single-key shortcuts (only match when no leader is active).
      if (!leader) {
        const single = SHORTCUTS.find(
          (s) => s.chord === "single" && s.keys.length === 1 && s.keys[0] === key,
        );
        if (single?.action === "help") {
          event.preventDefault();
          setHelpOpen(true);
          return;
        }
      }

      // Enter leader mode on "g".
      if (!leader && key === "g") {
        leader = "g";
        leaderTimer = setTimeout(resetLeader, CHORD_TIMEOUT_MS);
        return;
      }

      // Resolve chord.
      if (leader) {
        const chord = SHORTCUTS.find(
          (s) =>
            s.chord === "nav" &&
            s.keys.length === 2 &&
            s.keys[0] === leader &&
            s.keys[1] === key,
        );
        if (chord?.href) {
          event.preventDefault();
          router.push(chord.href);
        }
        resetLeader();
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (leaderTimer) clearTimeout(leaderTimer);
    };
  }, [router]);

  return <ShortcutsHelp open={helpOpen} onOpenChange={setHelpOpen} />;
}
