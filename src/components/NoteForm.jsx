import React, { useRef, useState } from 'react';
import Icon from './Icon';
import StatusMessage from './StatusMessage';
import useInput from '../hooks/useInput';
import { useLanguage } from '../contexts/LanguageContext';

function NoteForm({ onSubmit, submitting, submitError }) {
  const { t } = useLanguage();
  const bodyRef = useRef(null);
  const [title, onTitleChange] = useInput('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState({});

  const format = (command) => document.execCommand(command);

  const validate = () => {
    const found = {};
    if (!title.trim()) found.title = 'validation.titleRequired';
    if ((bodyRef.current?.innerText ?? '').trim() === '') found.body = 'validation.bodyRequired';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (submitting || !validate()) return;
    onSubmit({ title: title.trim(), body });
  };

  return (
    <form className="add-new-page" onSubmit={handleSubmit} noValidate>
      <div className="add-new-page__input">
        <input
          className="add-new-page__input__title"
          type="text"
          placeholder={t('form.titlePlaceholder')}
          aria-label={t('form.titleLabel')}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'title-error' : undefined}
          value={title}
          onChange={onTitleChange}
          disabled={submitting}
        />
        {errors.title && <p id="title-error" className="field-error" role="alert">{t(errors.title)}</p>}
        <div className="editor-toolbar">
          <button type="button" aria-label={t('form.bold')} title={t('form.bold')} onMouseDown={(e) => e.preventDefault()} onClick={() => format('bold')}><strong>B</strong></button>
          <button type="button" aria-label={t('form.italic')} title={t('form.italic')} onMouseDown={(e) => e.preventDefault()} onClick={() => format('italic')}><em>I</em></button>
        </div>
        <div
          ref={bodyRef}
          className="add-new-page__input__body"
          data-placeholder={t('form.bodyPlaceholder')}
          contentEditable={!submitting}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={t('form.bodyLabel')}
          aria-invalid={Boolean(errors.body)}
          aria-describedby={errors.body ? 'body-error' : undefined}
          onInput={(event) => setBody(event.currentTarget.innerHTML)}
        />
        {errors.body && <p id="body-error" className="field-error" role="alert">{t(errors.body)}</p>}
        {submitError && <StatusMessage type="error">{submitError}</StatusMessage>}
      </div>
      <div className="add-new-page__action">
        <button
          type="submit"
          className="action"
          title={submitting ? t('form.saving') : t('form.save')}
          aria-label={submitting ? t('form.saving') : t('form.save')}
          disabled={submitting}
        >
          {submitting ? <span className="spinner spinner--small" aria-hidden="true" /> : <Icon name="check" />}
        </button>
      </div>
    </form>
  );
}

export default NoteForm;
