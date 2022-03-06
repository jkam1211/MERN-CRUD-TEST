/**
 * HomePage
 * Created at 2021/11/14
 * Created by Alex.M
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Add, Delete, Edit } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import InfiniteScroll from 'react-infinite-scroll-component';

import {
  CONFIRM_MESSAGE,
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  UPLOADED_FILE_PATH
} from '../../utils/constants';
import useBusinesses from '../../hooks/useBusinesses';
import useBusinessDetail from '../../hooks/useBusinessDetail';
import useConfirm from '../../hooks/useConfirm';
import BusinessEditDialog from '../../components/BusinessEditDialog';
import AlertMessage from '../../components/AlertMessage';
import ConfirmDialog from '../../components/ConfirmDialog';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}));

//--------------------------------------------------------------------------------------------------------------------------

export default function HomePage() {
  const {
    getAllBusinesses,
    clearBusinesses,
    businesses,
    expectedBusinessesAmount
  } = useBusinesses();
  const { openDialog } = useBusinessDetail();
  const { openConfirmDialog } = useConfirm();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [pageNumber, setPageNumber] = useState(DEFAULT_PAGE_NUMBER);

  useEffect(() => {
    initializePageData(); //  Initialize page data
    clearBusinesses(); // Initialize the businesses array
    getAllBusinesses({ pageSize, pageNumber }); //  Get the first businesses

    //  ComponentWillUnMount
    return () => {
      clearBusinesses();
    };
  }, []);

  /**
   * Fetch the next businesses whenever the scrollbar is donwned to the bottom.
   */
  const fetchNextData = () => {
    if (businesses.length !== expectedBusinessesAmount) {
      setPageNumber(pageNumber + 1);
      getAllBusinesses({ pageSize, pageNumber: pageNumber + 1 });
    }
  };

  /**
   * Initialize page size and page number
   */
  const initializePageData = () => {
    setPageSize(DEFAULT_PAGE_SIZE);
    setPageNumber(DEFAULT_PAGE_NUMBER);
  };

  /**
   * Open the business edit dialog
   */
  const openBusinessEditDialog = (business = null) => {
    openDialog(business);
  };

  const deleteBusiness = (_id) => {
    openConfirmDialog(_id, CONFIRM_MESSAGE);
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 10 }}>
      {/* Title and "New business" button */}
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontSize={36} fontWeight="bold">
              Businesses
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openBusinessEditDialog()}
            >
              New Business
            </Button>
          </Box>
        </Stack>
        <Divider />
      </Stack>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <InfiniteScroll
          dataLength={businesses.length}
          hasMore={
            businesses.length === expectedBusinessesAmount ? false : true
          }
          next={fetchNextData}
          height={700}
          loader={
            businesses.length <= expectedBusinessesAmount ? (
              <></>
            ) : (
              <Typography variant="subtitle1" align="center" mt={1}>
                Loading...
              </Typography>
            )
          }
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>No</StyledTableCell>
                <StyledTableCell>Logo</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Address</StyledTableCell>
                <StyledTableCell>Available Time</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businesses.map((business, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    {business.logo ? (
                      <Paper
                        sx={{ width: 84, height: 84, objectFit: 'cover' }}
                        component="img"
                        src={UPLOADED_FILE_PATH + business.logo}
                      />
                    ) : (
                      <Paper sx={{ width: 84, height: 84 }} />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>{business.name}</StyledTableCell>
                  <StyledTableCell>{business.email}</StyledTableCell>
                  <StyledTableCell>{business.address}</StyledTableCell>
                  <StyledTableCell>
                    {business.openTime} ~ {business.closeTime}
                  </StyledTableCell>
                  <StyledTableCell>
                    <ButtonGroup>
                      <Button
                        variant="contained"
                        onClick={() => openBusinessEditDialog(business)}
                      >
                        <Edit />
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => deleteBusiness(business._id)}
                      >
                        <Delete />
                      </Button>
                    </ButtonGroup>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </InfiniteScroll>
      </TableContainer>
      <BusinessEditDialog />
      <AlertMessage />
      <ConfirmDialog />
    </Container>
  );
}
