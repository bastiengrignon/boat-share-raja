import { Box } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import LegalNoticeEn from '../../assets/legalNotice-en.mdx';
import LegalNoticeFr from '../../assets/legalNotice-fr.mdx';
import { PUBLISHER_ADDRESS, PUBLISHER_EMAIL, PUBLISHER_FULL_NAME } from '../../assets/legals';
import MarkdownProvider from '../../components/MarkdownProvider';
import LegalHeader from '../../layout/LegalHeader';

const LegalNotice: FC = () => {
  const { t, i18n } = useTranslation();

  const TranslatedLegalNotice = i18n.resolvedLanguage === 'fr' ? LegalNoticeFr : LegalNoticeEn;

  return (
    <div>
      <LegalHeader title={t('footer.legalNotice')} />
      <Box mb={60}>
        <MarkdownProvider>
          <TranslatedLegalNotice fullName={PUBLISHER_FULL_NAME} address={PUBLISHER_ADDRESS} email={PUBLISHER_EMAIL} />
        </MarkdownProvider>
      </Box>
    </div>
  );
};

export default LegalNotice;
