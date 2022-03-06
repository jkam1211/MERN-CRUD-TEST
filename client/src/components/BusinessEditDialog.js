/**
 * The form dialog to create or update a business
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  DialogTitle,
  TextField,
  useMediaQuery,
  FormControl,
  FormLabel,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import useBusinessDetail from '../hooks/useBusinessDetail';
import { Cancel } from '@mui/icons-material';
import useBusinesses from '../hooks/useBusinesses';
import { SUCCESS, UPLOADED_FILE_PATH } from '../utils/constants';
import useAlertMessage from '../hooks/useAlertMessage';

const Input = styled('input')({
  display: 'none'
});

//------------------------------------------------------------------------------------------------------------------------

export default function BusinessEditDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { closeDialog, isOpened, business } = useBusinessDetail();
  const { createBusiness, updateBusinessById } = useBusinesses();
  const { openAlert } = useAlertMessage();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [logo, setLogo] = useState(null);
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    if (business) {
      setName(business.name);
      setDescription(business.description);
      setAddress(business.address);
      setPhone(business.phone);
      setEmail(business.email);
      setOpenTime(business.openTime);
      setCloseTime(business.closeTime);
      setLogo(business.logo ? business.logo : '');
      setPictures(business.pictures);
    } else {
      setName('');
      setDescription('');
      setAddress('');
      setPhone('');
      setEmail('');
      setOpenTime('');
      setCloseTime('');
      setLogo('');
      setPictures([]);
    }
  }, [business]);

  const handleClose = () => {
    closeDialog();
  };

  //  Select the logo
  const uploadLogo = (e) => {
    setLogo(e.target.files[0]);
  };

  // Remove the logo
  const removeLogo = () => {
    setLogo(null);
  };

  // Select the multiple pictures
  const uploadPictures = (e) => {
    setPictures([
      ...pictures,
      ...Array.from(e.target.files).map((picture) => picture)
    ]);
  };

  //  Remove a picture
  const removePicture = (index) => {
    const clonePictures = [...pictures];
    clonePictures.splice(index, 1);
    setPictures(clonePictures);
  };

  //  When click the "Save button"
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('openTime', openTime);
    formData.append('closeTime', closeTime);
    formData.append('logo', logo ? logo : '');
    for (let i = 0; i < pictures.length; i += 1) {
      formData.append('pictures', pictures[i]);
    }
    let snackbarInfo = null;

    // Create a new business
    if (!business) {
      snackbarInfo = await createBusiness(formData);
      await openAlert(snackbarInfo);
      if (snackbarInfo.severity === SUCCESS) {
        closeDialog();
      }
    } else {
      snackbarInfo = await updateBusinessById(business._id, formData);
      await openAlert(snackbarInfo);
      if (snackbarInfo.severity === SUCCESS) {
        closeDialog();
      }
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth="md"
      open={isOpened}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">New Business</DialogTitle>
      <Divider />
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          {/* Name */}
          <TextField
            name="name"
            label="Name"
            // error={!name}
            // helperText={!name ? NAME_REQUIRED : ''}
            fullWidth={true}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Description */}
          <TextField
            name="description"
            label="Description"
            multiline
            minRows={3}
            maxRows={5}
            fullWidth={true}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Address */}
          <TextField
            name="address"
            label="Address"
            fullWidth={true}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* Phone */}
          <TextField
            name="phone"
            label="Phone"
            fullWidth={true}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Email */}
          <TextField
            type="email"
            name="email"
            label="Email"
            // error={!email}
            // helperText={!email ? EMAIL_REQUIRED : ''}
            fullWidth={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Open time */}
          <TextField
            type="time"
            name="openTime"
            label="Open time"
            fullWidth={true}
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
          />

          {/* Close time */}
          <TextField
            type="time"
            name="closeTime"
            label="Close time"
            fullWidth={true}
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
          />

          {/* Logo */}
          <FormControl>
            <FormLabel>Logo image</FormLabel>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              spacing={5}
            >
              <label htmlFor="upload-logo">
                <Input
                  accept="image/*"
                  id="upload-logo"
                  type="file"
                  onChange={uploadLogo}
                />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
              {logo ? (
                <Box position="relative">
                  <Paper
                    elevation={3}
                    sx={{ width: 128, height: 128, objectFit: 'cover' }}
                    component="img"
                    src={
                      logo instanceof Object
                        ? URL.createObjectURL(logo)
                        : UPLOADED_FILE_PATH + logo
                    }
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: -10, right: -10 }}
                    onClick={removeLogo}
                  >
                    <Cancel />
                  </IconButton>
                </Box>
              ) : (
                <Paper elevation={3} sx={{ width: 128, height: 128 }} />
              )}
            </Stack>
          </FormControl>

          {/* Pictures */}
          <FormControl>
            <FormLabel>Pictures</FormLabel>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              flexWrap="wrap"
              spacing={5}
            >
              <label htmlFor="upload-pictures">
                <Input
                  accept="image/*"
                  id="upload-pictures"
                  multiple
                  type="file"
                  onChange={uploadPictures}
                />
                <Button variant="contained" component="span">
                  Upload
                </Button>
              </label>
              {pictures.length > 0 ? (
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  justifyContent="center"
                >
                  {pictures.map((picture, index) => (
                    <Box key={index} position="relative">
                      <Paper
                        component="img"
                        src={
                          picture instanceof Object
                            ? URL.createObjectURL(picture)
                            : UPLOADED_FILE_PATH + picture
                        }
                        elevation={3}
                        sx={{ width: 128, height: 128, objectFit: 'cover' }}
                      />
                      <IconButton
                        sx={{ position: 'absolute', top: -10, right: -10 }}
                        onClick={() => removePicture(index)}
                      >
                        <Cancel />
                      </IconButton>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Paper
                  elevation={3}
                  sx={{ width: 128, height: 128, objectFit: 'cover' }}
                />
              )}
            </Stack>
          </FormControl>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button autoFocus variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="contained" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
