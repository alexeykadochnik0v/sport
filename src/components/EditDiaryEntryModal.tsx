import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ru } from 'date-fns/locale';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { DiaryEntry, addDiaryEntry, updateDiaryEntry } from '../store/diarySlice';

interface EditDiaryEntryModalProps {
  open: boolean;
  onClose: () => void;
  entry?: DiaryEntry;
}

const defaultFormData: Partial<DiaryEntry> = {
  type: 'meal',
  name: '',
  datetime: new Date().toISOString(),
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  notes: '',
  imageUrl: '',
};

export const EditDiaryEntryModal: React.FC<EditDiaryEntryModalProps> = ({
  open,
  onClose,
  entry,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Partial<DiaryEntry>>(defaultFormData);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (entry) {
      // Если есть entry, заполняем форму данными для редактирования
      setFormData({
        type: entry.type,
        name: entry.name,
        datetime: entry.datetime,
        calories: entry.calories,
        protein: entry.protein || 0,
        fat: entry.fat || 0,
        carbs: entry.carbs || 0,
        notes: entry.notes || '',
        imageUrl: entry.imageUrl || '',
      });
      setImagePreview(entry.imageUrl || '');
    } else {
      // Если entry нет, сбрасываем форму к начальным значениям
      setFormData(defaultFormData);
      setImagePreview('');
    }
  }, [entry, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<'meal' | 'exercise'>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
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

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData(prev => ({
        ...prev,
        datetime: newDate.toISOString(),
      }));
    }
  };

  const handleSave = () => {
    if (formData.name && formData.type && formData.datetime) {
      const entryData: DiaryEntry = {
        id: entry?.id || Date.now().toString(),
        type: formData.type as 'meal' | 'exercise',
        name: formData.name,
        datetime: formData.datetime,
        calories: Number(formData.calories) || 0,
        protein: formData.type === 'meal' ? Number(formData.protein) || 0 : undefined,
        fat: formData.type === 'meal' ? Number(formData.fat) || 0 : undefined,
        carbs: formData.type === 'meal' ? Number(formData.carbs) || 0 : undefined,
        notes: formData.notes,
        imageUrl: formData.imageUrl,
        createdAt: entry?.createdAt || new Date().toISOString(),
      };

      if (entry) {
        dispatch(updateDiaryEntry(entryData));
      } else {
        dispatch(addDiaryEntry(entryData));
      }
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        },
      }}
      disableRestoreFocus
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
        }}
      >
        <Box component="span">
          {entry ? 'Редактировать запись' : 'Новая запись'}
        </Box>
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
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Тип записи</InputLabel>
                <Select
                  name="type"
                  value={formData.type || 'meal'}
                  onChange={handleChange}
                  label="Тип записи"
                >
                  <MenuItem value="meal">Питание</MenuItem>
                  <MenuItem value="exercise">Тренировка</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Название"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <DateTimePicker
                  label="Дата и время"
                  value={formData.datetime ? new Date(formData.datetime) : null}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                    },
                  }}
                />
              </LocalizationProvider>

              <Box>
                <Box component="span" sx={{ display: 'block', mb: 1, fontWeight: 500 }}>
                  Изображение
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
                  Загрузить изображение
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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

              {formData.type === 'meal' && (
                <>
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
                </>
              )}

              <TextField
                label="Заметки"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
              />
            </Box>
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
