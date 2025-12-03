import { Combobox, Group, InputBase, ScrollArea } from '@mantine/core';
import type { FC } from 'react';
import { Trans } from 'react-i18next';
import { TbCheck } from 'react-icons/tb';

import Loader from '../Loader';
import { TRIGGER_VALUE_CREATE } from './SelectCreatable.constants';
import { useSelectCreatableHooks } from './SelectCreatable.hooks';
import type { SelectCreatableProps } from './select-types';

const SelectCreatable: FC<SelectCreatableProps> = ({
  data,
  value,
  defaultValue = '',
  onChange,
  label = '',
  size = 'md',
  placeholder = '',
  loading = false,
  inputProps = {},
  error = null,
  onFocus,
  onBlur,
}) => {
  const {
    combobox,
    search,
    controlledValue,
    filteredOptions,
    exactOptionMatch,
    handleInputChange,
    handleInputBlur,
    handleInputFocus,
    handleOnOptionSubmit,
  } = useSelectCreatableHooks({
    defaultValue,
    value,
    data,
    onChange,
    onFocus,
    onBlur,
  });

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <Group gap="sm" justify="space-between">
        <span>{item.label}</span>
        {controlledValue?.includes(item.value) ? <TbCheck /> : null}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox store={combobox} withinPortal={true} onOptionSubmit={handleOnOptionSubmit}>
      <Combobox.Target>
        <InputBase
          size={size}
          rightSection={loading ? <Loader /> : <Combobox.Chevron />}
          label={label}
          value={search}
          onChange={handleInputChange}
          onClick={() => combobox.openDropdown()}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          rightSectionPointerEvents="none"
          error={error}
          {...inputProps}
        />
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={350} type="scroll">
            {options}
            {!exactOptionMatch && search.trim().length > 0 && (
              <Combobox.Option value={TRIGGER_VALUE_CREATE}>
                <Trans i18nKey="combobox.createNewElement" values={{ element: search }} components={{ i: <em /> }} />
              </Combobox.Option>
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};

export default SelectCreatable;
