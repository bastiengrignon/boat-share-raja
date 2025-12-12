import { ActionIcon, type ActionIconProps, Button, type ButtonProps, Group, Popover, Text } from '@mantine/core';
import React, { type FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TbTrash, TbX } from 'react-icons/tb';

interface ConfirmDeletePopoverProps {
  targetProps?: ActionIconProps;
  cancelProps?: ButtonProps;
  acceptProps?: ButtonProps;
  onSubmit?: () => void;
}

const ConfirmDeletePopover: FC<ConfirmDeletePopoverProps> = ({ targetProps, cancelProps, acceptProps, onSubmit }) => {
  const { t } = useTranslation();
  const [opened, setOpened] = useState<boolean>(false);

  const handleTogglePopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setOpened((o) => !o);
  }, []);

  const handleOnSubmit = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onSubmit?.();
      setOpened(false);
    },
    [onSubmit]
  );

  return (
    <Popover width={200} position="bottom" withArrow shadow="md" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <ActionIcon color="red" variant="outline" size="sm" {...targetProps} onClick={handleTogglePopover}>
          <TbTrash size={14} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">{t('confirmDelete')}</Text>
        <Group gap="xs" justify="flex-end">
          <Button
            size="compact-xs"
            rightSection={<TbX />}
            variant="outline"
            onClick={handleTogglePopover}
            {...cancelProps}
          >
            {t('no')}
          </Button>
          <Button size="compact-xs" rightSection={<TbTrash />} color="red" onClick={handleOnSubmit} {...acceptProps}>
            {t('yes')}
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
};

export default ConfirmDeletePopover;
