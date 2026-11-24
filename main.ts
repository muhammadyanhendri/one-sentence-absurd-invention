import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One-Sentence Absurd Invention Pitch — the entry is one sentence
// pitching a ridiculous invention that fixes a tiny everyday
// annoyance: the TV remote that always vanishes into the sofa the
// moment you need it.
const PITCH =
  "The Apology Remote: a TV remote that hides itself in the sofa cushions every time you shout for it, and only wriggles back out once you apologise to it out loud.";

// The gate: entry.txt must be UTF-8 text of 1 to 220 characters, not
// only whitespace, and the entry must be exactly one sentence. Validate
// before writing so a bad edit fails loudly here instead of scoring
// an invalid entry: trimmed length 1-220, a single line with no
// internal newline, exactly one sentence ending in a period, and no
// trailing newline in the written file.
function checkPitch(pitch: string): string {
  const trimmed = pitch.trim();
  if (trimmed.length < 1 || trimmed.length > 220) {
    throw new Error(`pitch must be 1-220 characters, got ${trimmed.length}`);
  }
  if (trimmed !== pitch) {
    throw new Error("pitch must not start or end with whitespace");
  }
  if (trimmed.length === 0 || !/\S/.test(trimmed)) {
    throw new Error("pitch must not be only whitespace");
  }
  if (/[\r\n]/.test(trimmed)) {
    throw new Error("pitch must be a single line");
  }
  if (!trimmed.endsWith(".")) {
    throw new Error("pitch must be exactly one sentence ending with a period");
  }
  const terminators = trimmed.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1) {
    throw new Error(
      `pitch must contain exactly one sentence terminator, got ${terminators.length}`,
    );
  }
  const bytes = Buffer.byteLength(trimmed, "utf8");
  if (bytes < 1 || bytes > 220) {
    throw new Error(`pitch must be 1-220 bytes, got ${bytes}`);
  }
  return trimmed;
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "entry.txt"), checkPitch(PITCH), "utf8");
}

main();
