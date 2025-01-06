import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Grid,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { RootState } from '../store/store';
import { EditDiaryEntryModal } from '../components/EditDiaryEntryModal';
import { StatsCircles } from '../components/StatsCircles';
import { format, isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { DiaryEntry, deleteDiaryEntry, DiaryGoals, updateGoals } from '../store/diarySlice';
import { useTitle } from '../hooks/useTitle';

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export const Diary = () => {
  useTitle('Дневник');
  const dispatch = useDispatch();
  const entries = useSelector((state: RootState) => state.diary.entries);
  const goals = useSelector((state: RootState) => state.diary.goals);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | undefined>(undefined);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  const [entryType, setEntryType] = useState<'all' | 'meal' | 'exercise'>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | undefined>(undefined);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [goalsDialogOpen, setGoalsDialogOpen] = useState(false);
  const [editedGoals, setEditedGoals] = useState<DiaryGoals>({
    dailyCalories: 2000,
    dailyProtein: 100,
    dailyFat: 70,
    dailyCarbs: 250,
  });

  const filteredEntries = useMemo(() => {
    let filtered = [...entries];

    // Фильтрация по типу
    if (entryType !== 'all') {
      filtered = filtered.filter(entry => entry.type === entryType);
    }

    // Фильтрация по времени
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    filtered = filtered.filter(entry => {
      const entryDate = new Date(entry.datetime);
      switch (timeFilter) {
        case 'today':
          return entryDate >= startOfToday;
        case 'week':
          return entryDate >= startOfWeek;
        case 'month':
          return entryDate >= startOfMonth;
        default:
          return true;
      }
    });

    // Сортировка по времени создания (новые записи сверху)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [entries, timeFilter, entryType]);

  const stats = useMemo(() => {
    return filteredEntries.reduce(
      (acc, entry) => ({
        calories: acc.calories + (entry.calories || 0),
        protein: acc.protein + (entry.protein || 0),
        fat: acc.fat + (entry.fat || 0),
        carbs: acc.carbs + (entry.carbs || 0),
      }),
      { calories: 0, protein: 0, fat: 0, carbs: 0 }
    );
  }, [filteredEntries]);

  const handleAddClick = () => {
    setSelectedEntry(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (entry: DiaryEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEntry(undefined);
  };

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      dispatch(deleteDiaryEntry(entryToDelete));
      setDeleteConfirmOpen(false);
      setEntryToDelete(undefined);
      setSnackbarOpen(true);
    }
  };

  const handleGoalsDialogOpen = () => {
    setEditedGoals(goals);
    setGoalsDialogOpen(true);
  };

  const handleGoalsDialogClose = () => {
    setGoalsDialogOpen(false);
  };

  const handleGoalsSave = () => {
    dispatch(updateGoals(editedGoals));
    setGoalsDialogOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, position: 'relative', minHeight: '90vh' }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 3
        }}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            Дневник питания и тренировок
          </Typography>

          <Box sx={{ 
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <FormControl size="small" sx={{ minWidth: 120, flex: { xs: 1, sm: 0 } }}>
              <InputLabel>Период</InputLabel>
              <Select
                value={timeFilter}
                label="Период"
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
              >
                <MenuItem value="today">Сегодня</MenuItem>
                <MenuItem value="week">Неделя</MenuItem>
                <MenuItem value="month">Месяц</MenuItem>
                <MenuItem value="all">Все</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120, flex: { xs: 1, sm: 0 } }}>
              <InputLabel>Тип записей</InputLabel>
              <Select
                value={entryType}
                label="Тип записей"
                onChange={(e) => setEntryType(e.target.value as 'all' | 'meal' | 'exercise')}
              >
                <MenuItem value="all">Все записи</MenuItem>
                <MenuItem value="meal">Питание</MenuItem>
                <MenuItem value="exercise">Тренировки</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <StatsCircles
            calories={stats.calories}
            protein={stats.protein}
            fat={stats.fat}
            carbs={stats.carbs}
            goals={goals}
          />
          <IconButton
            onClick={handleGoalsDialogOpen}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'grey.100',
              },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        {filteredEntries.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Нет записей за выбранный период
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredEntries.map((entry) => (
              <Grid item xs={12} md={6} lg={4} key={entry.id}>
                <Paper
                  sx={{
                    p: 0,
                    overflow: 'hidden',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: (theme) => theme.shadows[4],
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  {entry.imageUrl && (
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={entry.imageUrl}
                        alt={entry.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )}
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ wordBreak: 'break-word', flex: 1 }}>
                        {entry.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                        <Tooltip title="Редактировать">
                          <IconButton
                            size="small"
                            onClick={() => handleEditClick(entry)}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              boxShadow: theme => theme.shadows[2],
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(entry.id)}
                            sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              boxShadow: theme => theme.shadows[2],
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {format(parseISO(entry.datetime), 'PPpp', { locale: ru })}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <Typography variant="body2">
                        {entry.calories} ккал
                      </Typography>
                      {entry.type === 'meal' && (
                        <>
                          <Typography variant="body2" color="success.main">
                            Б: {entry.protein}г
                          </Typography>
                          <Typography variant="body2" color="warning.main">
                            Ж: {entry.fat}г
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            У: {entry.carbs}г
                          </Typography>
                        </>
                      )}
                    </Box>

                    {entry.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {entry.notes}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Плавающая кнопка добавления */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddClick}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2 30%, #1CA7F3 90%)',
          },
        }}
      >
        <AddIcon />
      </Fab>

      <EditDiaryEntryModal
        open={isModalOpen}
        onClose={handleCloseModal}
        entry={selectedEntry}
      />

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Удалить запись</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить эту запись?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Отмена</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={goalsDialogOpen} onClose={handleGoalsDialogClose}>
        <DialogTitle>Настройка целей</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Калории (ккал)"
              type="number"
              value={editedGoals.dailyCalories}
              onChange={(e) => setEditedGoals({ ...editedGoals, dailyCalories: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Белки (г)"
              type="number"
              value={editedGoals.dailyProtein}
              onChange={(e) => setEditedGoals({ ...editedGoals, dailyProtein: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Жиры (г)"
              type="number"
              value={editedGoals.dailyFat}
              onChange={(e) => setEditedGoals({ ...editedGoals, dailyFat: Number(e.target.value) })}
              fullWidth
            />
            <TextField
              label="Углеводы (г)"
              type="number"
              value={editedGoals.dailyCarbs}
              onChange={(e) => setEditedGoals({ ...editedGoals, dailyCarbs: Number(e.target.value) })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleGoalsDialogClose}>Отмена</Button>
          <Button onClick={handleGoalsSave} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Запись успешно удалена
        </Alert>
      </Snackbar>
    </Container>
  );
};
