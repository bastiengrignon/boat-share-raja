import type { CreateJourney, Island, Journey } from '@boat-share-raja/shared-types';
import { hasLength, isInRange, isNotEmpty, type TransformedValues, useForm } from '@mantine/form';
import { useDisclosure, useInputState } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { TFunction } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { authClient } from '../../lib/auth-client';
import { useAuthSession } from '../../lib/useSession';
import { islandService } from '../../services/island';
import { journeyService } from '../../services/journey';

const journeyQuery = 'journey';
const islandQuery = 'island';

interface HomeHooksInput {
  t: TFunction;
}

export const useHomeHooks = ({ t }: HomeHooksInput) => {
  const queryClient = useQueryClient();
  const { user } = useAuthSession();

  const [search, setSearch] = useInputState('');
  const [openedModalAddJourney, { open: openModalAddJourney, close: closeModalAddJourney }] = useDisclosure(false);
  const [openedModalAddPeopleToJourney, { open: openModalAddPeopleToJourney, close: closeModalAddPeopleToJourney }] =
    useDisclosure(false);
  const [addPeopleModalObject, setAddPeopleModalObject] = useState<{ journeyId: string; maxPeople: number } | null>(
    null
  );

  const addJourneyForm = useForm({
    initialValues: {
      fullName: user?.name || '',
      from: '',
      to: '',
      numberOfPeople: 2,
      maxNumberOfPeople: 6,
      date: dayjs().toDate(),
      time: '',
      price: undefined,
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
        // biome-ignore lint/style/noNonNullAssertion: user is defined
        id: user?.id!,
        name: fullName,
      },
    }),
  });

  const addPeopleToBoatForm = useForm({
    initialValues: {
      people: 1,
    },
    validateInputOnBlur: true,
    validate: {
      people: isInRange(
        {
          min: 1,
          ...(addPeopleModalObject?.maxPeople ? { max: addPeopleModalObject.maxPeople } : {}),
        },
        t('addPeopleModal.errors.people')
      ),
    },
    transformValues: (values) => ({
      ...values,
      journeyId: addPeopleModalObject?.journeyId,
      // biome-ignore lint/style/noNonNullAssertion: user is defined
      user: user!,
    }),
  });

  const { data: allJourney, isPending: allJourneyLoading } = useQuery({
    queryKey: [journeyQuery],
    queryFn: journeyService.getAll,
  });
  const { data: allIslands, isPending: allIslandsLoading } = useQuery({
    queryKey: [islandQuery],
    queryFn: islandService.getAll,
  });

  const { mutate: addJourneyMutation, isPending: addJourneyLoading } = useMutation({
    mutationKey: [journeyQuery],
    mutationFn: journeyService.addJourney,
    onSuccess: async (_, variables) => {
      handleCloseModal();
      await authClient.updateUser({
        name: variables.user.name,
      });
      await queryClient.invalidateQueries({ queryKey: [journeyQuery] });
    },
  });

  const { mutate: addPeopleToBoatMutation, isPending: addPeopleToBoatLoading } = useMutation({
    mutationKey: [journeyQuery],
    mutationFn: journeyService.addPeopleToJourney,
    onSuccess: () => handleCloseModalAddPeople(),
  });

  const formattedJourneys = useMemo<Journey[]>(
    () =>
      (allJourney?.data?.journeys || [])
        .filter(
          (journey: Journey) =>
            (journey?.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
            journey.from.toLowerCase().includes(search.toLowerCase()) ||
            journey.to.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a: Journey, b: Journey) => new Date(a.date).valueOf() - new Date(b.date).valueOf()),
    [allJourney, search]
  );

  const formattedIslands = useMemo(
    () => (allIslands?.data?.islands || []).map((island: Island) => island.name).sort(),
    [allIslands?.data?.islands]
  );

  const handleOpenModalAddPeople = useCallback(
    (journeyId: string, maxPeople: number) => {
      setAddPeopleModalObject({
        journeyId,
        maxPeople,
      });
      openModalAddPeopleToJourney();
    },
    [openModalAddPeopleToJourney]
  );

  const handleCloseModalAddPeople = useCallback(() => {
    setAddPeopleModalObject(null);
    closeModalAddPeopleToJourney();
  }, [closeModalAddPeopleToJourney]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: No Mantine form object in dependency array
  const handleCloseModal = useCallback(() => {
    closeModalAddJourney();
    addJourneyForm.reset();
  }, [closeModalAddJourney]);

  const handleSubmitJourney = useCallback((values: CreateJourney) => addJourneyMutation(values), [addJourneyMutation]);

  const handleSubmitAddPeopleToBoat = useCallback(
    (values: TransformedValues<typeof addPeopleToBoatForm>) => {
      if (values?.journeyId) {
        addPeopleToBoatMutation({
          people: values.people,
          journeyId: values.journeyId,
          user: values.user,
        });
      }
    },
    [addPeopleToBoatMutation]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: No Mantine form object in dependency array
  useEffect(() => {
    if (user?.name !== '' && openedModalAddJourney) {
      addJourneyForm.setFieldValue('fullName', user?.name || '');
    }
  }, [user?.name, openedModalAddJourney]);

  useEffect(() => {
    const anonymousSignIn = async () => await authClient.signIn.anonymous();
    const getSession = async () => await authClient.getSession();
    getSession().then((session) => {
      if (!session.data) {
        anonymousSignIn();
      }
    });
  }, []);

  return {
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
  };
};
