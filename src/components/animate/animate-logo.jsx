import { m } from 'framer-motion';

import Box from '@mui/material/Box';

import { varAlpha } from 'src/theme/styles';

import { varPath } from 'src/components/animate';

import { Logo } from '../logo';
// ----------------------------------------------------------------------

export function AnimateLogo1({ logo, sx, ...other }) {
  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        alignItems: 'center',
        position: 'relative',
        display: 'inline-flex',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <Box
        component={m.div}
        animate={{ scale: [1, 0.9, 0.9, 1, 1], opacity: [1, 0.48, 0.48, 1, 1] }}
        transition={{
          duration: 2,
          repeatDelay: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{ display: 'inline-flex' }}
      >
        {logo ?? <Logo disableLink width={64} height={64} />}
      </Box>

      <Box
        component={m.div}
        animate={{
          scale: [1.6, 1, 1, 1.6, 1.6],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          position: 'absolute',
          width: 'calc(100% - 20px)',
          height: 'calc(100% - 20px)',
          border: (theme) => `solid 3px ${varAlpha(theme.vars.palette.primary.darkChannel, 0.24)}`,
        }}
      />

      <Box
        component={m.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%'],
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={{
          width: 1,
          height: 1,
          position: 'absolute',
          border: (theme) => `solid 8px ${varAlpha(theme.vars.palette.primary.darkChannel, 0.24)}`,
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function AnimateLogo2({ logo, sx, ...other }) {
  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{
        width: 96,
        height: 96,
        position: 'relative',
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      {logo ?? <Logo sx={{ zIndex: 9 }} />}

      <Box
        component={m.div}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
        sx={{
          width: 1,
          height: 1,
          opacity: 0.16,
          borderRadius: '50%',
          position: 'absolute',
          transition: (theme) =>
            theme.transitions.create(['opacity'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
          background: (theme) =>
            `linear-gradient(135deg, ${varAlpha(theme.vars.palette.primary.mainChannel, 0)} 50%, ${theme.vars.palette.primary.main} 100%)`,
        }}
      />
    </Box>
  );
}

export function AnimateLogo3(){
  return (
    <Box
      component={m.svg}
      viewBox="0 0 1428 406"
      sx={{
        width: 640,
        // height: 240,
        strokeWidth: 4,
        stroke: '#20B276',
      }}
    >
      <defs>
        <linearGradient x1="100%" y1="9.946%" x2="50%" y2="50%" id="a">
          <stop stopColor="#20B276" offset="0%" />
          <stop stopColor="#20B276" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="b">
          <stop stopColor="#147F52" offset="0%" />
          <stop stopColor="#147F52" offset="100%" />
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="c">
          <stop stopColor="#ffffff" offset="0%" />
          <stop stopColor="#ffffff" offset="100%" />
        </linearGradient>
      </defs>

      <g fill="none" fillRule="nonzero">
        <m.path
          {...varPath}
          d="M374.492 186.721C374.492 289.662 290.805 373.109 187.576 373.109C155.209 373.109 124.765 364.909 98.2189 350.472C40.0957 318.865 0.660156 257.387 0.660156 186.721C0.660156 83.7838 84.3451 0.334473 187.575 0.334473C290.805 0.334473 374.492 83.7838 374.492 186.721Z"
          fill="url(#a)"
        />
        <m.path
          {...varPath}
          d="M262.178 239.735C242.399 260.06 218.397 270.229 190.175 270.229C172.951 270.229 156.948 267.322 141.945 258.877L141.765 367.106L140.343 366.722L139.463 366.498L138.425 365.934L137.935 365.051L137.484 364.053L137.984 363.428L88.4916 304.582L88.506 165.478C88.506 136.493 98.3938 111.877 118.174 91.6239C137.949 71.3695 161.951 61.2445 190.175 61.2445C218.397 61.2445 242.398 71.4055 262.178 91.7348C281.953 112.061 291.844 136.73 291.844 165.736C291.844 194.745 281.953 219.41 262.178 239.735ZM224.425 130.505C215.035 120.845 203.618 116.017 190.175 116.017C176.729 116.017 165.313 120.845 155.925 130.505C146.534 140.164 141.839 151.906 141.839 165.739C141.839 179.568 146.532 191.309 155.925 200.969C165.313 210.63 176.729 215.461 190.175 215.461C203.618 215.461 215.035 210.63 224.425 200.969C233.815 191.309 238.51 179.568 238.51 165.739C238.51 151.906 233.815 140.163 224.425 130.505Z"
          fill="url(#b)"
        />
        <m.path
          {...varPath}
          d="M258.287 235.892C238.509 256.22 214.509 266.387 186.286 266.387C169.062 266.387 152.951 262.164 137.951 253.719L137.935 366.467C137.935 366.467 134.284 365.465 129.532 363.935C128.36 363.557 127.177 363.152 125.938 362.716C125.348 362.507 125.061 362.385 124.454 362.21C122.899 361.764 120.929 360.902 119.41 360.313C114.308 358.332 110.173 356.443 110.073 356.397C109.973 356.35 95.367 349.401 93.72 348.375C92.2449 347.456 90.9317 346.736 89.8062 345.931C89.4465 345.674 89.1749 345.491 88.8339 345.258C86.1583 343.424 84.663 342.371 84.663 342.371L84.6182 161.639C84.6182 132.653 94.506 108.036 114.286 87.7845C134.063 67.5287 158.063 57.4052 186.287 57.4052C214.51 57.4052 238.51 67.5662 258.289 87.8955C278.066 108.222 287.958 132.89 287.958 161.895C287.955 190.902 278.064 215.566 258.287 235.892ZM220.536 126.662C211.144 117.003 199.729 112.175 186.284 112.175C172.838 112.175 161.422 117.003 152.034 126.662C142.643 136.322 137.949 148.064 137.949 161.895C137.949 175.726 142.643 187.467 152.034 197.125C161.422 206.789 172.838 211.619 186.284 211.619C199.728 211.619 211.144 206.789 220.536 197.125C229.924 187.467 234.621 175.726 234.621 161.895C234.621 148.064 229.924 136.322 220.536 126.662Z"
          fill="url(#c)"
        />
      </g>
    </Box>
  );
}