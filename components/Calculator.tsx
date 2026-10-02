'use client'

import { useReducer } from 'react'

type Operator = '+' | '-' | '×' | '÷'

type CalcState = {
  currentInput: string
  previousInput: string
  operator: Operator | null
  shouldResetDisplay: boolean
  memoryValue: number
}

type CalcAction =
  | { type: 'appendNumber'; number: string }
  | { type: 'appendDot' }
  | { type: 'clearEntry' }
  | { type: 'setOperator'; operator: Operator }
  | { type: 'calculate' }
  | { type: 'squareRoot' }
  | { type: 'percentage' }
  | { type: 'reciprocal' }
  | { type: 'toggleSign' }
  | { type: 'memoryClear' }
  | { type: 'memoryRecall' }
  | { type: 'memoryAdd' }
  | { type: 'memorySubtract' }

const initialState: CalcState = {
  currentInput: '0',
  previousInput: '',
  operator: null,
  shouldResetDisplay: false,
  memoryValue: 0,
}

// คำนวณผลลัพธ์ของ previousInput <operator> currentInput
function calculate(state: CalcState): CalcState {
  if (state.operator === null || state.shouldResetDisplay) return state

  const prev = parseFloat(state.previousInput)
  const curr = parseFloat(state.currentInput)
  if (isNaN(prev) || isNaN(curr)) return state

  let result: number | 'Error'
  switch (state.operator) {
    case '+':
      result = prev + curr
      break
    case '-':
      result = prev - curr
      break
    case '×':
      result = prev * curr
      break
    case '÷':
      result = curr === 0 ? 'Error' : prev / curr
      break
    default:
      return state
  }

  return {
    ...state,
    currentInput: result.toString(),
    operator: null,
    shouldResetDisplay: true,
  }
}

function reducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'appendNumber': {
      if (state.currentInput === '0' || state.shouldResetDisplay) {
        return { ...state, currentInput: action.number, shouldResetDisplay: false }
      }
      if (state.currentInput.length < 12) {
        return { ...state, currentInput: state.currentInput + action.number }
      }
      return state
    }

    case 'appendDot': {
      if (state.shouldResetDisplay) {
        return { ...state, currentInput: '0.', shouldResetDisplay: false }
      }
      if (!state.currentInput.includes('.')) {
        return { ...state, currentInput: state.currentInput + '.' }
      }
      return state
    }

    case 'clearEntry':
      return { ...state, currentInput: '0', previousInput: '', operator: null, shouldResetDisplay: false }

    case 'setOperator': {
      const next = state.operator !== null && !state.shouldResetDisplay ? calculate(state) : state
      return {
        ...next,
        previousInput: next.currentInput,
        operator: action.operator,
        shouldResetDisplay: true,
      }
    }

    case 'calculate':
      return calculate(state)

    case 'squareRoot': {
      const val = parseFloat(state.currentInput)
      return {
        ...state,
        currentInput: val < 0 ? 'Error' : Math.sqrt(val).toString(),
        shouldResetDisplay: true,
      }
    }

    case 'percentage': {
      const val = parseFloat(state.currentInput)
      return { ...state, currentInput: (val / 100).toString(), shouldResetDisplay: true }
    }

    case 'reciprocal': {
      const val = parseFloat(state.currentInput)
      return {
        ...state,
        currentInput: val === 0 ? 'Error' : (1 / val).toString(),
        shouldResetDisplay: true,
      }
    }

    case 'toggleSign': {
      if (state.currentInput === '0' || state.currentInput === 'Error') return state
      return {
        ...state,
        currentInput: state.currentInput.startsWith('-')
          ? state.currentInput.slice(1)
          : '-' + state.currentInput,
      }
    }

    // Memory
    case 'memoryClear':
      return { ...state, memoryValue: 0 }

    case 'memoryRecall':
      return { ...state, currentInput: state.memoryValue.toString(), shouldResetDisplay: true }

    case 'memoryAdd': {
      const val = parseFloat(state.currentInput)
      return {
        ...state,
        memoryValue: isNaN(val) ? state.memoryValue : state.memoryValue + val,
        shouldResetDisplay: true,
      }
    }

    case 'memorySubtract': {
      const val = parseFloat(state.currentInput)
      return {
        ...state,
        memoryValue: isNaN(val) ? state.memoryValue : state.memoryValue - val,
        shouldResetDisplay: true,
      }
    }

    default:
      return state
  }
}

type ButtonColor = 'green' | 'num' | 'orange'

type KeyDef = {
  label: string
  color: ButtonColor
  action: CalcAction
  disabled?: boolean // ตามไฟล์เดิม: ปุ่มที่ยังไม่เปิดใช้งาน (เอา disabled ออกเพื่อเปิดใช้)
}

const colorClass: Record<ButtonColor, string> = {
  green: 'bg-linear-to-b from-[#d4f8cd] to-[#a8e6cf]',
  num: 'bg-linear-to-b from-[#e2e8ff] to-[#c6d0ff] hover:from-[#d0dbff] hover:to-[#b2c3ff]',
  orange: 'bg-linear-to-b from-[#ffd3b6] to-[#ffaaa5] hover:from-[#ffc29f] hover:to-[#ff9690]',
}

const keys: KeyDef[] = [
  // Row 1
  { label: 'MC', color: 'green', action: { type: 'memoryClear' }, disabled: true },
  { label: 'MR', color: 'green', action: { type: 'memoryRecall' }, disabled: true },
  { label: 'M+', color: 'green', action: { type: 'memoryAdd' }, disabled: true },
  { label: 'M-', color: 'green', action: { type: 'memorySubtract' }, disabled: true },
  { label: 'CE', color: 'orange', action: { type: 'clearEntry' } },
  // Row 2
  { label: '7', color: 'num', action: { type: 'appendNumber', number: '7' } },
  { label: '8', color: 'num', action: { type: 'appendNumber', number: '8' } },
  { label: '9', color: 'num', action: { type: 'appendNumber', number: '9' } },
  { label: '÷', color: 'green', action: { type: 'setOperator', operator: '÷' }, disabled: true },
  { label: '√', color: 'green', action: { type: 'squareRoot' }, disabled: true },
  // Row 3
  { label: '4', color: 'num', action: { type: 'appendNumber', number: '4' } },
  { label: '5', color: 'num', action: { type: 'appendNumber', number: '5' } },
  { label: '6', color: 'num', action: { type: 'appendNumber', number: '6' } },
  { label: '×', color: 'green', action: { type: 'setOperator', operator: '×' }, disabled: true },
  { label: '%', color: 'green', action: { type: 'percentage' }, disabled: true },
  // Row 4
  { label: '1', color: 'num', action: { type: 'appendNumber', number: '1' } },
  { label: '2', color: 'num', action: { type: 'appendNumber', number: '2' } },
  { label: '3', color: 'num', action: { type: 'appendNumber', number: '3' } },
  { label: '-', color: 'green', action: { type: 'setOperator', operator: '-' } },
  { label: '1/x', color: 'green', action: { type: 'reciprocal' }, disabled: true },
  // Row 5
  { label: '0', color: 'num', action: { type: 'appendNumber', number: '0' } },
  { label: '.', color: 'num', action: { type: 'appendDot' }, disabled: true },
  { label: '+/−', color: 'num', action: { type: 'toggleSign' }, disabled: true },
  { label: '+', color: 'green', action: { type: 'setOperator', operator: '+' } },
  { label: '=', color: 'green', action: { type: 'calculate' } },
]

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="mx-auto mt-6 w-85 rounded-2xl border-4 border-[#4a4a4a] bg-linear-to-b from-[#d6d6d6] to-[#8e8e8e] p-4 shadow-[0_10px_25px_rgba(0,0,0,0.4)] select-none">
      {/* display */}
      <div className="mb-5 flex h-15 items-center justify-end overflow-hidden rounded-lg border-2 border-[#b0bec5] bg-[#e3f2fd] px-4 py-2.5 text-right shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)]">
        <div className="text-[32px] font-bold break-all text-black">{state.currentInput}</div>
      </div>

      {/* keypad */}
      <div className="grid grid-cols-5 gap-2">
        {keys.map((key) => (
          <button
            key={key.label}
            type="button"
            disabled={key.disabled}
            onClick={() => dispatch(key.action)}
            className={`flex h-13 cursor-pointer items-center justify-center rounded-[10px] border border-black/30 text-xl font-bold text-black transition-all duration-75 active:translate-y-0.5 active:shadow-[0_2px_0_rgba(0,0,0,0.2)] disabled:cursor-not-allowed disabled:opacity-60 ${colorClass[key.color]}`}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  )
}
