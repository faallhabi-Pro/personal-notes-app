import React from 'react';
import { Link } from 'react-router-dom';
import NotesSection from '../components/NotesSection';
import Icon from '../components/Icon';
import { useLanguage } from '../contexts/LanguageContext';

function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <NotesSection archived={false} />
      <div className="homepage__action">
        <Link className="action" to="/notes/new" title={t('notes.addLabel')} aria-label={t('notes.addLabel')}>
          <Icon name="plus" />
        </Link>
      </div>
    </>
  );
}

export default HomePage;
