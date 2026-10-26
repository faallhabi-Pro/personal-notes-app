import React, { useRef, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Icon from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    language, changeLanguage, t, supportedLanguages, currentLangMeta,
  } = useLanguage();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (code) => {
    changeLanguage(code);
    setDropdownOpen(false);
  };

  return (
    <header>
      <h1><Link to="/">{t('appName')}</Link></h1>
      {user && (
        <nav className="navigation" aria-label={t('nav.main')}>
          <ul>
            <li><NavLink to="/" end>{t('nav.active')}</NavLink></li>
            <li><NavLink to="/archives">{t('nav.archive')}</NavLink></li>
          </ul>
        </nav>
      )}

      {/* Language Selector Dropdown */}
      <div className="lang-selector" ref={dropdownRef}>
        <button
          type="button"
          className="toggle-locale"
          onClick={() => setDropdownOpen((prev) => !prev)}
          aria-label={t('lang.switch')}
          title={t('lang.switch')}
          aria-expanded={dropdownOpen}
          aria-haspopup="listbox"
          id="lang-selector-btn"
        >
          <Icon name="translate" />
          <span className="toggle-locale__code">
            {currentLangMeta.flag}
            {' '}
            {currentLangMeta.code.toUpperCase()}
          </span>
          <span className="lang-selector__chevron" aria-hidden="true">▾</span>
        </button>

        {dropdownOpen && (
          <ul
            className="lang-dropdown"
            role="listbox"
            aria-labelledby="lang-selector-btn"
          >
            {supportedLanguages.map((lang) => (
              <li key={lang.code} role="option" aria-selected={lang.code === language}>
                <button
                  type="button"
                  className={`lang-dropdown__item${lang.code === language ? ' lang-dropdown__item--active' : ''}`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <span className="lang-dropdown__flag">{lang.flag}</span>
                  <span className="lang-dropdown__native">{lang.nativeLabel}</span>
                  <span className="lang-dropdown__label">{lang.label}</span>
                  {lang.code === language && (
                    <span className="lang-dropdown__check" aria-hidden="true">✓</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="button"
        className="toggle-theme"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
        title={theme === 'dark' ? t('theme.toLight') : t('theme.toDark')}
      >
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
      {user && (
        <button type="button" className="button-logout" onClick={logout} title={t('auth.logout')}>
          <Icon name="logout" />
          <span className="button-logout__label">{user.name}</span>
          <span className="visually-hidden">{t('auth.logout')}</span>
        </button>
      )}
    </header>
  );
}

export default Header;
