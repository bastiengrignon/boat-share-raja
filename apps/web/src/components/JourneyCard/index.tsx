import type { Journey } from '@boat-share-raja/shared-types';
import {
  ActionIcon,
  Autocomplete,
  Box,
  Button,
  Flex,
  Group,
  Modal,
  NumberFormatter,
  NumberInput,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Tooltip,
  Transition,
} from '@mantine/core';
import { DatePickerInput, TimePicker } from '@mantine/dates';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TbArrowRight,
  TbCalendar,
  TbChevronDown,
  TbChevronUp,
  TbClock,
  TbCurrencyDollar,
  TbEdit,
  TbMapPin,
  TbNote,
  TbSend,
  TbUser,
  TbUsersGroup,
  TbUsersPlus,
} from 'react-icons/tb';

import { DATE_FORMAT, DATE_READABLE_SHORT_FORMAT } from '../../constants/string';
import ConfirmDeletePopover from '../ConfirmDeletePopover';
import Loader from '../Loader';
import { useJourneyCardHooks } from './JourneyCard.hooks';
import classes from './JourneyCard.module.css';

dayjs.extend(relativeTime);

interface JourneyCardProps {
  journey: Journey;
  handleShareBoat?: (id: string, maximumPeople: number) => void;
}

const JourneyCard: FC<JourneyCardProps> = ({ journey, handleShareBoat }) => {
  const { t } = useTranslation('home');
  const {
    user,
    openedCardById,
    isMyJourneysPath,
    editJourneyForm,
    journeyEditModalObject,
    openedEditJourneyModal,
    formattedIslands,
    alreadyRequestJourney,
    isBoatFull,
    allIslandsLoading,
    updateJourneyLoading,
    deleteJourneyLoading,
    newConversationLoading,
    handleCloseEditModal,
    handleToggleCard,
    handleEditJourney,
    handleDeleteJourney,
    handleSubmitEditJourney,
    handleOpenOrCreateConversation,
  } = useJourneyCardHooks({ t, journey });
  return (
    <div>
      <Box w="100%" className={classes.journeyCardContainer} onClick={() => handleToggleCard(journey.id)}>
        <Paper
          withBorder
          p="xs"
          className={clsx({ [classes.journeyCardMine as string]: user?.id === journey.user.id })}
        >
          <Stack>
            <Flex align="center" justify="space-between">
              <Group>
                <Text size="lg">{journey.from}</Text>
                <TbArrowRight />
                <Text size="lg">{journey.to}</Text>
              </Group>
              <Group gap="xs">
                <TbCalendar />
                <Text mt={6}>{dayjs(journey.date).format(DATE_FORMAT)}</Text>
              </Group>
            </Flex>
            <Flex justify="space-between">
              <Group gap="xs">
                <TbUsersGroup />
                <Text size="sm">
                  {t('journeyCard.peopleOnboard', {
                    current: journey.numberOfPeople,
                    maximum: journey.maxNumberOfPeople,
                  })}
                </Text>
              </Group>
              <Group gap="xs">
                {isMyJourneysPath && (
                  <ConfirmDeletePopover
                    acceptProps={{ loading: deleteJourneyLoading }}
                    onSubmit={() => handleDeleteJourney(journey.id)}
                  />
                )}
                {isMyJourneysPath && (
                  <ActionIcon size="sm" variant="outline" onClick={(event) => handleEditJourney(event, journey)}>
                    <TbEdit size={14} />
                  </ActionIcon>
                )}
                <ThemeIcon variant="outline" size="sm" color="gray">
                  {openedCardById[journey.id] ? <TbChevronUp /> : <TbChevronDown />}
                </ThemeIcon>
              </Group>
            </Flex>
          </Stack>
        </Paper>
      </Box>
      <Transition mounted={openedCardById[journey.id] || false} transition="scale-y" duration={350}>
        {(styles) => (
          <Paper mx="xs" p="sm" withBorder style={styles}>
            <Stack>
              <Flex justify="space-between">
                <Group gap="xs">
                  <TbUser />
                  <Text size="sm">{t('journeyCard.publishedBy', { name: journey.user?.name })}</Text>
                </Group>
                <Text size="xs" fs="italic">
                  {dayjs(journey.createdAt).fromNow()}
                </Text>
              </Flex>
              <Group gap="xs">
                <TbCurrencyDollar />
                <Text>
                  {journey.price ? (
                    <NumberFormatter thousandSeparator=" " suffix=" IDR" value={journey.price} />
                  ) : (
                    t('journeyCard.noPrice')
                  )}
                </Text>
              </Group>
              {journey.notes && (
                <Group gap="xs">
                  <TbNote />
                  <Text>{journey.notes}</Text>
                </Group>
              )}
              {user?.id !== journey.user.id && (
                <Flex align="center" gap="xs" direction={{ base: 'column', sm: 'row' }}>
                  <Button
                    w="100%"
                    size="xs"
                    rightSection={<TbSend />}
                    loading={newConversationLoading}
                    onClick={handleOpenOrCreateConversation}
                  >
                    {t('journeyCard.sendMessage')}
                  </Button>
                  <Tooltip
                    withArrow
                    label={t('journeyCard.shareBoatDisabledAlreadySent')}
                    disabled={!alreadyRequestJourney}
                  >
                    <Button
                      w="100%"
                      size="xs"
                      color="teal"
                      rightSection={<TbUsersPlus />}
                      disabled={alreadyRequestJourney || isBoatFull}
                      onClick={() => handleShareBoat?.(journey.id, journey.maxNumberOfPeople)}
                    >
                      {t('journeyCard.shareBoat')}
                    </Button>
                  </Tooltip>
                </Flex>
              )}
            </Stack>
          </Paper>
        )}
      </Transition>
      {journeyEditModalObject && (
        <Modal opened={openedEditJourneyModal} onClose={handleCloseEditModal} title={t('editModal.title')}>
          <form onSubmit={editJourneyForm.onSubmit(handleSubmitEditJourney)}>
            <Stack>
              <TextInput
                data-autofocus
                required
                disabled
                label={t('addJourneyForm.name')}
                placeholder={t('addJourneyForm.namePlaceholder')}
                {...editJourneyForm.getInputProps('fullName')}
              />
              <Autocomplete
                required
                rightSection={allIslandsLoading ? <Loader /> : null}
                leftSection={<TbMapPin />}
                label={t('addJourneyForm.departure')}
                placeholder={t('addJourneyForm.departurePlaceholder')}
                data={formattedIslands}
                {...editJourneyForm.getInputProps('from')}
              />
              <Autocomplete
                required
                rightSection={allIslandsLoading ? <Loader /> : null}
                leftSection={<TbMapPin />}
                label={t('addJourneyForm.arrival')}
                placeholder={t('addJourneyForm.arrivalPlaceholder')}
                data={formattedIslands}
                {...editJourneyForm.getInputProps('to')}
              />
              <Flex align="flex-end" gap="xs">
                <NumberInput
                  flex={1}
                  min={0}
                  required
                  label={t('addJourneyForm.numberOfPeople')}
                  {...editJourneyForm.getInputProps('numberOfPeople')}
                />
                <NumberInput
                  flex={1}
                  min={0}
                  required
                  label={t('addJourneyForm.maxNumberOfPeople')}
                  {...editJourneyForm.getInputProps('maxNumberOfPeople')}
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
                  {...editJourneyForm.getInputProps('date')}
                />
                <TimePicker
                  flex={1}
                  withDropdown
                  clearable
                  label={t('addJourneyForm.time')}
                  leftSection={<TbClock />}
                  {...editJourneyForm.getInputProps('time')}
                />
              </Group>
              <NumberInput
                label={t('addJourneyForm.price')}
                placeholder={t('addJourneyForm.pricePlaceholder')}
                leftSection={<TbCurrencyDollar />}
                thousandSeparator=" "
                suffix=" IDR"
                {...editJourneyForm.getInputProps('price')}
              />
              <Textarea
                autosize
                minRows={3}
                maxRows={6}
                label={t('addJourneyForm.notes')}
                placeholder={t('addJourneyForm.notesPlaceholder')}
                {...editJourneyForm.getInputProps('notes')}
              />
              <Flex justify="flex-end">
                <Button type="submit" loading={updateJourneyLoading}>
                  {t('common:update')}
                </Button>
              </Flex>
            </Stack>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default JourneyCard;
