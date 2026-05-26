import type { ItemModifiers } from "./types";

export const SIZE_OPTIONS = [
  { id: "M" as const, label: "M", delta: 0 },
  { id: "L" as const, label: "L", delta: 10000 },
  { id: "XL" as const, label: "XL", delta: 15000 },
];

export const ICE_OPTIONS = [
  { value: 30, label: "Ít đá" },
  { value: 100, label: "Bình thường" },
  { value: 130, label: "Nhiều đá" },
  { value: 0, label: "Không đá" },
] as const;

export const SUGAR_LEVELS = [0, 30, 50, 70, 100];

export const TOPPINGS = [
  { id: "pearl", label: "Trân châu đen", price: 8000 },
  { id: "pudding", label: "Pudding", price: 10000 },
  { id: "jelly", label: "Thạch", price: 6000 },
  { id: "cheese", label: "Kem cheese", price: 12000 },
];

export const DEFAULT_MODIFIERS: ItemModifiers = {
  size: "M",
  ice: 100,
  sugar: 100,
  toppings: [],
  note: "",
};

export function calcItemUnitPrice(basePrice: number, modifiers: ItemModifiers): number {
  let total = basePrice;
  const size = SIZE_OPTIONS.find((s) => s.id === modifiers.size);
  if (size) total += size.delta;
  for (const tid of modifiers.toppings ?? []) {
    const t = TOPPINGS.find((x) => x.id === tid);
    if (t) total += t.price;
  }
  return total;
}

export function formatModifierLabels(modifiers: ItemModifiers): string[] {
  const labels: string[] = [];
  if (modifiers.size && modifiers.size !== "M") labels.push(`Size ${modifiers.size}`);
  if (modifiers.ice !== undefined && modifiers.ice !== 100) {
    labels.push(ICE_OPTIONS.find((o) => o.value === modifiers.ice)?.label ?? `Đá ${modifiers.ice}%`);
  }
  if (modifiers.sugar !== undefined && modifiers.sugar !== 100)
    labels.push(`Đường ${modifiers.sugar}%`);
  for (const tid of modifiers.toppings ?? []) {
    const t = TOPPINGS.find((x) => x.id === tid);
    if (t) labels.push(t.label);
  }
  if (modifiers.note?.trim()) labels.push(modifiers.note.trim());
  return labels;
}

export function modifiersKey(modifiers: ItemModifiers): string {
  return JSON.stringify({
    size: modifiers.size ?? "M",
    ice: modifiers.ice ?? 100,
    sugar: modifiers.sugar ?? 100,
    toppings: [...(modifiers.toppings ?? [])].sort(),
    note: modifiers.note?.trim() ?? "",
  });
}
