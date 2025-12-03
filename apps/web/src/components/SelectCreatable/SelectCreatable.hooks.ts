import { useCombobox } from '@mantine/core';
import { useUncontrolled } from '@mantine/hooks';
import { type ChangeEvent, useCallback, useEffect, useState } from 'react';

import { TRIGGER_VALUE_CREATE } from './SelectCreatable.constants';
import type { SelectCreatableInput } from './select-types';

export const useSelectCreatableHooks = ({
  data,
  defaultValue,
  value,
  onChange,
  onFocus,
  onBlur,
}: SelectCreatableInput) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [internalData, setInternalData] = useState(data);
  const [search, setSearch] = useState('');

  const [controlledValue, setControlledValue] = useUncontrolled<string>({
    value,
    defaultValue,
    finalValue: '',
    onChange,
  });

  const exactOptionMatch = internalData.some((item) => item.value === search.trim());
  const filteredOptions = exactOptionMatch
    ? internalData
    : internalData.filter((item) => item.value.toLowerCase().includes(search.toLowerCase().trim()));

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      combobox.openDropdown();
      combobox.updateSelectedOptionIndex();
      setSearch(event.currentTarget.value);
    },
    [combobox]
  );

  const handleInputBlur = useCallback(() => {
    combobox.closeDropdown();
    setSearch(controlledValue || '');
    onBlur?.();
  }, [combobox, controlledValue, onBlur]);

  const handleInputFocus = useCallback(() => {
    combobox.openDropdown();
    onFocus?.();
  }, [combobox.openDropdown, onFocus]);

  const handleOnOptionSubmit = useCallback(
    (newValue: string) => {
      if (newValue === TRIGGER_VALUE_CREATE) {
        setInternalData((current) => [...current, { value: search, label: search }]);
        setControlledValue(search);
      } else {
        setSearch(newValue);
        setControlledValue(newValue);
      }
      combobox.closeDropdown();
      setSearch('');
    },
    [combobox, search, setControlledValue]
  );

  useEffect(() => {
    setSearch(controlledValue || defaultValue);
  }, [defaultValue, controlledValue]);

  return {
    combobox,
    search,
    controlledValue,
    filteredOptions,
    exactOptionMatch,
    handleInputChange,
    handleInputBlur,
    handleInputFocus,
    handleOnOptionSubmit,
  };
};
