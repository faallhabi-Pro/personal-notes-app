import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from '../components/NoteForm';
import { useLanguage } from '../contexts/LanguageContext';
import { addNote } from '../utils/network-data';

function AddPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (note) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const { error } = await addNote(note);
      if (error) {
        setSubmitError(t('form.addFailed'));
        return;
      }
      navigate('/', { state: { flash: { key: 'notes.added' } } });
    } catch (err) {
      setSubmitError(t('notes.networkError'));
    } finally {
      setSubmitting(false);
    }
  };

  return <NoteForm onSubmit={handleSubmit} submitting={submitting} submitError={submitError} />;
}

export default AddPage;
