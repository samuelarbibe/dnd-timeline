import { generateItems, generateRows } from "@/lib/utils";
import { endOfDay, startOfDay } from "date-fns";
import type { ItemDefinition, RowDefinition, Timeframe } from "dnd-timeline";
import { atom } from "jotai";

const DEFAULT_TIMEFRAME: Timeframe = {
	start: startOfDay(new Date()),
	end: endOfDay(new Date()),
};

const DEFAULT_ROWS = generateRows(20);
const DEFAULT_ITEMS = generateItems(50, DEFAULT_TIMEFRAME, DEFAULT_ROWS);

export const timeframeAtom = atom<Timeframe>(DEFAULT_TIMEFRAME);
export const rowsAtom = atom<RowDefinition[]>(DEFAULT_ROWS);
export const itemsAtom = atom<ItemDefinition[]>(DEFAULT_ITEMS);
