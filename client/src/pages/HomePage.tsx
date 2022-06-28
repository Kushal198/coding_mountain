import React, { useEffect, useState, useCallback } from 'react';
import { CryptoTable } from '../components/CryptoDataTable';

import {
  Container,
  Tooltip,
  Box,
  TextField,
  Modal,
  Autocomplete,
  Typography,
  MenuItem,
  Button,
  Checkbox,
} from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export type Payload = {
  id: number;
  name: string;
  code: string;
  rank: string;
  image: string;
  price: string;
  marketCap: string;
  h24: string;
};

const HomePage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [data, setData] = useState<Payload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState([]);
  const [selected, setSelected]: any = React.useState([]);
  const [code, setCode] = useState('');
  const [minimumPrice, setMinimumPrice] = useState(0);
  const [maximumPrice, setMaximumPrice] = useState(0);

  const handleOpen = async (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    if (selected.includes(id)) {
      setOpen(false);
      setFav(fav.filter((ele: any) => ele.id !== id));
      await axios.delete('/api/watch-list', {
        data: {
          id,
        },
      });
    } else {
      setCode(event.target.name);
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const removeFavourite = useCallback((id: any) => {
    // getProductInfoAction(id);

    // const data = await axios.put('/api/favorite-coins',{

    // })
    console.log(id);
  }, []);

  const handleSubmit = async (event: any) => {
    const { data } = await axios.put('/api/favorite-coins', {
      code,
      minimumPrice,
      maximumPrice,
    });

    setFav(data);
    setOpen(false);
    setMinimumPrice(0);
    setMaximumPrice(0);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data } = await axios('/api/price-feed');
      setData(data.result);
      setIsLoading(false);
    };
    const fetchFavorite = async () => {
      setIsFavLoading(true);
      const { data } = await axios('/api/watch-list');
      setFav(data.results);
      setIsFavLoading(false);
    };
    fetchData();
    fetchFavorite();
  }, []);

  useEffect(() => {
    // const test = (id:any) => {
    //   const selectedIndex:any = selected.indexOf(id);

    //   let newSelected:any = [];

    //   if (selectedIndex === -1) {
    //     newSelected = newSelected.concat(selected, id);
    //   } else if (selectedIndex === 0) {
    //     newSelected = newSelected.concat(selected.slice(1));
    //   } else if (selectedIndex === selected.length - 1) {
    //     newSelected = newSelected.concat(selected.slice(0, -1));
    //   } else if (selectedIndex > 0) {
    //     newSelected = newSelected.concat(
    //       selected.slice(0, selectedIndex),
    //       selected.slice(selectedIndex + 1),
    //     );
    //   }
    //   console.log(selected);
    //   setSelected(newSelected);
    // }
    // test(fav.map((item:any) => item.id))
    setSelected(fav.map((item: any) => item.id));
  }, [fav]);

  const isSelected: any = (id: any) => selected.indexOf(id) !== -1;

  const cols = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        Cell: (props: any) => (
          <>
            <Tooltip title="Add To Watchlist">
              <IconButton>
                <Checkbox
                  name={props.row.original.code}
                  checked={isSelected(props.row.original.id)}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  onChange={(event) => handleOpen(event, props.row.original.id)}
                />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
      {
        Header: 'All Coins',
        accessor: 'coins',
        cellClass: '',
        Cell: (props: any) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 4 }}>
              <div className="coinRank">{props.row.original.rank}</div>
            </Box>
            <img style={{ width: '30px' }} src={props.row.original.image} />
            <Box sx={{ ml: 2 }}>
              <div className="coinName">{props.row.original.name}</div>
              <div className="coinSymbol">{props.row.original.code}</div>
            </Box>
          </Box>
        ),
      },
      {
        Header: 'Price',
        accessor: 'price',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.value}</>,
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.value}</>,
      },
      {
        Header: '24H',
        accessor: 'h24',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.value}</>,
      },
    ],
    [handleChange]
  );

  //Favorite cols
  const favCols = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        Cell: (props: any) => (
          <>
            <Tooltip title="Remove From Watchlist">
              <IconButton>
                <Checkbox
                  name={props.row.original.code}
                  checked={isSelected(props.row.original.id)}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  onChange={(event) => handleOpen(event, props.row.original.id)}
                />
              </IconButton>
            </Tooltip>
          </>
        ),
      },
      {
        Header: 'Favorites',
        accessor: 'coins',
        cellClass: '',
        Cell: (props: any) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ mr: 4 }}>
              <div className="coinRank">{props.row.original.rank}</div>
            </Box>
            <img style={{ width: '30px' }} src={props.row.original.image} />
            <Box sx={{ ml: 2 }}>
              <div className="coinName">{props.row.original.name}</div>
              <div className="coinSymbol">{props.row.original.code}</div>
            </Box>
          </Box>
        ),
      },

      {
        Header: 'Price',
        accessor: 'price',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.value}</>,
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.value}</>,
      },
      {
        Header: '24H',
        accessor: 'h24',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.value}</>,
      },
    ],
    [handleChange]
  );

  return (
    <Container fixed>
      <Autocomplete
        id="free-solo-2-demo"
        disableClearable
        options={data.map((option: any) => option.code)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
            sx={{ maxWidth: '25%' }}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        )}
      />
      {isFavLoading ? (
        <div>Loading Fav...</div>
      ) : (
        <>{fav.length > 0 && <CryptoTable columns={favCols} data={fav} />}</>
      )}

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CryptoTable
          columns={cols}
          data={data}
          searchKeyword={searchKeyword}
          pagination
        />
      )}

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <TextField
                style={{ width: '100%', marginBottom: '30px' }}
                select
                label="Select"
                value={code}
                onChange={handleChange}
                helperText="Please select your coin"
              >
                {data?.map((option: any) => (
                  <MenuItem key={option.code} value={option.code}>
                    {option.name} ({option.code})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                style={{ width: '100%', marginBottom: '30px' }}
                type="number"
                label="Minimum Price"
                value={minimumPrice}
                onChange={(event: any) => setMinimumPrice(event.target.value)}
              />
              <TextField
                style={{ width: '100%', marginBottom: '30px' }}
                type="number"
                label="Maxiumum Price"
                value={maximumPrice}
                onChange={(event: any) => setMaximumPrice(event.target.value)}
              />
              <Button
                style={{ width: '100%' }}
                variant="outlined"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default HomePage;
