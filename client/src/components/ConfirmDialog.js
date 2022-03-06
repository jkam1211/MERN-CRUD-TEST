/**
 * Confirm dialog
 */
import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import useConfirm from '../hooks/useConfirm';
import useAlertMessage from '../hooks/useAlertMessage';
import useBusinesses from '../hooks/useBusinesses';

//------------------------------------------------------------------------------------------------------------------------

export default function ConfirmDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const { isOpened, closeConfirmDialog, message, _id } = useConfirm();
  const { openAlert } = useAlertMessage();
  const { deleteBusinessById } = useBusinesses();

  const handleClose = () => {
    closeConfirmDialog();
  };

  const onOk = async () => {
    const snackbarInfo = await deleteBusinessById(_id);
    await openAlert(snackbarInfo);
    closeConfirmDialog();
  };

  return (
    <Dialog
      fullWidth={true}
      fullScreen={fullScreen}
      open={isOpened}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{message}</DialogTitle>

      <DialogActions>
        <Button autoFocus onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={onOk} autoFocus variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
