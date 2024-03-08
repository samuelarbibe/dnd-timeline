import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { minutesToMilliseconds } from "date-fns";
import { nanoid } from "nanoid";
import type {
  ItemDefinition,
  Relevance,
  RowDefinition,
  Timeframe,
} from "dnd-timeline";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


interface GenerateRowsOptions {
  disabled?: boolean;
}

export const generateRows = (count: number, options?: GenerateRowsOptions) => {
  return Array(count)
    .fill(0)
    .map((): RowDefinition => {
      const disabled = options?.disabled;

      let id = `${nanoid(4)}`;
      if (disabled) id += " (disabled)";

      return {
        id,
        disabled,
      };
    });
};

const getRandomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const DEFAULT_MIN_DURATION = minutesToMilliseconds(60);
const DEFAULT_MAX_DURATION = minutesToMilliseconds(360);

export const generateRandomRelevance = (
  timeframe: Timeframe,
  minDuration: number = DEFAULT_MIN_DURATION,
  maxDuration: number = DEFAULT_MAX_DURATION,
): Relevance => {
  const duration = getRandomInRange(minDuration, maxDuration);

  const start = getRandomInRange(
    timeframe.start.getTime(),
    timeframe.end.getTime() - duration,
  );

  const end = start + duration;

  return {
    start: new Date(start),
    end: new Date(end),
  };
};

interface GenerateItemsOptions {
  disabled?: boolean;
  background?: boolean;
  minDuration?: number;
  maxDuration?: number;
}

export const generateItems = (
  count: number,
  timeframe: Timeframe,
  rows: RowDefinition[],
  options?: GenerateItemsOptions,
) => {
  return Array(count)
    .fill(0)
    .map((): ItemDefinition => {
      const row = rows[Math.ceil(Math.random() * rows.length - 1)];
      const rowId = row.id;
      const disabled = row.disabled || options?.disabled;

      const relevance = generateRandomRelevance(
        timeframe,
        options?.minDuration,
        options?.maxDuration,
      );

      let id = `${nanoid(4)}`;
      if (disabled) id += " (disabled)";

      return {
        id,
        rowId,
        relevance,
        disabled,
      };
    });
};
