import React, { useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import SearchBar from './SearchBar';
import NoteList from './NoteList';
import Loading from './Loading';
import StatusMessage from './StatusMessage';
import useAsyncData from '../hooks/useAsyncData';
import { useLanguage } from '../contexts/LanguageContext';
import {
  getActiveNotes, getArchivedNotes, archiveNote, unarchiveNote,
} from '../utils/network-data';

function NotesSection({ archived }) {
  const { t } = useLanguage();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') ?? '';
  const { data, loading, error, reload } = useAsyncData(archived ? getArchivedNotes : getActiveNotes);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState(null);

  const flash = location.state?.flash;

  const onKeywordChange = (value) => {
    setSearchParams(value ? { keyword: value } : {}, { replace: true });
  };

  const runAction = async (id, apiCall, successKey) => {
    if (busyId) return;
    setBusyId(id);
    setMessage(null);
    try {
      const result = await apiCall(id);
      if (result.error) {
        setMessage({ type: 'error', text: t('notes.actionFailed') });
      } else {
        setMessage({ type: 'success', text: t(successKey) });
        reload();
      }
    } catch (err) {
      setMessage({ type: 'error', text: t('notes.networkError') });
    } finally {
      setBusyId(null);
    }
  };

  const onArchive = (id) => runAction(id, archiveNote, 'notes.archived');
  const onUnarchive = (id) => runAction(id, unarchiveNote, 'notes.unarchived');

  const notes = (data ?? []).filter((note) => note.title.toLowerCase().includes(keyword.trim().toLowerCase()));
  const emptyMessage = keyword.trim()
    ? t('notes.emptyMatch')
    : t(archived ? 'notes.emptyArchive' : 'notes.emptyActive');

  const renderContent = () => {
    if (loading && !data) return <Loading text={t('notes.loading')} />;
    if (error) {
      return (
        <div>
          <StatusMessage type="error">
            {t(error === 'network' ? 'notes.networkError' : 'notes.loadFailed')}
          </StatusMessage>
          <button type="button" className="btn" onClick={reload}>{t('notes.retry')}</button>
        </div>
      );
    }
    return (
      <NoteList
        notes={notes}
        busyId={busyId}
        emptyMessage={emptyMessage}
        onArchive={onArchive}
        onUnarchive={onUnarchive}
      />
    );
  };

  return (
    <section className="notes-page">
      <h2>{t(archived ? 'notes.archiveHeading' : 'notes.activeHeading')}</h2>
      {flash && !message && (
        <StatusMessage type="success">{t(flash.key, flash.params)}</StatusMessage>
      )}
      {message && <StatusMessage type={message.type}>{message.text}</StatusMessage>}
      <SearchBar keyword={keyword} onKeywordChange={onKeywordChange} />
      {renderContent()}
    </section>
  );
}

export default NotesSection;
