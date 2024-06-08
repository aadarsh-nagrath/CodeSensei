import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Language_versions } from '../constant';

const languageOptions = Object.entries(Language_versions);

const LanguageSelector = ({ language, languageSelect }: { language: string, languageSelect: (language: string) => void }) => {
  return (
    <>
      <div>
        <Select onValueChange={(value) => languageSelect(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={language} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {languageOptions.map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {key} <h2>{value}</h2>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default LanguageSelector;
