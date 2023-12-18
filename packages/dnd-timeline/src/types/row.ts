export interface RowDefinition {
  id: string;
  disabled?: boolean;
}

export interface UseRowProps extends RowDefinition {
  data?: object;
}
