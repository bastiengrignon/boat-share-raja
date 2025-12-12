import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import LegalHeader from '../../layout/LegalHeader';

const PrivacyPolicy: FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <LegalHeader title={t('footer.privacyPolicy')} />
    </div>
  );
};

export default PrivacyPolicy;
