import { useTheme } from 'next-themes';
import React from 'react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center text-slate-600">
      {theme === 'dark' ? (
        <BsFillMoonFill
          size={25}
          role="button"
          onClick={() => setTheme('light')}
        />
      ) : (
        <BsFillSunFill
          size={28}
          role="button"
          onClick={() => setTheme('dark')}
        />
      )}
    </div>
  );
};

export default ThemeChanger;
