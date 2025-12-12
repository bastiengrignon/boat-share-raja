import { Space, Text } from '@mantine/core';
import type { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import LegalHeader from '../../layout/LegalHeader';

const LegalNotice: FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <LegalHeader title={t('footer.legalNotice')} />
      <Text style={{ whiteSpace: 'pre-wrap' }}>
        <Trans
          i18nKey="footer.legalNoticePerson"
          components={{ strong: <strong /> }}
          values={{
            fullName: 'GRIGNON Bastien',
            address: '13 Route de la Loire 49630 Mazé-Milon',
            email: 'bastien@bastiengrignon.fr',
          }}
        />
        <Space h="md" />
        <Trans i18nKey="footer.legalNoticeHost" components={{ strong: <strong /> }} />
      </Text>
    </div>
  );
};

export default LegalNotice;
