import type { EditJourney, Island, Journey, KeyBoolean } from '@boat-share-raja/shared-types';
import { hasLength, isNotEmpty, type TransformedValues, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';

import { useAuthSession } from '../../lib/useSession';
import { routes } from '../../router';
import { islandService } from '../../services/island';
import { journeyService } from '../../services/journey';

interface JourneyCardProps {
  t: TFunction;
  journey: Journey;
}

const journeyQuery = 'journey';
const islandQuery = 'island';

export const useJourneyCardHooks = ({ t, journey }: JourneyCardProps) => {
  const { pathname } = useLocation();
  const { user } = useAuthSession();
  const queryClient = useQueryClient();

  const [openedCardById, setOpenedCardById] = useState<KeyBoolean>({});
  const [journeyEditModalObject, setJourneyEditModalObject] = useState<Journey | null>(null);
  const [openedEditJourneyModal, { open: openEditJourneyModal, close: closeEditJourneyModal }] = useDisclosure(false);

  const editJourneyForm = useForm({
    initialValues: {
      fullName: user?.name || '',
      from: '',
      to: '',
      numberOfPeople: 2,
      maxNumberOfPeople: 6,
      date: dayjs().toDate(),
      time: '',
      price: null,
      notes: '',
    },
    validateInputOnBlur: true,
    validate: {
      fullName: hasLength({ min: 2 }, t('addJourneyForm.errors.fullName')),
      numberOfPeople: (value, values) =>
        value > 0 && value <= values.maxNumberOfPeople ? null : t('addJourneyForm.errors.people'),
      maxNumberOfPeople: (value, values) =>
        value > 0 && value > values.numberOfPeople ? null : t('addJourneyForm.errors.maxPeople'),
      from: isNotEmpty(t('addJourneyForm.errors.from')),
      to: isNotEmpty(t('addJourneyForm.errors.to')),
      date: isNotEmpty(t('addJourneyForm.errors.date')),
    },
    transformValues: ({ fullName, ...values }) => ({
      ...values,
      user: {
        id: user?.id,
        name: fullName,
      },
    }),
  });

  const { data: allIslands, isPending: allIslandsLoading } = useQuery({
    queryKey: [islandQuery],
    queryFn: islandService.getAll,
  });

  const { mutate: updateJourneyMutation, isPending: updateJourneyLoading } = useMutation({
    mutationKey: [journeyQuery],
    mutationFn: journeyService.updateJourney,
    onSuccess: async () => {
      handleCloseEditModal();
      await queryClient.invalidateQueries({ queryKey: [journeyQuery] });
    },
  });

  const isMyJourneysPath = useMemo(() => pathname === routes.journeys, [pathname]);

  const formattedIslands = useMemo(
    () => (allIslands?.data?.islands || []).map((island: Island) => island.name).sort(),
    [allIslands?.data?.islands]
  );

  const alreadyRequestJourney = useMemo(
    () =>
      journey.journeyRequest.some(
        (request) =>
          request.journeyId === journey.id && request.requesterId === user?.id && !request.accepted && !request.declined
      ) || false,
    [user?.id, journey.id, journey.journeyRequest]
  );

  const isBoatFull = useMemo(
    () => journey.numberOfPeople === journey.maxNumberOfPeople,
    [journey.maxNumberOfPeople, journey.numberOfPeople]
  );

  const handleToggleCard = useCallback((id: string) => setOpenedCardById((prev) => ({ ...prev, [id]: !prev[id] })), []);

  const handleEditJourney = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, journey: Journey) => {
      event.stopPropagation();
      setJourneyEditModalObject(journey);
      openEditJourneyModal();
    },
    [openEditJourneyModal]
  );

  const handleCloseEditModal = useCallback(() => {
    setJourneyEditModalObject(null);
    closeEditJourneyModal();
  }, [closeEditJourneyModal]);

  const handleSubmitEditJourney = useCallback(
    (values: TransformedValues<typeof editJourneyForm>) => {
      if (!journeyEditModalObject?.id) return;
      updateJourneyMutation({
        journey: { ...values, id: journeyEditModalObject.id } as unknown as EditJourney & { id: string },
      });
    },
    [updateJourneyMutation, journeyEditModalObject?.id]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: no Mantine form
  useEffect(() => {
    if (journeyEditModalObject) {
      editJourneyForm.initialize({
        date: journeyEditModalObject.date,
        from: journeyEditModalObject.from,
        maxNumberOfPeople: journeyEditModalObject.maxNumberOfPeople,
        notes: journeyEditModalObject.notes || '',
        numberOfPeople: journeyEditModalObject.numberOfPeople,
        // @ts-expect-error price type not working
        price: journeyEditModalObject?.price ?? null,
        time: journeyEditModalObject.time || '',
        to: journeyEditModalObject.to,
        fullName: journeyEditModalObject.user.name,
      });
    }
  }, [journeyEditModalObject]);

  return {
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
    handleCloseEditModal,
    handleToggleCard,
    handleEditJourney,
    handleSubmitEditJourney,
  };
};
