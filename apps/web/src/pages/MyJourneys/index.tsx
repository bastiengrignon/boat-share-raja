import { Box, Group, LoadingOverlay, Stack, Text, Title } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbRoute } from 'react-icons/tb';

import JourneyCard from '../../components/JourneyCard';
import { useMyJourneysHooks } from './MyJourneys.hooks';

const MyJourneys: FC = () => {
  const { t } = useTranslation('journeys');
  const { formattedJourneys, myJourneysLoading } = useMyJourneysHooks();

  return (
    <Stack>
      <Group gap="xs">
        <TbRoute />
        <Title order={3}>{t('myJourneys')}</Title>
      </Group>
      <Box mih={250} pos="relative">
        <LoadingOverlay visible={myJourneysLoading} />
        <Stack gap="xs">
          {formattedJourneys.map((journey) => (
            <JourneyCard key={journey.id} journey={journey} />
          ))}
        </Stack>
        {!myJourneysLoading && formattedJourneys.length === 0 && (
          <Text mt="xl" ta="center">
            {t('noJourneys')}
          </Text>
        )}
      </Box>
    </Stack>
  );
};

export default MyJourneys;
