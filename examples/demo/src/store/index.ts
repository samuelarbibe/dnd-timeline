import { atom } from "jotai";
import { generateItems, generateRows } from "@/lib/utils";
import type { ItemDefinition, RowDefinition, Timeframe } from "dnd-timeline";
import { endOfDay, startOfDay } from "date-fns";

const DEFAULT_TIMEFRAME: Timeframe = {
  start: startOfDay(new Date()),
  end: endOfDay(new Date()),
};

const DEFAULT_ROWS = generateRows(20);
const DEFAULT_ITEMS = generateItems(50, DEFAULT_TIMEFRAME, DEFAULT_ROWS);

export const timeframeAtom = atom<Timeframe>(DEFAULT_TIMEFRAME);
export const rowsAtom = atom<RowDefinition[]>(DEFAULT_ROWS);
export const itemsAtom = atom<ItemDefinition[]>(DEFAULT_ITEMS);
