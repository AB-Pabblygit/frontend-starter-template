import Box from '@mui/material/Box';
import { Tooltip } from '@mui/material';
import Switch from '@mui/material/Switch';
import ButtonBase from '@mui/material/ButtonBase';

import { CONFIG } from 'src/config-global';
import { varAlpha } from 'src/theme/styles';

import { SvgColor } from '../../svg-color';

// ----------------------------------------------------------------------

export function BaseOption({ icon, label, tooltip, selected, ...other }) {
  return (
    <ButtonBase
      disableRipple
      sx={{
        width:'85%',
        m:3,
        px: 2,
        py: 2.5,
        borderRadius: 2,
        cursor: 'pointer',
        flexDirection: 'column',
        alignItems: 'flex-start',
        border: (theme) => `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        '&:hover': { bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08) },
        ...(selected && {
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        }),
      }}
      {...other}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3,width:'100%' }}
      >
        <SvgColor src={`${CONFIG.site.basePath}/assets/icons/setting/ic-${icon}.svg`} />
        <Tooltip title='Click here to switch between Light and Dark mode.' placement='top' disableInteractive arrow>
        <Switch name={label} size="small" color="default" checked={selected} sx={{ mr: -0.75 }} /></Tooltip>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
        <Box
          component="span"
          sx={{
            lineHeight: '18px',
            fontWeight: 'fontWeightSemiBold',
            fontSize: (theme) => theme.typography.pxToRem(13),
          }}
        >
          {label}
        </Box>

       
          {/* <Tooltip
            arrow
            title={tooltip}
            slotProps={{
              tooltip: { sx: { maxWidth: 240, mr: 0.5 } },
            }}
          >
            <Iconify
              width={16}
              icon="eva:info-outline"
              sx={{ cursor: 'pointer', color: 'text.disabled' }}
            />
          </Tooltip> */}
       
      </Box>
    </ButtonBase>
  );
}
