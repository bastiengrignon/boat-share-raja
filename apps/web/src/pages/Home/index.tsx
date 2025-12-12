import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Flex,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  NumberInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { DatePickerInput, TimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbCalendar, TbClock, TbCurrencyDollar, TbFilter, TbMapPin, TbPlus, TbSearch } from 'react-icons/tb';

import JourneyCard from '../../components/JourneyCard';
import Loader from '../../components/Loader';
import { DATE_READABLE_SHORT_FORMAT } from '../../constants/string';
import { useHomeHooks } from './Home.hooks';

const Home: FC = () => {
  const { t } = useTranslation('home');
  const {
    search,
    openedModalAddJourney,
    openedModalAddPeopleToJourney,
    addJourneyForm,
    addPeopleToBoatForm,
    formattedJourneys,
    formattedIslands,
    allJourneyLoading,
    allIslandsLoading,
    addJourneyLoading,
    addPeopleToBoatLoading,
    setSearch,
    openModalAddJourney,
    handleSubmitJourney,
    handleCloseModal,
    handleOpenModalAddPeople,
    handleCloseModalAddPeople,
    handleSubmitAddPeopleToBoat,
  } = useHomeHooks({ t });
  return (
    <Stack>
      <Flex direction={{ base: 'column', sm: 'row' }} justify={{ base: 'center', sm: 'space-between' }} gap="sm">
        <Button rightSection={<TbPlus />} onClick={openModalAddJourney}>
          {t('addJourney')}
        </Button>
      </Flex>
      <Stack gap="xs">
        <Flex align="center" justify="space-between">
          <Title order={4}>{t('journeysListTitle')}</Title>
          <Group gap="xs" wrap="nowrap">
            <TextInput
              placeholder={t('common:search')}
              value={search}
              onChange={setSearch}
              rightSection={search !== '' ? <Input.ClearButton onClick={() => setSearch('')} /> : <TbSearch />}
            />
            <Tooltip withArrow label="Coming soon">
              <ActionIcon size="lg" disabled>
                <TbFilter />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Flex>
        <Box mih={250} pos="relative">
          <LoadingOverlay visible={allJourneyLoading} />
          <Stack gap="xs">
            {formattedJourneys.map((journey) => (
              <JourneyCard key={journey.id} journey={journey} handleShareBoat={handleOpenModalAddPeople} />
            ))}
          </Stack>
          {!allJourneyLoading && formattedJourneys.length === 0 && (
            <Text mt="xl" ta="center">
              {t('noJourney')}
            </Text>
          )}
        </Box>
      </Stack>
      <Modal opened={openedModalAddJourney} onClose={handleCloseModal} title={t('addJourney')} size="lg">
        <form onSubmit={addJourneyForm.onSubmit(handleSubmitJourney)}>
          <Stack>
            <TextInput
              data-autofocus
              required
              label={t('addJourneyForm.name')}
              placeholder={t('addJourneyForm.namePlaceholder')}
              {...addJourneyForm.getInputProps('fullName')}
            />
            <Autocomplete
              required
              rightSection={allIslandsLoading ? <Loader /> : null}
              leftSection={<TbMapPin />}
              label={t('addJourneyForm.departure')}
              placeholder={t('addJourneyForm.departurePlaceholder')}
              data={formattedIslands}
              {...addJourneyForm.getInputProps('from')}
            />
            <Autocomplete
              required
              rightSection={allIslandsLoading ? <Loader /> : null}
              leftSection={<TbMapPin />}
              label={t('addJourneyForm.arrival')}
              placeholder={t('addJourneyForm.arrivalPlaceholder')}
              data={formattedIslands}
              {...addJourneyForm.getInputProps('to')}
            />
            <Flex align="flex-end" gap="xs">
              <NumberInput
                flex={1}
                min={0}
                required
                label={t('addJourneyForm.numberOfPeople')}
                {...addJourneyForm.getInputProps('numberOfPeople')}
              />
              <NumberInput
                flex={1}
                min={0}
                required
                label={t('addJourneyForm.maxNumberOfPeople')}
                {...addJourneyForm.getInputProps('maxNumberOfPeople')}
              />
            </Flex>
            <Group gap="xs">
              <DatePickerInput
                required
                flex={1}
                valueFormat={DATE_READABLE_SHORT_FORMAT}
                minDate={dayjs().toDate()}
                label={t('addJourneyForm.date')}
                leftSection={<TbCalendar />}
                {...addJourneyForm.getInputProps('date')}
              />
              <TimePicker
                flex={1}
                withDropdown
                clearable
                label={t('addJourneyForm.time')}
                leftSection={<TbClock />}
                {...addJourneyForm.getInputProps('time')}
              />
            </Group>
            <NumberInput
              label={t('addJourneyForm.price')}
              placeholder={t('addJourneyForm.pricePlaceholder')}
              leftSection={<TbCurrencyDollar />}
              thousandSeparator=" "
              suffix=" IDR"
              {...addJourneyForm.getInputProps('price')}
            />
            <Textarea
              autosize
              minRows={3}
              maxRows={6}
              label={t('addJourneyForm.notes')}
              placeholder={t('addJourneyForm.notesPlaceholder')}
              {...addJourneyForm.getInputProps('notes')}
            />
            <Flex justify="flex-end">
              <Button type="submit" loading={addJourneyLoading}>
                {t('common:add')}
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
      <Modal
        opened={openedModalAddPeopleToJourney}
        onClose={handleCloseModalAddPeople}
        title={t('addPeopleModal.title')}
      >
        <form onSubmit={addPeopleToBoatForm.onSubmit(handleSubmitAddPeopleToBoat)}>
          <Stack>
            <Text size="sm">{t('addPeopleModal.description')}</Text>
            <NumberInput
              min={0}
              {...addPeopleToBoatForm.getInputProps('people')}
              label={t('addPeopleModal.numberOfPeopleToAdd')}
            />
            <Flex justify="flex-end">
              <Button type="submit" loading={addPeopleToBoatLoading}>
                {t('common:add')}
              </Button>
            </Flex>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
};

export default Home;
