import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Stack,
  Grid,
  Divider,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Recipe } from '../store/recipeSlice';

interface EditRecipeModalProps {
  open: boolean;
  onClose: () => void;
  recipe: Recipe;
  onSave: (updatedRecipe: Recipe) => void;
}

export const EditRecipeModal: React.FC<EditRecipeModalProps> = ({
  open,
  onClose,
  recipe,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: recipe.title,
    imageUrl: recipe.imageUrl,
    ingredients: recipe.ingredients.join('\n'),
    instructions: recipe.instructions.join('\n'),
    calories: recipe.calories,
    protein: recipe.protein,
    fat: recipe.fat,
    carbs: recipe.carbs,
    time: recipe.time,
  });

  const [imagePreview, setImagePreview] = useState(recipe.imageUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        setFormData(prev => ({
          ...prev,
          imageUrl,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedRecipe: Recipe = {
      ...recipe,
      title: formData.title,
      imageUrl: formData.imageUrl,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      instructions: formData.instructions.split('\n').filter(i => i.trim()),
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      fat: Number(formData.fat),
      carbs: Number(formData.carbs),
      time: Number(formData.time),
    };
    onSave(updatedRecipe);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      disableRestoreFocus
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        m: 0, 
        p: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
        color: 'white'
      }}>
        <Box component="span">Редактировать рецепт</Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Левая колонка */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField
                label="Название рецепта"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
              />

              <Box>
                <Box component="span" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                  Изображение рецепта
                </Box>
                {imagePreview && (
                  <Box
                    sx={{
                      width: '100%',
                      height: 200,
                      mb: 2,
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUploadIcon />}
                  sx={{ width: '100%' }}
                >
                  Загрузить новое изображение
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>

              <Box>
                <Box component="span" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                  Пищевая ценность
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Калории"
                      name="calories"
                      type="number"
                      value={formData.calories}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">ккал</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Время приготовления"
                      name="time"
                      type="number"
                      value={formData.time}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">мин</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Белки"
                      name="protein"
                      type="number"
                      value={formData.protein}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">г</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Жиры"
                      name="fat"
                      type="number"
                      value={formData.fat}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">г</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="Углеводы"
                      name="carbs"
                      type="number"
                      value={formData.carbs}
                      onChange={handleChange}
                      fullWidth
                      InputProps={{
                        endAdornment: <InputAdornment position="end">г</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          </Grid>

          {/* Правая колонка */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField
                label="Ингредиенты"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                multiline
                rows={6}
                fullWidth
                helperText="Каждый ингредиент с новой строки"
              />

              <TextField
                label="Инструкция по приготовлению"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                multiline
                rows={8}
                fullWidth
                helperText="Каждый шаг с новой строки"
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          }}
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
