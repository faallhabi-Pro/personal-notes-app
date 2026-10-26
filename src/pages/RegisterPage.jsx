import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import StatusMessage from '../components/StatusMessage';
import { useLanguage } from '../contexts/LanguageContext';
import { register } from '../utils/network-data';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

function RegisterPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirmPassword, onConfirmPasswordChange] = useInput('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState('');

  const validate = () => {
    const found = {};
    if (!name.trim()) found.name = 'validation.nameRequired';
    if (!email.trim()) found.email = 'validation.emailRequired';
    else if (!EMAIL_PATTERN.test(email.trim())) found.email = 'validation.emailInvalid';
    if (!password) found.password = 'validation.passwordRequired';
    else if (password.length < MIN_PASSWORD_LENGTH) found.password = 'validation.passwordMin';
    if (confirmPassword !== password) found.confirmPassword = 'validation.confirmMismatch';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || !validate()) return;

    setLoading(true);
    setFailure('');
    try {
      const result = await register({ name: name.trim(), email: email.trim(), password });
      if (result.error) {
        setFailure(result.message || t('register.failed'));
        return;
      }
      navigate('/login', { state: { flash: { key: 'register.success' } } });
    } catch (err) {
      setFailure(t('notes.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      id: 'register-name', key: 'name', label: 'field.name', type: 'text', autoComplete: 'name', value: name, onChange: onNameChange,
    },
    {
      id: 'register-email', key: 'email', label: 'field.email', type: 'email', autoComplete: 'email', value: email, onChange: onEmailChange,
    },
    {
      id: 'register-password', key: 'password', label: 'field.password', type: 'password', autoComplete: 'new-password', value: password, onChange: onPasswordChange,
    },
    {
      id: 'register-confirm', key: 'confirmPassword', label: 'field.confirmPassword', type: 'password', autoComplete: 'new-password', value: confirmPassword, onChange: onConfirmPasswordChange,
    },
  ];

  return (
    <section className="auth-page">
      <h2>{t('register.title')}</h2>
      <form className="input-register" onSubmit={handleSubmit} noValidate>
        {fields.map((field) => (
          <React.Fragment key={field.key}>
            <label htmlFor={field.id}>{t(field.label)}</label>
            <input
              id={field.id}
              type={field.type}
              autoComplete={field.autoComplete}
              value={field.value}
              onChange={field.onChange}
              disabled={loading}
              aria-invalid={Boolean(errors[field.key])}
              aria-describedby={errors[field.key] ? `${field.id}-error` : undefined}
            />
            {errors[field.key] && (
              <p id={`${field.id}-error`} className="field-error" role="alert">{t(errors[field.key])}</p>
            )}
          </React.Fragment>
        ))}
        {failure && <StatusMessage type="error">{failure}</StatusMessage>}
        <button type="submit" disabled={loading}>
          {loading ? t('register.submitting') : t('register.submit')}
        </button>
      </form>
      <p className="auth-page__switch">
        {t('register.haveAccount')} <Link to="/login">{t('register.loginLink')}</Link>
      </p>
    </section>
  );
}

export default RegisterPage;
