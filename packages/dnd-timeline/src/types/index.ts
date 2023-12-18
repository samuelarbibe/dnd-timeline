export * from "./item";
export * from "./row";
export * from "./timeline";

export interface Relevance {
  start: Date;
  end: Date;
}

export type Timeframe = Relevance;
