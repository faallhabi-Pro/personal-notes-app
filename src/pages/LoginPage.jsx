import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useInput from '../hooks/useInput';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [failure, setFailure] = useState('');

  const flash = location.state?.flash;

  const validate = () => {
    const found = {};
    if (!email.trim()) found.email = 'validation.emailRequired';
    else if (!EMAIL_PATTERN.test(email.trim())) found.email = 'validation.emailInvalid';
    if (!password) found.password = 'validation.passwordRequired';
    setErrors(found);
    return Object.keys(found).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading || !validate()) return;

    setLoading(true);
    setFailure('');
    try {
      const result = await login({ email: email.trim(), password });
      if (result.error) {
        setFailure(t('login.failed'));
        return;
      }
      navigate('/', {
        replace: true,
        state: { flash: { key: 'login.success', params: { name: result.user.name } } },
      });
    } catch (err) {
      setFailure(t('notes.networkError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <h2>{t('login.title')}</h2>
      {flash && <StatusMessage type="success">{t(flash.key, flash.params)}</StatusMessage>}
      <form className="input-login" onSubmit={handleSubmit} noValidate>
        <label htmlFor="login-email">{t('field.email')}</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={onEmailChange}
          disabled={loading}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
        />
        {errors.email && <p id="login-email-error" className="field-error" role="alert">{t(errors.email)}</p>}
        <label htmlFor="login-password">{t('field.password')}</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={onPasswordChange}
          disabled={loading}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
        />
        {errors.password && <p id="login-password-error" className="field-error" role="alert">{t(errors.password)}</p>}
        {failure && <StatusMessage type="error">{failure}</StatusMessage>}
        <button type="submit" disabled={loading}>
          {loading ? t('login.submitting') : t('login.submit')}
        </button>
      </form>
      <p className="auth-page__switch">
        {t('login.noAccount')} <Link to="/register">{t('login.registerLink')}</Link>
      </p>
    </section>
  );
}

export default LoginPage;
