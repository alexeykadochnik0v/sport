import { Box, Skeleton } from '@mui/material';

export const HomeImageSkeleton = () => {
  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        height: { xs: '300px', md: '500px' },
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="100%"
        animation="wave"
        sx={{
          bgcolor: 'grey.100',
          transform: 'scale(1)',
          transformOrigin: 'center',
        }}
      />
    </Box>
  );
};
