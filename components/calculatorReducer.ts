export type Operator = "+" | "-" | "×" | "÷";

export type CalcState = {
  currentInput: string; // ตัวเลขที่แสดงบนจอ
  previousInput: string; // ตัวตั้งที่รอคำนวณ
  operator: Operator | null; // เครื่องหมายที่รอคำนวณ
  expression: string; // บรรทัดเล็กด้านบนจอ เช่น "5 + 3 ="
  shouldResetDisplay: boolean; // ตัวเลขถัดไปที่กดจะเขียนทับจอ
  awaitingOperand: boolean; // เพิ่งกดเครื่องหมาย ยังไม่ได้ป้อนตัวหลัง
  lastOperator: Operator | null; // ใช้กด = ซ้ำ
  lastOperand: string;
  memoryValue: number;
};

export type CalcAction =
  | { type: "appendNumber"; number: string }
  | { type: "appendDot" }
  | { type: "backspace" }
  | { type: "clearEntry" }
  | { type: "clearAll" }
  | { type: "setOperator"; operator: Operator }
  | { type: "calculate" }
  | { type: "squareRoot" }
  | { type: "percentage" }
  | { type: "reciprocal" }
  | { type: "toggleSign" }
  | { type: "memoryClear" }
  | { type: "memoryRecall" }
  | { type: "memoryStore" }
  | { type: "memoryAdd" }
  | { type: "memorySubtract" };

export const MAX_DIGITS = 12;
export const ERROR = "Error";

export const initialState: CalcState = {
  currentInput: "0",
  previousInput: "",
  operator: null,
  expression: "",
  shouldResetDisplay: false,
  awaitingOperand: false,
  lastOperator: null,
  lastOperand: "",
  memoryValue: 0,
};

const isError = (s: CalcState) => s.currentInput === ERROR;

// เคลียร์ทุกอย่าง แต่เก็บค่า memory ไว้
const fresh = (s: CalcState): CalcState => ({
  ...initialState,
  memoryValue: s.memoryValue,
});

// แปลงผลลัพธ์เป็น string: ตัดเศษทศนิยมลอยตัว (0.1+0.2) และจัดการค่าที่ใหญ่/เล็กเกินไป
export function formatResult(n: number): string {
  if (!Number.isFinite(n)) return ERROR;
  const rounded = parseFloat(n.toPrecision(MAX_DIGITS));
  if (rounded === 0) return "0"; // กัน -0
  const str = rounded.toString();
  if (str.includes("e") || str.replace(/[-.]/g, "").length > 15) {
    return rounded.toExponential(6).replace(/\.?0+e/, "e");
  }
  return str;
}

// ใส่ comma คั่นหลักพัน (ใช้แสดงผลเท่านั้น ไม่ได้เก็บใน state)
export function formatDisplay(s: string): string {
  if (s === ERROR || s.includes("e")) return s;
  const neg = s.startsWith("-");
  const [int, frac] = (neg ? s.slice(1) : s).split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return (neg ? "-" : "") + withCommas + (frac !== undefined ? "." + frac : "");
}

function compute(a: number, op: Operator, b: number): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return b === 0 ? NaN : a / b;
  }
}

function evaluate(state: CalcState): CalcState {
  if (isError(state)) return state;

  // กรณีมีเครื่องหมายค้างอยู่: 5 + 3 =
  if (state.operator !== null) {
    const result = formatResult(
      compute(
        parseFloat(state.previousInput),
        state.operator,
        parseFloat(state.currentInput),
      ),
    );
    return {
      ...state,
      currentInput: result,
      previousInput: "",
      operator: null,
      expression: `${formatDisplay(state.previousInput)} ${state.operator} ${formatDisplay(state.currentInput)} =`,
      shouldResetDisplay: true,
      awaitingOperand: false,
      lastOperator: state.operator,
      lastOperand: state.currentInput,
    };
  }

  // กด = ซ้ำ: ทำการคำนวณเดิมกับผลลัพธ์ล่าสุด (8 = → 11 = → 14)
  if (state.lastOperator !== null) {
    const result = formatResult(
      compute(
        parseFloat(state.currentInput),
        state.lastOperator,
        parseFloat(state.lastOperand),
      ),
    );
    return {
      ...state,
      currentInput: result,
      expression: `${formatDisplay(state.currentInput)} ${state.lastOperator} ${formatDisplay(state.lastOperand)} =`,
      shouldResetDisplay: true,
    };
  }

  return state;
}

// ฟังก์ชันตัวเดียว เช่น √ 1/x
function applyUnary(
  state: CalcState,
  fn: (v: number) => number,
  label: (shown: string) => string,
): CalcState {
  if (isError(state)) return state;
  const v = parseFloat(state.currentInput);
  return {
    ...state,
    currentInput: formatResult(fn(v)),
    expression:
      state.operator === null
        ? label(formatDisplay(state.currentInput))
        : state.expression,
    shouldResetDisplay: true,
    awaitingOperand: false,
  };
}

const roundMem = (n: number) => parseFloat(n.toPrecision(MAX_DIGITS));

export function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case "appendNumber": {
      const base = isError(state) ? fresh(state) : state;
      if (base.shouldResetDisplay) {
        const startingNew = base.operator === null;
        return {
          ...base,
          currentInput: action.number,
          shouldResetDisplay: false,
          awaitingOperand: false,
          expression: startingNew ? "" : base.expression,
          lastOperator: startingNew ? null : base.lastOperator,
        };
      }
      if (base.currentInput === "0") {
        return { ...base, currentInput: action.number };
      }
      const digits = base.currentInput.replace(/[-.]/g, "").length;
      if (digits < MAX_DIGITS) {
        return { ...base, currentInput: base.currentInput + action.number };
      }
      return base;
    }

    case "appendDot": {
      const base = isError(state) ? fresh(state) : state;
      if (base.shouldResetDisplay) {
        const startingNew = base.operator === null;
        return {
          ...base,
          currentInput: "0.",
          shouldResetDisplay: false,
          awaitingOperand: false,
          expression: startingNew ? "" : base.expression,
          lastOperator: startingNew ? null : base.lastOperator,
        };
      }
      if (!base.currentInput.includes(".")) {
        return { ...base, currentInput: base.currentInput + "." };
      }
      return base;
    }

    case "backspace": {
      if (isError(state)) return fresh(state);
      if (state.shouldResetDisplay) return state; // ผลลัพธ์ลบทีละตัวไม่ได้
      const next = state.currentInput.slice(0, -1);
      return {
        ...state,
        currentInput: next === "" || next === "-" ? "0" : next,
      };
    }

    // CE: ล้างเฉพาะตัวเลขที่กำลังพิมพ์ (เครื่องหมายที่ค้างอยู่ยังอยู่)
    case "clearEntry": {
      if (isError(state)) return fresh(state);
      return {
        ...state,
        currentInput: "0",
        shouldResetDisplay: false,
        awaitingOperand: false,
        expression: state.operator !== null ? state.expression : "",
      };
    }

    // C: ล้างทั้งหมด (ยกเว้น memory)
    case "clearAll":
      return fresh(state);

    case "setOperator": {
      if (isError(state)) return state;
      let base = state;
      // ต่อเนื่อง: 5 + 3 + → คำนวณ 8 ก่อนแล้วรอตัวถัดไป
      if (state.operator !== null && !state.awaitingOperand) {
        base = evaluate(state);
        if (isError(base)) return base;
      }
      return {
        ...base,
        previousInput: base.currentInput,
        operator: action.operator,
        expression: `${formatDisplay(base.currentInput)} ${action.operator}`,
        shouldResetDisplay: true,
        awaitingOperand: true,
      };
    }

    case "calculate":
      return evaluate(state);

    case "squareRoot":
      return applyUnary(
        state,
        (v) => (v < 0 ? NaN : Math.sqrt(v)),
        (s) => `√(${s})`,
      );

    case "reciprocal":
      return applyUnary(
        state,
        (v) => (v === 0 ? NaN : 1 / v),
        (s) => `1/(${s})`,
      );

    // %: 100 + 10 % → 10 (10% ของ 100), 100 × 10 % → 0.1
    case "percentage": {
      if (isError(state)) return state;
      const prev = parseFloat(state.previousInput);
      return applyUnary(
        state,
        (v) =>
          state.operator === "+" || state.operator === "-"
            ? (prev * v) / 100
            : v / 100,
        (s) => `${s}%`,
      );
    }

    case "toggleSign": {
      if (state.currentInput === "0" || isError(state)) return state;
      return {
        ...state,
        currentInput: state.currentInput.startsWith("-")
          ? state.currentInput.slice(1)
          : "-" + state.currentInput,
        awaitingOperand: false,
      };
    }

    // Memory
    case "memoryClear":
      return { ...state, memoryValue: 0 };

    case "memoryRecall": {
      const base = isError(state) ? fresh(state) : state;
      return {
        ...base,
        currentInput: formatResult(base.memoryValue),
        expression: base.operator === null ? "" : base.expression,
        shouldResetDisplay: true,
        awaitingOperand: false,
      };
    }

    case "memoryStore": {
      if (isError(state)) return state;
      return {
        ...state,
        memoryValue: parseFloat(state.currentInput),
        shouldResetDisplay: true,
      };
    }

    case "memoryAdd": {
      if (isError(state)) return state;
      return {
        ...state,
        memoryValue: roundMem(state.memoryValue + parseFloat(state.currentInput)),
        shouldResetDisplay: true,
      };
    }

    case "memorySubtract": {
      if (isError(state)) return state;
      return {
        ...state,
        memoryValue: roundMem(state.memoryValue - parseFloat(state.currentInput)),
        shouldResetDisplay: true,
      };
    }

    default:
      return state;
  }
}