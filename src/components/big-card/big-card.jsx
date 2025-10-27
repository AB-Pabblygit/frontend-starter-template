import { Box, Card, Link, Tooltip, Typography } from '@mui/material';

import VideoModal from '../video-modal/video-modal';

export default function BigCard({
  getHelp,
  isVideo,
  coverSrc,
  items,
  style,
  action,
  videoLink,
  tooltip,
  thumbnailName,
  bigcardtitle,
  bigcardsubtitle,
  showNote = true,
  bigcardNote,
  keyword,
  learnMoreLink = '#', // Added default prop for learn more link
}) {
  return (
    <Card sx={{ p: 5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', lg: 'center' },
          mb: 0,
          gap: 3,
        }}
      >
        <Box width={{ xs: '100%', lg: '60%' }}>
          <Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h6">
                <Tooltip arrow placement="top" title={tooltip}>
                  <span>{bigcardtitle}</span>
                </Tooltip>
              </Typography>

              <Typography color="#637381" fontSize="14px" fontWeight={500} mt={1}>
                {bigcardsubtitle}
              </Typography>
            </Box>

            {/* Render List Items */}
            <Box component="ul" gap="4px" display="flex" flexDirection="column" sx={style} p={1} pb={2}>
              {items.map((item, index) => (
                <li key={index}>
                  <Typography variant="body2" fontWeight={500}   sx={{
                      '[data-mui-color-scheme="light"] &': { color: '#637381' },
                      '[data-mui-color-scheme="dark"] &': {
                        color: 'var(--palette-text-secondary)',
                      },
                    }}>
                    {typeof item === 'string' ? (
                      // If item is a string, render it directly
                      item
                    ) : (
                      // If item is an object, check for `step` and `description` fields
                      <>
                        <strong>{item.step}</strong> {item.description}
                        {item.link && (
                          <>
                          
                            <Link
                              href={item.link.url}
                              sx={{
                                cursor: 'pointer',
                                '[data-mui-color-scheme="light"] &': {
                                  color: '#0c68e9',
                                },
                                '[data-mui-color-scheme="dark"] &': {
                                  color: '#078dee',
                                },
                              }}
                              underline="always"
                              target="_blank"
                            >
                              {item.link.text}
                            </Link>
                            {item.suffix}
                          </>
                        )}
                      </>
                    )}

                    {/* Render "Learn More" Link after the last item */}
                    {index === items.length - 1 && (
                      <Link
                        href={learnMoreLink}
                        sx={{
                          marginLeft: '5px',
                          cursor: 'pointer',
                          '[data-mui-color-scheme="light"] &': {
                            color: '#0c68e9',
                          },
                          '[data-mui-color-scheme="dark"] &': {
                            color: '#078dee',
                          },
                        }}
                        underline="always"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Learn more
                      </Link>
                    )}
                  </Typography>
                </li>
              ))}
            </Box>

            {action}
          </Box>
        </Box>
        <Box>
          <VideoModal
            getHelp={getHelp}
            isVideo={isVideo}
            videoLink={videoLink}
            thumbnailName={thumbnailName}
          />
        </Box>
      </Box>
    </Card>
  );
}
