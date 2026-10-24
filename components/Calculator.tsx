"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import {
  type CalcAction,
  formatDisplay,
  initialState,
  reducer,
} from "./calculatorReducer";

type ButtonColor = "green" | "num" | "orange";

type KeyDef = {
  label: string;
  color: ButtonColor;
  action: CalcAction;
  span?: 2; // ปุ่มกว้าง 2 ช่อง
  ariaLabel?: string;
};

const colorClass: Record<ButtonColor, string> = {
  green:
    "bg-linear-to-b from-[#d4f8cd] to-[#a8e6cf] hover:from-[#c4f1bb] hover:to-[#94dcbf]",
  num: "bg-linear-to-b from-[#e2e8ff] to-[#c6d0ff] hover:from-[#d0dbff] hover:to-[#b2c3ff]",
  orange:
    "bg-linear-to-b from-[#ffd3b6] to-[#ffaaa5] hover:from-[#ffc29f] hover:to-[#ff9690]",
};

const digit = (n: string): KeyDef => ({
  label: n,
  color: "num",
  action: { type: "appendNumber", number: n },
});

const op = (label: "+" | "-" | "×" | "÷"): KeyDef => ({
  label,
  color: "green",
  action: { type: "setOperator", operator: label },
});

const keys: KeyDef[] = [
  // Row 1: memory
  { label: "MC", color: "green", action: { type: "memoryClear" } },
  { label: "MR", color: "green", action: { type: "memoryRecall" } },
  { label: "M+", color: "green", action: { type: "memoryAdd" } },
  { label: "M-", color: "green", action: { type: "memorySubtract" } },
  { label: "MS", color: "green", action: { type: "memoryStore" } },
  // Row 2: clear
  { label: "CE", color: "orange", action: { type: "clearEntry" }, span: 2 },
  { label: "C", color: "orange", action: { type: "clearAll" }, span: 2 },
  {
    label: "⌫",
    color: "orange",
    action: { type: "backspace" },
    ariaLabel: "Backspace",
  },
  // Row 3
  digit("7"),
  digit("8"),
  digit("9"),
  op("÷"),
  {
    label: "√",
    color: "green",
    action: { type: "squareRoot" },
    ariaLabel: "Square root",
  },
  // Row 4
  digit("4"),
  digit("5"),
  digit("6"),
  op("×"),
  {
    label: "%",
    color: "green",
    action: { type: "percentage" },
    ariaLabel: "Percent",
  },
  // Row 5
  digit("1"),
  digit("2"),
  digit("3"),
  op("-"),
  {
    label: "1/x",
    color: "green",
    action: { type: "reciprocal" },
    ariaLabel: "Reciprocal",
  },
  // Row 6
  digit("0"),
  { label: ".", color: "num", action: { type: "appendDot" } },
  {
    label: "+/−",
    color: "num",
    action: { type: "toggleSign" },
    ariaLabel: "Toggle sign",
  },
  op("+"),
  { label: "=", color: "green", action: { type: "calculate" } },
];

const keyByLabel = new Map(keys.map((k) => [k.label, k]));

// คีย์บอร์ด → label ของปุ่มบนเครื่องคิดเลข (ตัวอักษรใช้ตัวพิมพ์เล็กเทียบ)
const shortcutToLabel: Record<string, string> = {
  ...Object.fromEntries("0123456789".split("").map((d) => [d, d])),
  ".": ".",
  ",": ".",
  "+": "+",
  "-": "-",
  "*": "×",
  x: "×",
  "/": "÷",
  Enter: "=",
  "=": "=",
  Backspace: "⌫",
  Delete: "CE",
  Escape: "C",
  "%": "%",
  "@": "√",
  r: "1/x",
  F9: "+/−",
  n: "+/−",
  l: "MC",
  m: "MR",
  s: "MS",
  p: "M+",
  q: "M-",
};

// ปุ่มที่กดค้างแล้วให้ทำซ้ำได้
const repeatable = new Set("0123456789⌫".split(""));

const shortcutHints: [string, string][] = [
  ["0–9  .", "ตัวเลข / จุดทศนิยม"],
  ["+  -  *  /", "บวก ลบ คูณ หาร"],
  ["Enter  =", "คำนวณ (กดซ้ำ = ทำซ้ำ)"],
  ["Backspace", "ลบทีละตัว"],
  ["Delete", "CE ล้างตัวเลขปัจจุบัน"],
  ["Esc", "C ล้างทั้งหมด"],
  ["%  @  r", "เปอร์เซ็นต์ / √ / 1/x"],
  ["n  หรือ F9", "บวก/ลบ (+/−)"],
  ["l  m  s  p  q", "MC  MR  MS  M+  M-"],
];

function displaySizeClass(text: string) {
  if (text.length <= 12) return "text-[32px]";
  if (text.length <= 16) return "text-2xl";
  return "text-lg";
}

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // รองรับการกดคีย์บอร์ด
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // ปล่อยให้ shortcut ของเบราว์เซอร์ (Ctrl+R, Cmd+C ฯลฯ) ทำงานตามปกติ
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // ไม่แย่งคีย์จากช่องกรอก ลิงก์ หรือปุ่มนอกเครื่องคิดเลข
      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, input, textarea, select, button, [contenteditable]",
      );
      if (interactive && !containerRef.current?.contains(interactive)) return;

      const id = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const label = shortcutToLabel[id];
      const keyDef = label ? keyByLabel.get(label) : undefined;
      if (!keyDef) return;

      // กัน Enter ไปสั่งคลิกปุ่มที่ focus อยู่ซ้ำ และกัน "/" เปิด quick find ของ Firefox
      e.preventDefault();
      if (e.repeat && !repeatable.has(keyDef.label)) return;

      dispatch(keyDef.action);

      setPressedKey(keyDef.label);
      if (pressTimer.current) clearTimeout(pressTimer.current);
      pressTimer.current = setTimeout(() => setPressedKey(null), 120);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (pressTimer.current) clearTimeout(pressTimer.current);
    };
  }, []);

  const shown = formatDisplay(state.currentInput);

  return (
    <div className="mx-auto mt-6 w-85">
      <div
        ref={containerRef}
        className="rounded-2xl border-4 border-[#4a4a4a] bg-linear-to-b from-[#d6d6d6] to-[#8e8e8e] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.4)] select-none"
      >
        {/* display */}
        <div className="mb-5 flex h-20 flex-col justify-between overflow-hidden rounded-lg border-2 border-[#b0bec5] bg-[#e3f2fd] px-4 py-2 shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)]">
          <div className="flex h-5 items-center justify-between gap-2 text-sm text-black/60">
            <span className="font-bold">
              {state.memoryValue !== 0 ? "M" : ""}
            </span>
            <span className="truncate">{state.expression}</span>
          </div>
          <div
            role="status"
            aria-live="polite"
            className={`overflow-hidden text-right font-bold whitespace-nowrap text-black ${displaySizeClass(shown)}`}
          >
            {shown}
          </div>
        </div>

        {/* keypad */}
        <div className="grid grid-cols-5 gap-2">
          {keys.map((key) => {
            const isPressed = pressedKey === key.label;
            const isPendingOp =
              state.operator === key.label && state.awaitingOperand;
            return (
              <button
                key={key.label}
                type="button"
                aria-label={key.ariaLabel}
                onClick={() => dispatch(key.action)}
                className={`flex h-13 cursor-pointer items-center justify-center rounded-[10px] border border-black/30 text-xl font-bold text-black transition-all duration-75 active:translate-y-0.5 active:shadow-[0_2px_0_rgba(0,0,0,0.2)] ${
                  key.span === 2 ? "col-span-2" : ""
                } ${colorClass[key.color]} ${
                  isPressed ? "translate-y-0.5 brightness-90" : ""
                } ${isPendingOp ? "ring-2 ring-black/60" : ""}`}
              >
                {key.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
