import { generateItems, generateRows } from "@/lib/utils";
import type { Active } from "@dnd-kit/core";
import { endOfDay, startOfDay } from "date-fns";
import type { ItemDefinition, Range, RowDefinition } from "dnd-timeline";
import { atom } from "jotai";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

const DEFAULT_ROWS = generateRows(20);
const DEFAULT_ITEMS = generateItems(50, DEFAULT_RANGE, DEFAULT_ROWS);

export const activeAtom = atom<Active | null>(null);
export const rangeAtom = atom<Range>(DEFAULT_RANGE);
export const rowsAtom = atom<RowDefinition[]>(DEFAULT_ROWS);
export const itemsAtom = atom<ItemDefinition[]>(DEFAULT_ITEMS);
