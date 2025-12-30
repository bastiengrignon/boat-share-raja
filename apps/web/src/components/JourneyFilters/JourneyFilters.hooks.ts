import { useForm } from '@mantine/form';

export const useJourneyFiltersHooks = () => {
  const filtersForm = useForm({
    initialValues: {
      departure: '',
      arrival: '',
      date: null,
    },
    validateInputOnBlur: true,
  });

  return {
    filtersForm,
  };
};
