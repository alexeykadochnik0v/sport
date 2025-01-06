import { Box, Typography, useTheme } from '@mui/material';

interface CircleProgressProps {
  value: number;
  maxValue: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label: string;
  unit: string;
}

const CircleProgress = ({
  value,
  maxValue,
  color,
  size = 120,
  strokeWidth = 8,
  label,
  unit,
}: CircleProgressProps) => {
  const theme = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Убедимся, что значения не отрицательные и value не больше maxValue
  const safeValue = Math.max(0, Math.min(value || 0, maxValue || 1));
  const safeMaxValue = Math.max(1, maxValue || 1);
  
  // Вычисляем процент прогресса
  const progress = (safeValue / safeMaxValue) * 100;
  
  // Вычисляем strokeDashoffset
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        style={{
          transform: 'rotate(-90deg)',
          position: 'absolute',
        }}
      >
        {/* Фоновый круг */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={theme.palette.grey[200]}
          strokeWidth={strokeWidth}
        />
        {/* Прогресс */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${strokeDashoffset}`}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease',
          }}
        />
      </svg>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color }}>
          {Math.round(safeValue)}
          <Typography
            component="span"
            variant="caption"
            sx={{ ml: 0.5, color: 'text.secondary' }}
          >
            {unit}
          </Typography>
        </Typography>
        <Typography
          variant="caption"
          sx={{ 
            color: 'text.secondary', 
            maxWidth: '80px',
            mt: 0.5,
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

interface StatsCirclesProps {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  goals: {
    dailyCalories: number;
    dailyProtein: number;
    dailyFat: number;
    dailyCarbs: number;
  };
}

export const StatsCircles = ({ calories, protein, fat, carbs, goals }: StatsCirclesProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'grid',
      gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
      gap: 2,
      bgcolor: 'background.paper',
      p: 2,
      borderRadius: 1,
      boxShadow: 1,
      mb: 3
    }}>
      <CircleProgress
        value={calories}
        maxValue={goals.dailyCalories}
        color={theme.palette.primary.main}
        label="Калории"
        unit="ккал"
      />
      <CircleProgress
        value={protein}
        maxValue={goals.dailyProtein}
        color={theme.palette.success.main}
        label="Белки"
        unit="г"
      />
      <CircleProgress
        value={fat}
        maxValue={goals.dailyFat}
        color={theme.palette.warning.main}
        label="Жиры"
        unit="г"
      />
      <CircleProgress
        value={carbs}
        maxValue={goals.dailyCarbs}
        color={theme.palette.error.main}
        label="Углеводы"
        unit="г"
      />
    </Box>
  );
};
