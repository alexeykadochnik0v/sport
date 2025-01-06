import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTitle } from '../hooks/useTitle';

export const NotFound = () => {
  const navigate = useNavigate();
  useTitle('Страница не найдена | Дневник здоровья');

  useEffect(() => {
    // Обновляем заголовок при монтировании компонента
    document.title = 'Страница не найдена | Дневник здоровья';
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      textAlign="center"
      px={2}
    >
      <Typography variant="h1" color="primary" sx={{ fontSize: { xs: '4rem', sm: '6rem' }, mb: 2 }}>
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
        Упс! Страница не найдена
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/')}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};
