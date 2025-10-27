import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

import { varAlpha } from 'src/theme/styles';

export function ResultItem({ title, folderItems, groupLabel, searchQuery }) {
  return (
    <ListItemButton
      sx={{
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'transparent',
        borderBottomColor: (theme) => theme.vars.palette.divider,
        '&:hover': {
          borderRadius: 1,
          borderColor: (theme) => theme.vars.palette.primary.main,
          backgroundColor: (theme) =>
            varAlpha(
              theme.vars.palette.primary.mainChannel,
              theme.vars.palette.action.hoverOpacity
            ),
        },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <ListItemText
        primaryTypographyProps={{
          typography: 'subtitle2',
          sx: {
            textTransform: 'capitalize',
            color: 'text.primary',
          },
        }}
        secondaryTypographyProps={{
          typography: 'caption',
          sx: {
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            mt: 0.5,
          },
        }}
        primary={title}
        secondary={<Box component="span">Folder: {folderItems}</Box>}
      />

      {/* {groupLabel && <Label color="info">{groupLabel}</Label>}
      
      <Label 
        color={folderItems > 0 ? 'success' : 'error'} 
        sx={{ 
          ml: 1, 
          alignSelf: 'center',
          minWidth: 70,
          textAlign: 'center'
        }}
      >
        {folderItems > 0 ? 'Active' : 'Inactive'}
      </Label> */}
    </ListItemButton>
  );
}
