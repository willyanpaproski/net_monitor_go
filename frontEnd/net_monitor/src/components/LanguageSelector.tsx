import { useState } from 'react';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useI18n } from '../hooks/usei18n';

export default function LanguageSelector() {
    const { t } = useI18n();
    const { currentLanguage, changeLanguage } = useLanguageContext();
    const [isOpen, setIsOpen] = useState(false);
    
    const languages = [
        { code: 'pt', name: t('languageSelector.pt') || 'Português', flag: '🇧🇷' },
        { code: 'en', name: t('languageSelector.en') || 'English', flag: '🇺🇸' },
        { code: 'es', name: t('languageSelector.es') || 'Español', flag: '🇪🇸' }
    ];

    const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

    const handleLanguageSelect = (languageCode: string) => {
        changeLanguage(languageCode);
        setIsOpen(false);
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000
        }}>
            <button
                onClick={toggleDropdown}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 15px',
                    backgroundColor: '#000',
                    border: '2px solid #e1e5e9',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    minWidth: '130px',
                    transition: 'all 0.2s ease'
                }}
            >
                <span style={{ fontSize: '18px' }}>
                    {currentLang.flag}
                </span>
                <span>{currentLang.name}</span>
                <span style={{
                    fontSize: '12px',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                }}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <>
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            marginTop: '5px',
                            backgroundColor: '#ffffff',
                            border: '2px solid #e1e5e9',
                            borderRadius: '8px',
                            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                            overflow: 'hidden',
                            minWidth: '150px'
                        }}
                    >
                        {languages.map((language) => (
                            <button
                                key={language.code}
                                onClick={() => handleLanguageSelect(language.code)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    width: '100%',
                                    padding: '12px 15px',
                                    backgroundColor: currentLanguage === language.code ? '#f0f8ff' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    textAlign: 'left',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentLanguage !== language.code) {
                                        (e.target as HTMLElement).style.backgroundColor = '#f8f9fa';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentLanguage !== language.code) {
                                        (e.target as HTMLElement).style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>
                                    {language.flag}
                                </span>
                                <span style={{
                                    fontWeight: currentLanguage === language.code ? '600' : '400',
                                    color: currentLanguage === language.code ? '#007bff' : '#333'
                                }}>
                                    {language.name}
                                </span>
                                {currentLanguage === language.code && (
                                    <span style={{
                                        marginLeft: 'auto',
                                        color: '#007bff',
                                        fontSize: '14px'
                                    }}>
                                        ✓
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    <div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: -1
                        }}
                        onClick={() => setIsOpen(false)}
                    />
                </>
            )}
        </div>
    );
}