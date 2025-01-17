/* eslint-disable react/prop-types */
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { fakeUniqueData } from '../../NetFlixCountries';

function createData(
  name,
  image,
  trailer,
  addToWatchList,
) {
  return {
    name,
    image,
    trailer,
    addToWatchList,
  };
}
// creates the rows by taking data and extracting each movies data
const rows = fakeUniqueData.map((movie) => createData(movie.title, movie.img, movie));

function BasicTable(props) {
  const { changeMovie } = props;
  const trailerPlay = (movie) => {
    changeMovie(movie);
    // const addToWatchList()=>{

    // }
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 200, maxHeight: 100 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Unique Programs</TableCell>
            <TableCell align="right">Image</TableCell>
            <TableCell align="right">Watch Trailer</TableCell>
            <TableCell align="right">Add To WatchList</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <img src={row.image} alt={row.name} width="100" />
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="primary" onClick={() => trailerPlay(row.trailer)}>
                  Get More Details
                </Button>
              </TableCell>
              <TableCell align="right">
                <Button variant="contained" color="secondary">
                  Add To WatchList
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default BasicTable;
