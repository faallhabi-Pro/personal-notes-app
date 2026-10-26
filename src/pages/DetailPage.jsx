import React, { useCallback, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import parser from 'html-react-parser';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import StatusMessage from '../components/StatusMessage';
import NotFoundPage from './NotFoundPage';
import useAsyncData from '../hooks/useAsyncData';
import { useLanguage } from '../contexts/LanguageContext';
import { showFormattedDate } from '../utils';
import { sanitizeHtml } from '../utils/sanitize';
import {
  getNote, deleteNote, archiveNote, unarchiveNote,
} from '../utils/network-data';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, dateLocale } = useLanguage();
  const fetchNote = useCallback(() => getNote(id), [id]);
  const { data: note, loading, error, reload } = useAsyncData(fetchNote);
  const [pending, setPending] = useState(null); // 'delete' | 'archive' | null
  const [actionError, setActionError] = useState('');

  if (loading) return <Loading text={t('detail.loading')} />;
  if (error === 'network') {
    return (
      <div>
        <StatusMessage type="error">{t('notes.networkError')}</StatusMessage>
        <button type="button" className="btn" onClick={reload}>{t('notes.retry')}</button>
      </div>
    );
  }
  if (error || !note) return <NotFoundPage />;

  const handleDelete = async () => {
    if (pending || !window.confirm(t('notes.confirmDelete'))) return;
    setPending('delete');
    setActionError('');
    try {
      const result = await deleteNote(note.id);
      if (result.error) {
        setActionError(t('notes.actionFailed'));
        return;
      }
      navigate(note.archived ? '/archives' : '/', { state: { flash: { key: 'notes.deleted' } } });
    } catch (err) {
      setActionError(t('notes.networkError'));
    } finally {
      setPending(null);
    }
  };

  const handleArchiveToggle = async () => {
    if (pending) return;
    setPending('archive');
    setActionError('');
    try {
      const result = await (note.archived ? unarchiveNote(note.id) : archiveNote(note.id));
      if (result.error) {
        setActionError(t('notes.actionFailed'));
        return;
      }
      navigate(note.archived ? '/' : '/archives', {
        state: { flash: { key: note.archived ? 'notes.unarchived' : 'notes.archived' } },
      });
    } catch (err) {
      setActionError(t('notes.networkError'));
    } finally {
      setPending(null);
    }
  };

  return (
    <section className="detail-page">
      <Link className="back-link" to={note.archived ? '/archives' : '/'}>&larr; {t('detail.back')}</Link>
      <h2 className="detail-page__title">{note.title}</h2>
      <p className="detail-page__createdAt">{showFormattedDate(note.createdAt, dateLocale)}</p>
      <div className="detail-page__body">{parser(sanitizeHtml(note.body))}</div>
      {actionError && <StatusMessage type="error">{actionError}</StatusMessage>}
      <div className="detail-page__action">
        <button
          type="button"
          className="action action--labeled"
          disabled={Boolean(pending)}
          onClick={handleArchiveToggle}
        >
          <Icon name={note.archived ? 'unarchive' : 'archive'} />
          <span>
            {pending === 'archive'
              ? t('notes.archiving')
              : t(note.archived ? 'notes.unarchive' : 'notes.archive')}
          </span>
        </button>
        <button
          type="button"
          className="action action--labeled action--danger"
          disabled={Boolean(pending)}
          onClick={handleDelete}
        >
          <Icon name="trash" />
          <span>{pending === 'delete' ? t('notes.deleting') : t('notes.delete')}</span>
        </button>
      </div>
    </section>
  );
}

export default DetailPage;
