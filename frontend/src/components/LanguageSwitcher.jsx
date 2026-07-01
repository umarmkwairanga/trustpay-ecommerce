import React, { useState } from 'react';

const LanguageSwitcher = ({ onLanguageChange }) => {
  const [lang, setLang] = useState('English');

  const handleChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    onLanguageChange(newLang); // This will trigger the parent state update
  };

  return (
    <select value={lang} onChange={handleChange} className="p-2 border rounded">
      <option value="English">English</option>
      <option value="Yoruba">Yoruba</option>
      <option value="Igbo">Igbo</option>
      <option value="Hausa">Hausa</option>
    </select>
  );
};

export default LanguageSwitcher;