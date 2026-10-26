import React from 'react';
import { Link } from 'react-router-dom';
import parser from 'html-react-parser';
import { showFormattedDate } from '../utils';
import { sanitizeHtml } from '../utils/sanitize';
import { useLanguage } from '../contexts/LanguageContext';

function NoteItem({
  id, title, body, createdAt, archived, busy, onArchive, onUnarchive,
}) {
  const { t, dateLocale } = useLanguage();

  return (
    <article className="note-item">
      <h3 className="note-item__title">
        <Link to={`/notes/${id}`}>{title}</Link>
      </h3>
      <p className="note-item__createdAt">{showFormattedDate(createdAt, dateLocale)}</p>
      <div className="note-item__body">{parser(sanitizeHtml(body))}</div>
      <div className="note-item__actions">
        <button
          type="button"
          className="btn"
          disabled={busy}
          onClick={() => (archived ? onUnarchive(id) : onArchive(id))}
        >
          {busy && t('notes.archiving')}
          {!busy && (archived ? t('notes.unarchive') : t('notes.archive'))}
        </button>
      </div>
    </article>
  );
}

export default NoteItem;
