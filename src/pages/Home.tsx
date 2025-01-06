import { useState } from 'react';
import { Container, Typography, Box, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { HomeImageSkeleton } from '../components/HomeImageSkeleton';
import { useTitle } from '../hooks/useTitle';

export const Home = () => {
  useTitle('Главная');
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 40 }} />,
      title: 'Здоровое питание',
      description: 'Следите за своим рационом и подсчитывайте калории с помощью нашего удобного дневника питания.',
      color: '#2196f3',
      link: '/diary'
    },
    {
      icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
      title: 'Рецепты',
      description: 'Откройте для себя коллекцию полезных и вкусных рецептов, которые помогут вам достичь ваших целей.',
      color: '#f50057',
      link: '/recipes'
    },
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Тренировки',
      description: 'Записывайте свои тренировки и отслеживайте прогресс на пути к лучшей версии себя.',
      color: '#00bfa5',
      link: '/diary'
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      title: 'Прогресс',
      description: 'Анализируйте свои достижения и поддерживайте мотивацию с помощью наглядной статистики.',
      color: '#ff9100',
      link: '/diary'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, position: 'relative', zIndex: 1 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                  }}
                >
                  Спорт и здоровое питание
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                  }}
                >
                  Достигайте своих целей с нашим приложением для отслеживания питания и тренировок
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/diary')}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Начать сейчас
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ position: 'relative' }}>
                {!imageLoaded && <HomeImageSkeleton />}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3"
                  alt="Здоровый образ жизни"
                  onLoad={() => setImageLoaded(true)}
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    display: imageLoaded ? 'block' : 'none',
                    animation: imageLoaded ? 'fadeIn 0.5s ease-in-out' : 'none',
                    '@keyframes fadeIn': {
                      from: { opacity: 0 },
                      to: { opacity: 1 },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Healthy Eating Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                {!imageLoaded && <HomeImageSkeleton />}
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3"
                  alt="Здоровое питание"
                  onLoad={() => setImageLoaded(true)}
                  sx={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '20px',
                    display: imageLoaded ? 'block' : 'none',
                    animation: imageLoaded ? 'fadeIn 0.5s ease-in-out' : 'none',
                    '@keyframes fadeIn': {
                      from: { opacity: 0 },
                      to: { opacity: 1 },
                    },
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  mb: 3,
                }}
              >
                Здоровое питание - путь к здоровью
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  color: 'text.secondary',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                }}
              >
                Откройте для себя мир здорового питания с нашими рецептами. Мы собрали коллекцию вкусных и полезных блюд, которые помогут вам достичь ваших целей в фитнесе и поддержании здорового образа жизни.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/recipes')}
                sx={{
                  background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  px: 4,
                  py: 1.5,
                }}
              >
                Перейти к рецептам
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${feature.color}15 30%, ${feature.color}08 90%)`,
                }}
                onClick={() => navigate(feature.link)}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: feature.color,
                    background: `${feature.color}15`,
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 3,
              }}
            >
              Готовы начать свой путь к здоровью?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.25rem' },
              }}
            >
              Присоединяйтесь к нам и сделайте первый шаг к лучшей версии себя
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/diary')}
              sx={{
                px: 6,
                py: 2,
                borderRadius: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Начать вести дневник
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};
