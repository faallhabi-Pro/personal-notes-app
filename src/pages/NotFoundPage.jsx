import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="not-found-page">
      <h2>{t('notFound.title')}</h2>
      <p>{t('notFound.text')}</p>
      <Link to="/">{t('notFound.back')}</Link>
    </section>
  );
}

export default NotFoundPage;
