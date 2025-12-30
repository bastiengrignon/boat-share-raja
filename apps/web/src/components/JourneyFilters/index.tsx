import { Autocomplete, Button, Drawer, Group, ScrollArea, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbCalendar, TbMapPin } from 'react-icons/tb';

import { DATE_READABLE_SHORT_FORMAT } from '../../constants/string';
import { useMobileQuery } from '../../lib/responsive';
import { useJourneyFiltersHooks } from './JourneyFilters.hooks';

interface JourneyFiltersProps {
  opened: boolean;
  onClose: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onSubmit: (values: any) => void;
  islands: string[];
}

const JourneyFilters: FC<JourneyFiltersProps> = ({ opened, onClose, onSubmit, islands }) => {
  const { t } = useTranslation('home');
  const isMobile = useMobileQuery();
  const { filtersForm } = useJourneyFiltersHooks();
  return (
    <Drawer
      radius="md"
      offset={8}
      title={t('filters.title')}
      position={isMobile ? 'bottom' : 'right'}
      opened={opened}
      onClose={onClose}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <form onSubmit={filtersForm.onSubmit(onSubmit)}>
        <Stack>
          <Autocomplete
            leftSection={<TbMapPin />}
            data={islands}
            label={t('filters.departure')}
            placeholder={t('filters.departure')}
            {...filtersForm.getInputProps('departure')}
          />
          <Autocomplete
            leftSection={<TbMapPin />}
            data={islands}
            label={t('filters.arrival')}
            placeholder={t('filters.arrival')}
            {...filtersForm.getInputProps('arrival')}
          />
          <DatePickerInput
            valueFormat={DATE_READABLE_SHORT_FORMAT}
            minDate={dayjs().toDate()}
            leftSection={<TbCalendar />}
            placeholder={t('filters.date')}
            label={t('filters.date')}
            {...filtersForm.getInputProps('date')}
          />
          <Group>
            <Button flex={1} variant="outline" onClick={onClose}>
              {t('common:cancel')}
            </Button>
            <Button flex={1}>{t('common:save')}</Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
};

export default JourneyFilters;
