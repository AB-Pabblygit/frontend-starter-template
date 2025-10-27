

import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Collapse,Skeleton, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';


const GradientBox = styled(Box)(({ theme, bgColor }) => ({
  width: '100%',
  padding: theme.spacing(1),
  // background: 'linear-gradient(90deg, #ec4776 0%, #415EFA 100%)',
  background: bgColor || 'linear-gradient(90deg, #ec4776 0%, #415EFA 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
}));

export function PromotionalHeader({
  offerText,
  bgColor,
  loading = false,
  buttonIcon,
  buttonText,
  link,
  onClose,
  isVisible,
}) {
  const handleButtonClick = () => {
    window.open(link, '_blank');
  };

  const renderIcon = () => {
    if (!buttonIcon) return <Iconify icon="fa-solid:hand-point-right" style={{ width: 18, height: 18 }} />;
    if (buttonIcon.startsWith('/') || buttonIcon.startsWith('http')) {
      return <img src={buttonIcon} alt="button icon" style={{ width: 18, height: 18 }} />;
    }
    return <Iconify icon={buttonIcon} style={{ width: 18, height: 18 }} />;
  };

  return (
    <Collapse in={isVisible} timeout={500} unmountOnExit>
      <GradientBox sx={{ padding: 1.5, position: 'relative' }} bgColor={bgColor}>
        {loading ? (
          <Skeleton
            variant="text"
            sx={{
              height: { xs: '70px', sm: '40px', xl: '40px' },
              width: { xs: '90%', sm: '60%', xl: '60%' },
            }}
          />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
              gap: 1,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 0.6,
              }}
            >
              {offerText}
            </Box>

            <Box
              sx={{
                paddingLeft: { xs: 0, sm: 2 },
                paddingTop: { xs: 1, sm: 0 },
              }}
            >
              <Button
                onClick={handleButtonClick}
                variant="contained"
                color="warning"
                startIcon={renderIcon()}
                sx={{ padding: '8px 16px', fontWeight: 800 }}
              >
                {buttonText}
              </Button>
            </Box>

            {/* Close Iccon */}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 0,
                color: 'white',
              }}
            >
              <Iconify icon="uil:times" />
            </IconButton>
          </Box>
        )}
      </GradientBox>
    </Collapse>
  );
}
