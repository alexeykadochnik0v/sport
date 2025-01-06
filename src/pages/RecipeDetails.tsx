import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addDiaryEntry, DiaryEntry } from '../store/diarySlice';
import { Recipe, updateRecipe } from '../store/recipeSlice';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import { StatsCircles } from '../components/StatsCircles';
import { EditRecipeModal } from '../components/EditRecipeModal';
import { useTitle } from '../hooks/useTitle';

export const RecipeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const recipe = useSelector((state: RootState) =>
    state.recipes.recipes.find((r) => r.id === id)
  );

  const goals = useSelector((state: RootState) => state.diary.goals);

  useTitle(recipe?.title);

  if (!recipe) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Typography variant="h5">Рецепт не найден</Typography>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/recipes')}
          sx={{ mt: 2 }}
        >
          Вернуться к рецептам
        </Button>
      </Container>
    );
  }

  const handleAddToDiary = () => {
    setDialogOpen(true);
  };

  const handleConfirmAdd = () => {
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
    setDialogOpen(false);
  };

  const handleSaveRecipe = (updatedRecipe: Recipe) => {
    dispatch(updateRecipe(updatedRecipe));
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        {/* Шапка с кнопкой возврата */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 3 },
          mb: 3 
        }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/recipes')}
            sx={{ 
              alignSelf: { xs: 'flex-start', sm: 'center' },
              mb: { xs: 1, sm: 0 }
            }}
          >
            Вернуться к рецептам
          </Button>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '2rem' },
            flex: 1 
          }}>
            {recipe.title}
          </Typography>
        </Box>

        {/* Основное содержимое */}
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {/* Изображение */}
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              width: '100%',
              height: { xs: '200px', sm: '300px', md: '400px' },
              position: 'relative',
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>

          {/* Информация о рецепте */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: { xs: 2, sm: 3 } }}>
              {/* КБЖУ */}
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
                gap: 2,
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 1,
                boxShadow: 1
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Калории
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'primary.main' }}>
                    {recipe.calories}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ккал
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Белки
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'success.main' }}>
                    {recipe.protein}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    грамм
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Жиры
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'warning.main' }}>
                    {recipe.fat}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    грамм
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Углеводы
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'error.main' }}>
                    {recipe.carbs}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    грамм
                  </Typography>
                </Box>
              </Box>

              {/* Время приготовления */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Время приготовления: {recipe.time} минут
                </Typography>
              </Box>

              {/* Кнопки действий */}
              <Box sx={{ 
                display: 'flex',
                gap: { xs: 1, sm: 2 },
                mt: 'auto',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleAddToDiary}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  }}
                >
                  Добавить в дневник
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => setEditModalOpen(true)}
                  fullWidth
                >
                  Редактировать рецепт
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Ингредиенты и инструкции */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              {/* Ингредиенты */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Ингредиенты:
                </Typography>
                <List sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  '& .MuiListItem-root': { 
                    py: { xs: 1, sm: 1.5 }
                  }
                }}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <Box key={index}>
                      <ListItem>
                        <ListItemText primary={ingredient} />
                      </ListItem>
                      {index < recipe.ingredients.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </Box>

              {/* Инструкции */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  Инструкция по приготовлению:
                </Typography>
                {Array.isArray(recipe.instructions) && recipe.instructions.length > 0 ? (
                  <List sx={{ 
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    '& .MuiListItem-root': { 
                      py: { xs: 1, sm: 1.5 }
                    }
                  }}>
                    {recipe.instructions.map((instruction, index) => (
                      <Box key={index}>
                        <ListItem>
                          <ListItemText 
                            primary={`${index + 1}. ${instruction}`}
                            sx={{
                              '& .MuiListItemText-primary': {
                                lineHeight: 1.6,
                              },
                            }}
                          />
                        </ListItem>
                        {index < recipe.instructions.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    Инструкция по приготовлению не найдена.
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        disableRestoreFocus
      >
        <DialogTitle>Добавить в дневник</DialogTitle>
        <DialogContent>
          <Typography>
            Вы хотите добавить "{recipe.title}" в дневник питания?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirmAdd} variant="contained">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <EditRecipeModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        recipe={recipe}
        onSave={handleSaveRecipe}
      />
    </Container>
  );
};
