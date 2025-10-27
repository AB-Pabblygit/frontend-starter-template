import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import {
  Box,
  Switch,
  Button,
  Tooltip,
  Divider,
  MenuItem,
  MenuList,
  IconButton,
  Typography,
} from '@mui/material';

import { MoveToFolderPopover } from 'src/app-sections/dashboard/components/dialogs/move-folder-dailog';

import { Iconify } from 'src/components/iconify';

import { AddNoteDrawer } from './add-note-drawer';
import { ConfirmDialog } from '../confirm-dialog';
import { usePopover, CustomPopover } from '../custom-popover';
import { RenameDialog } from '../rename-dialog/rename-dialog';

export default function ConnectionPageHeader({ ConnectionName, Subheading, link_added,isdisabled }) {
  const popover = usePopover();
  const navigate = useNavigate();
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMoveFolder, setOpenMoveFolder] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  // Only need state for the switch now
  const [isEnabled, setIsEnabled] = useState(false);

  // Simplified handler for switch toggle
  const handleSwitchChange = (event) => {
    const newState = event.target.checked;
    setIsEnabled(newState);

    // Show toast based on switch state
    if (newState) {
      toast.success('Connection enabled successfully.', {
        style: {
          marginTop: '15px',
        },
      });
    } else {
      toast.success('Connection disabled successfully.', {
        style: {
          marginTop: '15px',
        },
      });
    }
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedRowData(null);
  };
  const handleOpenDrawer = () => {
    setOpenDrawer(true);
    popover.onClose()
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRowData(null);
  };
  const handleRenameDialog = () => {
    setOpenDialog(true);
    popover.onClose()
  };
  const handleMoveFolder = () => {
    setOpenMoveFolder(true);
    popover.onClose()
  };
  const handleCloseMoveFolder = () => {
    setOpenMoveFolder(false);
  };
  const handleConfirmDelete = () => {
    setOpenConfirmDelete(true);
    popover.onClose()
  };
  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    toast.success(`Successfully deleted the conection.`, {
      style: {
        marginTop: '15px',
      },
    });
  };
  const handleCancelConfirmDelete = () => {
    setOpenConfirmDelete(false);
    // toast.success(`Successfully deleted the conection.`, {
    //   style: {
    //     marginTop: '15px',
    //   },
    // });
  };

  // const handleAddTeamMember = () => {
  //   navigate('/app/settings/team-members');
  // };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          width: '100%',
          maxWidth: (theme) => theme.breakpoints.values.xl,
          margin: '0 auto',
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '100%' }} // Adjust maxWidth to match your form width
        >
          <Box display="flex" alignItems='center'>
            <Tooltip
              title={`Connection Name: ${ConnectionName}`}
              arrow
              placement="top"
              disableInteractive
            >
              <Typography
                variant="h4"
                sx={{
                  mt: 3,mb:3,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: { xs: '200px', sm: '400px', lg:'600px' },
                }}
              >
                {ConnectionName}
              </Typography>
            </Tooltip>
            {/* <Typography sx={{ color: 'text.secondary', mb: 3 }}>
              {Subheading}{' '}
              </Typography> */}
              <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
                <Iconify icon="eva:more-vertical-fill" />
              </IconButton>
          </Box>
          <Box>
            <Tooltip
              title="Click to add note for the connection."
              disableInteractive
              arrow
              placement="top"
            >
              <IconButton size="medium" onClick={handleOpenDrawer}>
                <Iconify icon="fluent:note-edit-24-filled" />
              </IconButton>
            </Tooltip>
            <Tooltip
              title={isEnabled ? 'Click to disable connection' : 'Click to enable connection'}
              disableInteractive
              arrow
              placement="top"
            >
              <Switch
                sx={{ mr: -1.3 }}
                size="medium"
                disabled={isdisabled}
                checked={isEnabled}
                onChange={handleSwitchChange}
              />
            </Tooltip>
          </Box>
        </Box>
      </Box>
      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'left-top' } }}
      >
        <MenuList>
          <Tooltip title="Add connection note." arrow placement="right">
            <MenuItem sx={{ color: 'secondary' }} onClick={handleOpenDrawer}>
              <Iconify icon="fluent:note-edit-24-filled" />
              Add Note
            </MenuItem>
          </Tooltip>

          <Tooltip title="Rename connection." arrow placement="right">
            <MenuItem sx={{ color: 'secondary' }} onClick={handleRenameDialog}>
              <Iconify icon="fluent:rename-16-filled" />
              Rename
            </MenuItem>
          </Tooltip>

          {/* <Tooltip title="Add team member." arrow placement="right">
            <MenuItem sx={{ color: 'secondary' }} onClick={handleAddTeamMember}>
              <Iconify icon="fluent:people-team-16-filled" />
              Add Team Member
            </MenuItem>
          </Tooltip> */}

          <Tooltip title="Move connection." arrow placement="right">
            <MenuItem sx={{ color: 'secondary' }} onClick={handleMoveFolder}>
              <Iconify icon="fluent:folder-move-16-filled" />
              Move to Folder
            </MenuItem>
          </Tooltip>

          <Divider style={{ borderStyle: 'dashed' }} />

          <Tooltip title="Click to delete connection." arrow placement="right">
            <MenuItem sx={{ color: 'error.main' }} onClick={handleConfirmDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          </Tooltip>
        </MenuList>
      </CustomPopover>
      <AddNoteDrawer open={openDrawer} onClose={handleCloseDrawer} rowData={selectedRowData} />
      <RenameDialog open={openDialog} onClose={handleCloseDialog} rowData={selectedRowData} />
      <MoveToFolderPopover open={openMoveFolder} onClose={handleCloseMoveFolder} />
      <ConfirmDialog
        open={openConfirmDelete}
        onClose={handleCancelConfirmDelete}
        title="Do you really want to delete the connection?"
        content="Connection, once deleted, will be moved to the trash folder."
        action={
          <Button variant="contained" color="error" onClick={handleCloseConfirmDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
