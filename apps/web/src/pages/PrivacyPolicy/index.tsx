import { Box } from '@mantine/core';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PUBLISHER_ADDRESS, PUBLISHER_EMAIL, PUBLISHER_FULL_NAME } from '../../assets/legals';
import PrivacyPolicyEn from '../../assets/privacyPolicy-en.mdx';
import PrivacyPolicyFr from '../../assets/privacyPolicy-fr.mdx';
import MarkdownProvider from '../../components/MarkdownProvider';
import LegalHeader from '../../layout/LegalHeader';

const PrivacyPolicy: FC = () => {
  const { t, i18n } = useTranslation();

  const TranslatedPrivacyPolicy = i18n.resolvedLanguage === 'fr' ? PrivacyPolicyFr : PrivacyPolicyEn;

  return (
    <div>
      <LegalHeader title={t('footer.privacyPolicy')} />
      <Box mb={60}>
        <MarkdownProvider>
          <TranslatedPrivacyPolicy fullName={PUBLISHER_FULL_NAME} address={PUBLISHER_ADDRESS} email={PUBLISHER_EMAIL} />
        </MarkdownProvider>
      </Box>
    </div>
  );
};

export default PrivacyPolicy;
