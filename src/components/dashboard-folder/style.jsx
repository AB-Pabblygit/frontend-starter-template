import { styled } from '@mui/material/styles';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

import { varAlpha, stylesMode } from 'src/theme/styles';

export const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.vars.palette.grey[800],
  [stylesMode.dark]: { color: theme.vars.palette.grey[200] },
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.8, 1),
    margin: theme.spacing(0.2, 0),
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(145, 158, 171, 0.08) !important',
    },
    [`&.Mui-selected`]: {
      backgroundColor: '#078dee14',
    },
    [`& .${treeItemClasses.label}`]: {
      display: 'flex',
      alignItems: 'center',
      '& > svg': {
        marginRight: theme.spacing(1),
      },
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${varAlpha(theme.vars.palette.text.primaryChannel, 0.4)}`,
  },
}));
