import type { InputBaseProps, MantineSize } from '@mantine/core';

export interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectCreatableInput {
  data: SelectItem[];
  defaultValue: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface SelectCreatableProps {
  data: SelectItem[];
  value?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
  label: string;
  size?: MantineSize | string;
  placeholder: string;
  loading: boolean;
  inputProps?: InputBaseProps;
  error?: string | null;
  onFocus?: () => void;
  onBlur?: () => void;
}
