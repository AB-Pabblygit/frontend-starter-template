import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { styled, useTheme } from '@mui/material/styles';

import { useScrollOffSetTop } from 'src/hooks/use-scroll-offset-top';

import { bgBlur, varAlpha } from 'src/theme/styles';

import { layoutClasses } from '../classes';
import { PromotionalHeader } from './hello-bar';

// ----------------------------------------------------------------------

const StyledElevation = styled('span')(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  m: 'auto',
  height: 24,
  zIndex: -1,
  opacity: 0.48,
  borderRadius: '50%',
  position: 'absolute',
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export function HeaderSection({
  sx,
  slots,
  slotProps,
  disableOffset,
  disableElevation,
  layoutQuery = 'md',
  ...other
}) {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1100); // Set loading to false after 500ms

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);
  const { offsetTop } = useScrollOffSetTop();

  const toolbarStyles = {
    default: {
      minHeight: 'auto',
      height: 'var(--layout-header-mobile-height)',
      transition: theme.transitions.create(['height', 'background-color'], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
      }),
      [theme.breakpoints.up('sm')]: {
        minHeight: 'auto',
      },
      [theme.breakpoints.up(layoutQuery)]: {
        height: 'var(--layout-header-desktop-height)',
      },
    },
    offset: {
      ...bgBlur({
        color: varAlpha(theme.vars.palette.background.defaultChannel, 0.8),
      }),
    },
  };

  // Hello bar
  const [showHeaderBar, setShowHeaderBar] = useState(true);

  const handleCloseHelloBar = () => {
    setShowHeaderBar(false); // Collapse will animate out
  };
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <>
    {!isAdminRoute && (
 <PromotionalHeader
  loading={loading}
  offerText={
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flexWrap: 'wrap',
        gap: '4px',
      }}
    >
      <strong style={{ fontWeight: 800 }}>[LIMITED TIME OFFER]</strong>{' '}
      <span style={{ textDecoration: 'line-through #ff1111' }}>$194/year</span>{' '}
      <strong>$249</strong> for lifetime access.
    </span>
  }
  buttonText="GRAB THIS OFFER"
  link="https://www.pabbly.com/connect-onetime/#pricing"
  onClose={handleCloseHelloBar}
  isVisible={showHeaderBar}
/>
)}
      <AppBar
        position="sticky"
        className={layoutClasses.header}
        sx={{
          zIndex: 'var(--layout-header-zIndex)',
          ...sx,
        }}
        {...other}
      >
        {slots?.topArea}

        <Toolbar
          disableGutters
          {...slotProps?.toolbar}
          sx={{
            ...toolbarStyles.default,
            ...(!disableOffset && offsetTop && toolbarStyles.offset),
            ...slotProps?.toolbar?.sx,
          }}
        >
          <Container
            {...slotProps?.container}
            sx={{
              height: 1,
              display: 'flex',
              alignItems: 'center',
              ...slotProps?.container?.sx,
            }}
          >
            {slots?.leftArea}

            <Box sx={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center' }}>
              {slots?.centerArea}
            </Box>

            {slots?.rightArea}
          </Container>
        </Toolbar>

        {slots?.bottomArea}

        {!disableElevation && offsetTop && <StyledElevation />}
      </AppBar>
    </>
  );
}
