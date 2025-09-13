import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

// Helper function to read the current language from Google's cookie
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
};

const getCurrentLangCode = (): string => {
  const cookieValue = getCookie('googtrans');
  if (cookieValue) {
    const langCode = cookieValue.split('/')[2];
    return langCode || 'en';
  }
  return 'en';
};

export const LanguageSwitcher: React.FC = () => {
  const currentLangCode = getCurrentLangCode();
  const currentLanguage = languages.find(lang => lang.code === currentLangCode) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    // Set the cookie that the Google Translate script reads
    const date = new Date();
    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = `googtrans=/en/${langCode}${expires}; path=/; SameSite=Lax`;

    // The widget requires a page reload to apply the translation
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-3">
          <Globe className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
          <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLangCode === language.code ? 'bg-surface-elevated' : ''}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};