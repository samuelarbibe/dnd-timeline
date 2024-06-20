import { endOfDay, startOfDay } from "date-fns";
import type { ItemDefinition, Range, RowDefinition } from "dnd-timeline";
import { atom } from "jotai";
import { generateItems, generateRows } from "../utils";

const DEFAULT_RANGE: Range = {
	start: startOfDay(new Date()).getTime(),
	end: endOfDay(new Date()).getTime(),
};

const DEFAULT_ROWS = generateRows(5);
const DEFAULT_ITEMS = generateItems(10, DEFAULT_RANGE, DEFAULT_ROWS);

export const rangeAtom = atom<Range>(DEFAULT_RANGE);
export const rowsAtom = atom<RowDefinition[]>(DEFAULT_ROWS);
export const itemsAtom = atom<ItemDefinition[]>(DEFAULT_ITEMS);
