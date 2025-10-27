import { toast } from 'sonner';
import PropTypes from 'prop-types';
import SimpleBar from 'simplebar-react';
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router';
import { memo, useState, useEffect, useCallback } from 'react';

import { styled } from '@mui/material/styles';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import {
  Box,
  Card,
  Button,
  Divider,
  Tooltip,
  MenuList,
  MenuItem,
  Skeleton,
  IconButton,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/theme/styles';
import { CreateFolderDialog } from 'src/app-sections/folder/components/dialogs/create_folder-dailog';
import { RenameFolderDialog } from 'src/app-sections/folder/components/dialogs/rename_folder-dailog';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import { ConfirmDialog } from '../confirm-dialog';

// Constants
const FOLDER_ITEMS = {
  MAIN: [
    {
      id: '1',
      label: 'Home',
      children: [],
    },
    {
      id: '2',
      label: 'Main Folder',
      children: [],
    },
    {
      id: '3',
      label: 'Pabbly Connect',
      children: [],
    },
    {
      id: '4',
      label: 'Pabbly Connect',
      children: [],
    },
    {
      id: '5',
      label: 'Webhooks',
      children: [],
    },
    {
      id: '6',
      label: 'Integrations',
      children: [],
    },
    {
      id: '7',
      label: 'API Projects',
      children: [],
    },
    {
      id: '8',
      label: 'Marketing',
      children: [],
    },
    {
      id: '9',
      label: 'Sales',
      children: [],
    },
    {
      id: '10',
      label: 'Support',
      children: [],
    },
    {
      id: '11',
      label: 'HR',
      children: [],
    },
    {
      id: '12',
      label: 'Finance',
      children: [],
    },
    {
      id: '13',
      label: 'Development',
      children: [],
    },
    {
      id: '14',
      label: 'Testing',
      children: [],
    },
  ],
  TRASH: [
    {
      id: '3',
      label: 'Trash',
      children: [],
    },
  ],
};

const TEXT_TRUNCATE_LIMIT = 26;

// Utility functions
const truncateText = (text, limit = TEXT_TRUNCATE_LIMIT) => {
  if (!text) return '';
  return text.length <= limit ? text : `${text.slice(0, limit)}...`;
};

// Styled Components
const StyledTreeItem = styled((props) => <TreeItemContent {...props} />)(({ theme }) => ({
  color: theme.palette.grey[800],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.8, 1),
    margin: theme.spacing(0.2, 0),
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: 'rgba(145, 158, 171, 0.08) !important',
    },
    [`&.Mui-selected`]: {
      backgroundColor: 'red !important',
    },
    [`&.css-1be799j-MuiTreeItem-content.Mui-focused`]: {
      backgroundColor: '#078dee14 !important',
    },
    [`& .${treeItemClasses.label}`]: {
      fontSize: '14px',
      fontWeight: 500,
      width: '100%',
      '& > svg': {
        marginRight: theme.spacing(1),
      },
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${varAlpha(theme.vars.palette.text.primaryChannel, 0.4)}`,
  },
}));

// Sub-components
const TreeItemContent = ({
  label,
  onTrashClick,
  onHomeClick,
  onMainFolderClick,
  nodeId,
  isLoading,
  ...rest
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const confirm = useBoolean();
  const popover = usePopover();
  const [dialogs, setDialogs] = useState({
    createFolder: false,
    renameFolder: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleItemClick = useCallback(
    (event) => {
      if (label.includes('Trash')) {
        event.preventDefault();
        onTrashClick?.();
      } else if (label.includes('Home')) {
        event.preventDefault();
        onHomeClick?.();
      } else if (label.includes('Main Folder')) {
        // Add this condition
        event.preventDefault();
        onMainFolderClick?.();
      }
    },
    [label, onTrashClick, onHomeClick, onMainFolderClick] // Add onMainFolderClick to dependencies
  );

  const handleDialogToggle = useCallback(
    (dialogName, isOpen) => {
      setDialogs((prev) => ({ ...prev, [dialogName]: isOpen }));
      if (isOpen) popover.onClose();
    },
    [popover]
  );

  const handleDelete = useCallback(() => {
    confirm.onFalse();
    // setSnackbar({
    //   open: true,
    //   message: 'Folder deleted successfully.',
    //   severity: 'success',
    // });
    toast.success('Folder deleted successfully.');
  }, [confirm]);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const ListCount = useCallback((id) => 3, []);

  return (
    <>
      <TreeItem
        {...rest}
        onClick={handleItemClick}
        label={
          <FolderLabel
            label={label}
            nodeId={nodeId}
            ListCount={ListCount}
            popover={popover}
            onDialogToggle={handleDialogToggle}
            confirm={confirm}
            isLoading={isLoading}
          />
        }
      />
      <CreateFolderDialog
        open={dialogs.createFolder}
        onClose={() => handleDialogToggle('createFolder', false)}
      />
      <RenameFolderDialog
        open={dialogs.renameFolder}
        onClose={() => handleDialogToggle('renameFolder', false)}
      />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Do you really want to delete the folder?"
        content="Note that when a folder is deleted its Connection are moved to the trash folder."
        action={
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        }
      />
    </>
  );
};

const FolderLabel = memo(({ label, nodeId, ListCount, popover, onDialogToggle, confirm, isLoading }) => {
  const navigate = useNavigate();

  const handleNavigateToTeamMembers = useCallback(() => {
    navigate('settings/team-members');
  }, [navigate]);

  return (
    <Box sx={styles.folderLabelContainer}>
      {isLoading ? (
        <Skeleton variant="text" width={230} height={40} />
      ) : (
        <>
          <Typography component="div" fontSize={14} fontWeight={500} sx={styles.labelText}>
            <Tooltip
              title={
                label.includes('Trash')
                  ? 'Deleted connection can be restored or permanently deleted from the trash folder.'
                  : `Folder Name: ${label}`
              }
              placement="top"
              arrow
            >
              <span style={styles.truncatedText}>{truncateText(label)}</span>
            </Tooltip>
          </Typography>
          <Tooltip
            title="Number of connection in this folder"
            disableInteractive
            arrow
            placement="top"
          >
            <Typography component="div" fontSize={14} fontWeight={500} sx={styles.countText}>
              ({ListCount(nodeId)})
            </Typography>
          </Tooltip>
        </>
      )}
      {!label.includes('Home') && !label.includes('Trash') ? (
        isLoading ? (
          <Skeleton variant="text" width={40} height={40} />
        ) : (
        <FolderOptions
          popover={popover}
          onDialogToggle={onDialogToggle}
          onNavigateToTeamMembers={handleNavigateToTeamMembers}
              confirm={confirm}
          />
        )
      ) : (
        <Box sx={{ minWidth: '32px', ml: 0 }} />
      )}
    </Box>
  );
});

const FolderOptions = memo(({ popover, onDialogToggle, onNavigateToTeamMembers, confirm }) => {
  const handleMoreClick = (event) => {
    event.stopPropagation(); // Prevent the event from bubbling up
    // If popover is not open, open it
    if (!popover.open) {
      popover.onOpen(event);
    } else {
      // If popover is already open, keep it open (no action on click)
      popover.onClose();
    }
  };

  return (
    <Box sx={styles.optionsContainer} onClick={(event) => event.stopPropagation()}>
      <Box sx={styles.optionsWrapper}>
        <Tooltip title="Click to see options." disableInteractive arrow placement="top">
          <IconButton
            onClick={handleMoreClick} // Use the updated handler
            size="small"
            sx={styles.optionsButton}
          >
            <Iconify width={16} height={16} icon="eva:more-vertical-fill" />
          </IconButton>
        </Tooltip>
      </Box>

      <CustomPopover open={popover.open} onClose={popover.onClose} anchorEl={popover.anchorEl}>
        <MenuList>
          <Tooltip title="Change the folder name." placement="left" arrow>
            <MenuItem onClick={() => onDialogToggle('renameFolder', true)}>
              <Iconify icon="fluent:rename-16-filled" />
              Rename
            </MenuItem>
          </Tooltip>
          <Tooltip
            title="Click here to share the folder with team member, this will open the team member settings page."
            placement="left"
            arrow
          >
            <MenuItem onClick={onNavigateToTeamMembers} sx={{ width: 200 }}>
              <Iconify icon="fluent:people-team-add-24-filled" />
              Add Team Members
            </MenuItem>
          </Tooltip>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Tooltip title="Click to delete folder." arrow placement="left">
            <MenuItem
              onClick={() => {
                confirm.onTrue();
                popover.onClose();
              }}
              sx={{ color: 'error.main' }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>
    </Box>
  );
});

// Main component
const FolderSection = memo(
  ({ onTrashClick, onHomeClick, onMainFolderClick, onFolderClick, selectedFolder }) => {
    const createFolder = useBoolean();
    
    // Global loading state for all folders
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Simulate 2 second loading time

      return () => clearTimeout(timer);
    }, []);

    return (
      <Card sx={styles.card}>
        <Typography variant="h6">
          <Box sx={styles.headerContainer}>
            <Tooltip
              disableInteractive
              title="You can create folders and manage connections within them."
              arrow
              placement="top"
            >
              <span>Folders</span>
            </Tooltip>

            <Tooltip title="Create a new folder." disableInteractive arrow placement="top">
              <Button
                sx={styles.createButton}
                onClick={createFolder.onTrue}
                color="primary"
                variant="contained"
                disabled={isLoading}
              >
                <Iconify icon="fa6-solid:plus" />
              </Button>
            </Tooltip>
          </Box>
        </Typography>
        <Divider sx={styles.divider} />

        {/* Container with max height and scrollable content */}
        <Box sx={styles.scrollableContainer}>
          <FolderTreeViews
            onTrashClick={onTrashClick}
            onHomeClick={onHomeClick}
            onMainFolderClick={onMainFolderClick}
            onFolderClick={onFolderClick}
            selectedFolder={selectedFolder}
            isLoading={isLoading}
          />
        </Box>

        <CreateFolderDialog open={createFolder.value} onClose={createFolder.onFalse} />
      </Card>
    );
  }
);

const FolderTreeViews = memo(
  ({ onTrashClick, onHomeClick, onMainFolderClick, onFolderClick, selectedFolder, isLoading }) => {
    // Separate Home folder from other main folders
    const homeFolder = FOLDER_ITEMS.MAIN.filter((item) => item.label.includes('Home'));
    const otherFolders = FOLDER_ITEMS.MAIN.filter((item) => !item.label.includes('Home'));

    return (
      <>
        {/* Fixed Home folder - not scrollable */}
        <RichTreeView
          aria-label="home-folder"
          items={homeFolder}
          sx={styles.treeView}
          selectedItems={selectedFolder ? [selectedFolder] : []}
          onItemSelect={(event, ids) => {
            if (Array.isArray(ids) && ids.length > 0) {
              if (onFolderClick) onFolderClick(ids[0]);
            }
          }}
          slots={{
            item: (props) => (
              <StyledTreeItem
                {...props}
                onTrashClick={onTrashClick}
                onHomeClick={onHomeClick}
                onMainFolderClick={onMainFolderClick}
                isLoading={isLoading}
              />
            ),
          }}
        />

        {/* <Divider sx={styles.divider} /> */}

        {/* Scrollable content area for other folders */}
        <SimpleBar style={{ maxHeight: '400px' }}>
          <RichTreeView
            aria-label="main-folders"
            items={otherFolders}
            sx={styles.treeView}
            selectedItems={selectedFolder ? [selectedFolder] : []}
            onItemSelect={(event, ids) => {
              if (Array.isArray(ids) && ids.length > 0) {
                if (onFolderClick) onFolderClick(ids[0]);
              }
            }}
            slots={{
              item: (props) => (
                <StyledTreeItem
                  {...props}
                  onTrashClick={onTrashClick}
                  onHomeClick={onHomeClick}
                  onMainFolderClick={onMainFolderClick}
                  isLoading={isLoading}
                />
              ),
            }}
          />
        </SimpleBar>

        <Divider sx={styles.divider} />

        {/* Fixed Trash folder - not scrollable */}
        <RichTreeView
          aria-label="trash-folder"
          items={FOLDER_ITEMS.TRASH}
          sx={styles.treeView}
          selectedItems={selectedFolder === 'Trash' ? ['Trash'] : []}
          onItemSelect={(event, ids) => {
            if (Array.isArray(ids) && ids.length > 0) {
              if (onFolderClick) onFolderClick('Trash');
            }
          }}
          slots={{
            item: (props) => (
              <StyledTreeItem
                {...props}
                onTrashClick={onTrashClick}
                onHomeClick={onHomeClick}
                onMainFolderClick={onMainFolderClick}
                isLoading={isLoading}
              />
            ),
          }}
        />
      </>
    );
  }
);

// Styles
const styles = {
  card: {
    pl: 3,
    pr: 3,
    pt: 3,
    pb: 3,
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  createButton: {
    mr: '18px',
    mb: 1,
    p: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 0,
  },
  divider: {
    borderStyle: 'dashed',
    mb: 2,
    mt: 2,
  },
  scrollableContainer: {
    maxHeight: '668px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollableContent: {
    maxHeight: '400px', // Adjust this value based on your needs
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  treeView: {
    overflowX: 'hidden',
    width: 1,
  },
  folderLabelContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    pr: 0,
    height: '24.78px',
  },
  labelText: {
    '[data-mui-color-scheme="light"] &': { color: '#1c252e' },
    '[data-mui-color-scheme="dark"] &': { color: '#fff' },
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
  },
  truncatedText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  countText: {
    '[data-mui-color-scheme="light"] &': { color: '#1c252e' },
    '[data-mui-color-scheme="dark"] &': { color: '#fff' },
    fontSize: 14,
    flexShrink: 0,
    ml: 0,
  },
  optionsContainer: {
    ml: 0,
    display: 'flex',
    alignItems: 'center',
    position: 'relative', // Add fixed positioning
    minWidth: '32px', // Ensure minimum width
  },
  optionsWrapper: {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', // Fix position
    right: 0,
  },
  optionsButton: {
    '&:hover': { backgroundColor: 'action.hover' },
    height: '24px', // Make it an even number
    width: '24px', // Make it an even number
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

// PropTypes
FolderSection.propTypes = {
  onTrashClick: PropTypes.func,
  onHomeClick: PropTypes.func,
  onMainFolderClick: PropTypes.func, // Add this
  onFolderClick: PropTypes.func,
  selectedFolder: PropTypes.string,
};

FolderTreeViews.propTypes = {
  onTrashClick: PropTypes.func,
  onHomeClick: PropTypes.func,
  onMainFolderClick: PropTypes.func, // Add this
  onFolderClick: PropTypes.func,
  selectedFolder: PropTypes.string,
  isLoading: PropTypes.bool,
};

TreeItemContent.propTypes = {
  label: PropTypes.string.isRequired,
  onTrashClick: PropTypes.func,
  onHomeClick: PropTypes.func,
  onMainFolderClick: PropTypes.func, // Add this
  nodeId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
};

FolderLabel.propTypes = {
  label: PropTypes.string.isRequired,
  nodeId: PropTypes.string.isRequired,
  ListCount: PropTypes.func.isRequired,
  popover: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    onOpen: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    // anchorEl: PropTypes.any,
  }).isRequired,
  onDialogToggle: PropTypes.func.isRequired,
  confirm: PropTypes.shape({
    value: PropTypes.bool.isRequired,
    onTrue: PropTypes.func.isRequired,
    onFalse: PropTypes.func.isRequired,
    onToggle: PropTypes.func.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool,
};

FolderOptions.propTypes = {
  // popover: PropTypes.object.isRequired,
  onDialogToggle: PropTypes.func.isRequired,
  onNavigateToTeamMembers: PropTypes.func.isRequired,
  // confirm: PropTypes.object.isRequired,
};

// Display names for debugging
FolderSection.displayName = 'FolderSection';
FolderTreeViews.displayName = 'FolderTreeViews';
FolderLabel.displayName = 'FolderLabel';
FolderOptions.displayName = 'FolderOptions';

export { FolderSection };
