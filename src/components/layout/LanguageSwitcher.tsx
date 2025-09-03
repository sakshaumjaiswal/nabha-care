import React, { useState } from 'react';
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
];

interface LanguageSwitcherProps {
  currentLang?: string;
  onChange?: (lang: string) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  currentLang = 'en', 
  onChange 
}) => {
  const [selectedLang, setSelectedLang] = useState(currentLang);
  
  const currentLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    onChange?.(langCode);
    // Persist to localStorage
    localStorage.setItem('nabha-care-language', langCode);
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
            className={selectedLang === language.code ? 'bg-surface-elevated' : ''}
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