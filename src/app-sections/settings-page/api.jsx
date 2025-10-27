import { toast } from 'sonner';
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { Helmet } from 'react-helmet-async';

import {
  Box,
  Card,
  Button,
  Divider,
  Tooltip,
  TextField,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { CONFIG } from 'src/config-global';
import { listItems } from 'src/_mock/_big-card/_app/_api';

import { Iconify } from 'src/components/iconify';
import BigCard from 'src/components/big-card/big-card';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import LearnMoreLink from 'src/components/learn-more-link/learn-more-link';

import { WebhookTable } from '../api-webhooks/components/table/webhook-table';
import { WebhookDialog } from '../api-webhooks/components/dialogs/add-webhook';

// ----------------------------------------------------------------------

const metadata = { title: `API | ${CONFIG.site.name}` };

export default function API() {
  const theme = useTheme();

  // Dialog and Snackbar states
  const [dialogOpen, setDialogOpen] = useState(false);

  const dialog = useBoolean();

  // Form values state
  const [apivalues, setapiValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const [secretvalues, setsecretValues] = useState({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
  });

  const { items, style } = listItems;

  // Handlers for form inputs

  // Copy handlers
  const handleCopy = (type) => {
    if (type === 'api') {
      navigator.clipboard.writeText(apivalues.password);

      toast.success(`API key copied successfully.`, {
        style: {
          marginTop: '15px',
        },
      });
    } else {
      navigator.clipboard.writeText(secretvalues.password);
      //
      toast.success(`Secret key copied successfully.`, {
        style: {
          marginTop: '15px',
        },
      });
    }
  };

  // Dialog handlers
  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // Snackbar handlers

  // Generate token handler
  const handleGenerateToken = () => {
    handleDialogClose();
    // Add your token generation logic here

    toast.success(`API key generated successfully.`, {
      style: {
        marginTop: '15px',
      },
    });
  };

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <Box width="100%">
        <BigCard
          tooltip="View file upload guidelines for Hook."
          getHelp={false}
          isVideo
          bigcardtitle="Points To Remember"
          // bigcardsubtitle="Please adhere to the following guidelines when uploading your CSV file:"
          style={style}
          items={items}
          videoLink="https://www.youtube.com/embed/YBEA1SjtwQ0?si=wdAWMHV4MuPE8WWM"
          thumbnailName="Pabbly-Hook-Api&Secrect-Key.png"
          keyword="Note:"
          learnMoreLink="https://forum.pabbly.com/threads/what-is-pabbly-hook-api-and-secret-key.25709/"
          bigcardNote="All data and reports older than 15 days will be permanently removed automatically. For reference, you can Download Sample File to guide you in formatting your data correctly."
          action={
            <Tooltip
              title="Add a team members and share folder(s) with them."
              arrow
              placement="top"
              disableInteractive
            >
              <Button
                startIcon={<Iconify icon="heroicons:plus-circle-16-solid" />}
                onClick={dialog.onTrue}
                color="primary"
                variant="outlined"
                size="large"
              >
                Add Webhook
              </Button>
            </Tooltip>
          }
        />
      </Box>

      <Card sx={{ mt: 3 }}>
        <CardHeader
          sx={{
            pt: 3,
            px: 3,
            pb: 2,
          }}
          title={
            <Box display="inline-block">
              <Tooltip title="Easily verify a single email address here." arrow placement="top">
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  API
                </Typography>
              </Tooltip>
            </Box>
          }
          // subheader="Check Pabbly Email Verification Api"
        />
        <Divider />
        <CardContent>
          <Box>
            {/* <Typography fontSize={14} fontWeight={600} mb="8px" ml="13px">
              API Key
            </Typography> */}
            <TextField
              fullWidth
              variant="outlined"
              type="text"
              label="API Key"
              value="●●●●●●●●●●●●●●●●●●"
              helperText={
                <>
                  Use the &apos;Copy&apos; button to securely copy it. Keep it private and
                  don&apos;t share with others.{' '}
                  <LearnMoreLink link="https://forum.pabbly.com/threads/what-is-pabbly-hook-api-and-secret-key.25709/" />
                </>
              }
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Copy API Key" placement="top" arrow>
                      <IconButton onClick={() => handleCopy('api')} edge="end">
                        <Iconify icon="solar:copy-bold" width={18} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: '24px' }}
            onClick={handleDialogOpen}
          >
            Generate API Token
          </Button>
        </CardContent>
      </Card>

      <WebhookTable />
      <WebhookDialog
        open={dialog.value}
        onClose={() => {
          dialog.onFalse();
        }}
      />
      <ConfirmDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        title="Generate API Token"
        content="Generating new API keys will invalidate your current API keys. Do you want to continue?"
        action={
          <Button variant="contained" color="primary" onClick={handleGenerateToken}>
            Generate API Token
          </Button>
        }
      />

      {/* Alerts and Snackbars */}
    </>
  );
}
