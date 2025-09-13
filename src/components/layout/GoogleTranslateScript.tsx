import React, { useEffect } from 'react';

// Extend the Window interface to inform TypeScript about the google translate function
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

// All the languages you want to support, matching your LanguageSwitcher
const languages = "en,hi,pa,bn,gu,ta,te,es,fr";

const GoogleTranslateScript: React.FC = () => {
  useEffect(() => {
    // Check if the script already exists to avoid duplicates during development hot-reloads
    if (document.getElementById('google-translate-script')) {
      return;
    }

    const addScript = document.createElement('script');
    addScript.id = 'google-translate-script';
    addScript.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
    addScript.async = true;
    document.body.appendChild(addScript);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en', // Your site's source language
          includedLanguages: languages,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false, // Prevent the widget from showing its own UI
        },
        'google_translate_element'
      );
    };

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const script = document.getElementById('google-translate-script');
      if (script) {
        document.body.removeChild(script);
      }
      delete window.googleTranslateElementInit;
    };
  }, []);

  // This div is required by the Google Translate script to initialize
  return <div id="google_translate_element" style={{ display: 'none' }} />;
};

export default GoogleTranslateScript;