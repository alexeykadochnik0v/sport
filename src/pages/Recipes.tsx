import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  CardActionArea,
  CardActions,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import placeholderImage from '../assets/placeholder-recipe.svg';
import { RootState } from '../store/store';
import { Recipe, updateRecipe, resetRecipes } from '../store/recipeSlice';
import { addDiaryEntry, DiaryEntry } from '../store/diarySlice';
import { EditRecipeModal } from '../components/EditRecipeModal';
import { RecipeCardSkeleton } from '../components/RecipeCardSkeleton';
import { useTitle } from '../hooks/useTitle';

export const Recipes = () => {
  useTitle('Рецепты');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipes = useSelector((state: RootState) => state.recipes.recipes);

  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    // Если нет рецептов, прекращаем загрузку
    if (recipes.length === 0) {
      setLoading(false);
      return;
    }

    // Сбрасываем состояние загруженных изображений при изменении списка рецептов
    setLoadedImages(new Set());
    setLoading(true);

    // Предзагружаем все изображения
    recipes.forEach(recipe => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => {
          const newSet = new Set(prev);
          newSet.add(recipe.id);
          // Если все изображения загружены, убираем состояние загрузки
          if (newSet.size === recipes.length) {
            setLoading(false);
          }
          return newSet;
        });
      };
      img.onerror = () => {
        setLoadedImages(prev => {
          const newSet = new Set(prev);
          newSet.add(recipe.id);
          // Даже если изображение не загрузилось, считаем его обработанным
          if (newSet.size === recipes.length) {
            setLoading(false);
          }
          return newSet;
        });
      };
      img.src = recipe.imageUrl;
    });
  }, [recipes]);

  const handleRecipeClick = (id: string) => {
    navigate(`/recipes/${id}`);
  };

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = placeholderImage;
  };

  const handleEditClick = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    setEditingRecipe(recipe);
  };

  const handleAddToDiary = (recipe: Recipe, event: React.MouseEvent) => {
    event.stopPropagation();
    const now = new Date().toISOString();
    const diaryEntry: Partial<DiaryEntry> = {
      id: Date.now().toString(),
      type: 'meal',
      name: recipe.title,
      datetime: now,
      calories: recipe.calories,
      protein: recipe.protein,
      fat: recipe.fat,
      carbs: recipe.carbs,
      notes: `Приготовлено по рецепту "${recipe.title}"`,
      imageUrl: recipe.imageUrl,
      createdAt: now,
    };
    
    dispatch(addDiaryEntry(diaryEntry as DiaryEntry));
    setShowSnackbar(true);
  };

  const handleSaveRecipe = (updatedRecipe: Recipe) => {
    dispatch(updateRecipe(updatedRecipe));
    setEditingRecipe(null);
  };

  const handleResetData = () => {
    dispatch(resetRecipes()); // Очищаем localStorage
    window.location.reload(); // Перезагружаем страницу
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            Полезные рецепты
          </Typography>
          {/* Кнопка сброса данных (временно скрыта)
           * Используется для отладки приложения, позволяет быстро очистить localStorage
           * и вернуть данные к исходному состоянию
           */}
          {/* <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={handleResetData}
            color="primary"
            sx={{ width: { xs: '100%', sm: 'auto' }, mt: 2 }}
          >
            Сбросить данные
          </Button> */}
        </Box>

        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ maxWidth: '1400px', margin: '0 auto' }}>
          {loading ? (
            // Показываем скелетон во время загрузки
            [...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <RecipeCardSkeleton />
              </Grid>
            ))
          ) : (
            // Показываем рецепты после загрузки
            recipes.map((recipe) => (
              <Grid item xs={12} sm={6} lg={4} key={recipe.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleRecipeClick(recipe.id)}>
                    <CardMedia
                      component="img"
                      height="250"
                      image={recipe.imageUrl}
                      alt={recipe.title}
                      onError={handleImageError}
                      sx={{ 
                        objectFit: 'cover',
                        backgroundColor: 'grey.100'
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, sm: 2 } }}>
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        gutterBottom
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        {recipe.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          mb: 2,
                        }}
                      >
                        {recipe.ingredients.join(', ')}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: { xs: 0.5, sm: 1 }, 
                        flexWrap: 'wrap' 
                      }}>
                        <Chip
                          icon={<LocalFireDepartmentIcon />}
                          label={`${recipe.calories} ккал`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={`${recipe.time} мин`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  <CardActions sx={{ 
                    justifyContent: 'flex-end', 
                    px: { xs: 1, sm: 2 }, 
                    pb: { xs: 1, sm: 2 } 
                  }}>
                    <Tooltip title="Приготовил">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleAddToDiary(recipe, e)}
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': { 
                            bgcolor: 'primary.light',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Редактировать">
                      <IconButton 
                        size="small"
                        onClick={(e) => handleEditClick(e, recipe)}
                        sx={{ 
                          color: 'primary.main',
                          '&:hover': { 
                            bgcolor: 'primary.light',
                            transform: 'scale(1.1)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>

        {editingRecipe && (
          <EditRecipeModal
            open={!!editingRecipe}
            onClose={() => setEditingRecipe(null)}
            recipe={editingRecipe}
            onSave={handleSaveRecipe}
          />
        )}

        <Snackbar
          open={showSnackbar}
          autoHideDuration={3000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Блюдо добавлено в дневник
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
