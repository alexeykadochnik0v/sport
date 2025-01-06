import { useEffect } from 'react';

const BASE_TITLE = 'Дневник здоровья';

export const useTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
    
    return () => {
      document.title = BASE_TITLE;
    };
  }, [title]);
};
