import Box from '@mui/material/Box';

import VideoPlayListCards from 'src/components/video-play-list-card/video-playlist-card';



// ----------------------------------------------------------------------

export function VideoPlayList({ title, list, ...other }) {
  return (
    <Box
      sx={{
        mt: 3,
        gap: 3,
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' },
      }}
    >
      <VideoPlayListCards
        Videotitle="Getting Started with Pabbly Hook"
        thumbnailname="pabbly-hook-video.png"
        videoId="https://www.youtube.com/embed/YBEA1SjtwQ0?si=TWN5meKNkJCfmGk2"
        
      />

     
    </Box>
  );
}
