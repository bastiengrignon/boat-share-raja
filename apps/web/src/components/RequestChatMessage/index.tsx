import type { JourneyRequest, JourneyRequestStatus, Message } from '@boat-share-raja/shared-types';
import { Badge, Button, Center, Flex, Group, type MantineColor, Paper, Text } from '@mantine/core';
import dayjs from 'dayjs';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TbArrowRight, TbCalendar, TbSpeedboat, TbUsersGroup } from 'react-icons/tb';

import { DATE_FORMAT, JOURNEY_REQUEST_STATUS } from '../../constants/string';
import { useRequestChatMessageHooks } from './RequestChatMessage.hooks';

interface RequestChatMessageProps {
  message: Message;
  request: JourneyRequest | null;
  isRequestAuthor: boolean;
}

const requestStatusColors: { [key in JourneyRequestStatus]: MantineColor | string } = {
  [JOURNEY_REQUEST_STATUS.PENDING]: 'yellow',
  [JOURNEY_REQUEST_STATUS.ACCEPTED]: 'green',
  [JOURNEY_REQUEST_STATUS.DECLINED]: 'red',
};

const RequestChatMessage: FC<RequestChatMessageProps> = ({ message, request, isRequestAuthor }) => {
  const { t } = useTranslation('messages');
  const { acceptRequestLoading, declineRequestLoading, handleAcceptRequest, handleDeclineRequest } =
    useRequestChatMessageHooks({ request, message });

  return (
    <Flex justify="center">
      <Paper withBorder shadow="xs" px="xs" py="xs" w="75%">
        <Text fw="bold">{t('request.yourRequestTitle')}</Text>
        {request === null ? (
          <Text ta="center" c="red">
            {t('request.deletedJourney')}
          </Text>
        ) : (
          <Flex direction="column">
            <Group gap="xs">
              <TbSpeedboat />
              <Text size="sm">{request?.journey?.from}</Text>
              <TbArrowRight />
              <Text size="sm">{request?.journey?.to}</Text>
            </Group>
            <Group gap="xs">
              <TbUsersGroup />
              <Text size="sm" fs="italic">
                {t('request.yourRequestPeople', { count: request?.people })}
              </Text>
            </Group>
            <Group gap="xs">
              <TbCalendar />
              <Text size="sm" fs="italic">
                {t('request.date', { date: dayjs(request?.journey?.date).format(DATE_FORMAT) })}
              </Text>
            </Group>
            {(isRequestAuthor || (!isRequestAuthor && request?.status !== JOURNEY_REQUEST_STATUS.PENDING)) && (
              <Center mt="xs">
                <Badge variant="light" color={requestStatusColors[request?.status || JOURNEY_REQUEST_STATUS.PENDING]}>
                  {t(`request.status.${request?.status}`)}
                </Badge>
              </Center>
            )}
          </Flex>
        )}
        {!isRequestAuthor && request?.status === JOURNEY_REQUEST_STATUS.PENDING && (
          <Group mt="xs">
            <Flex gap="xs" flex={1}>
              <Button
                size="xs"
                variant="outline"
                flex={1}
                loading={declineRequestLoading}
                onClick={handleDeclineRequest}
              >
                {t('request.decline')}
              </Button>
              <Button size="xs" flex={1} loading={acceptRequestLoading} onClick={handleAcceptRequest}>
                {t('request.accept')}
              </Button>
            </Flex>
          </Group>
        )}
      </Paper>
    </Flex>
  );
};

export default RequestChatMessage;
