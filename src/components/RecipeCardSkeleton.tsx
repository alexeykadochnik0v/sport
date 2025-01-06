import { Card, CardContent, Skeleton, Box } from '@mui/material';

export const RecipeCardSkeleton = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton
        variant="rectangular"
        height={200}
        sx={{ bgcolor: 'grey.100' }}
        animation="wave"
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Skeleton
          variant="text"
          height={32}
          width="80%"
          sx={{ mb: 1 }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          height={20}
          width="90%"
          sx={{ mb: 0.5 }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          height={20}
          width="60%"
          sx={{ mb: 2 }}
          animation="wave"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Skeleton
            variant="rounded"
            height={32}
            width={100}
            animation="wave"
          />
          <Skeleton
            variant="rounded"
            height={32}
            width={100}
            animation="wave"
          />
        </Box>
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          animation="wave"
        />
        <Skeleton
          variant="circular"
          width={32}
          height={32}
          animation="wave"
        />
      </Box>
    </Card>
  );
};
