import { ActionIcon, Flex, Title } from '@mantine/core';
import type { FC } from 'react';
import { TbArrowLeft } from 'react-icons/tb';
import { useNavigate } from 'react-router';

interface LegalHeaderProps {
  title: string;
}

const LegalHeader: FC<LegalHeaderProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <Flex gap="xs" mb="sm">
      <ActionIcon variant="light" onClick={() => navigate(-1)}>
        <TbArrowLeft />
      </ActionIcon>
      <Title order={3}>{title}</Title>
    </Flex>
  );
};

export default LegalHeader;
