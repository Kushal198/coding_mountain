import React, { useEffect, useContext, useState, useCallback } from 'react';
import { CryptoTable } from '../components/CryptoDataTable';
import '../App.css';

import {
  Container,
  Tooltip,
  TextField,
  Modal,
  Autocomplete,
  Typography,
  MenuItem,
  Button,
  Checkbox,
  Box,
  dividerClasses,
  Badge,
  AppBar,
  Toolbar,
  Skeleton,
  TableRow,
  TableCell,
} from '@mui/material';

// import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import {
  Favorite,
  FavoriteBorder,
  NotificationImportant,
} from '@mui/icons-material';
import { SocketContext } from '../socketContext';

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

const refreshIndicator = {
  position: 'relative',
  width: '10px',
  height: '10px',
  marginLeft: '6px',
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
  const socket = useContext(SocketContext);
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

  useEffect(() => {
    socket.on('priceChange', (arg: any) => {
      setData(arg.results);
    });
  }, []);

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

  const handleSubmit = async () => {
    const { data } = await axios.put('/api/watch-list', {
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
    if (fav.length) {
      setSelected(fav.map((item: any) => item.id));
    }
  }, [fav]);

  const isSelected: any = (id: any) => selected.indexOf(id) !== -1;

  const skeletonCols = React.useMemo(
    () => [
      {
        Header: '',
        accessor: 'id',
        Cell: (props: any) => (
          <Typography variant="h4">
            {' '}
            <Skeleton />
          </Typography>
        ),
      },
      {
        Header: 'All Coins',
        accessor: 'coins',
        cellClass: '',
        Cell: (props: any) => (
          <Typography variant="h4">
            {' '}
            <Skeleton />
          </Typography>
        ),
      },
      {
        Header: () => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div>Price</div>
            <div className="refresh-indicator refresh-indicator--light refresh-indicator--running">
              <div className="refresh-indicator__left-half">
                <div className="refresh-indicator__left-half-progress"></div>
              </div>{' '}
              <div className="refresh-indicator__right-half">
                <div className="refresh-indicator__right-half-progress"></div>
              </div>
            </div>
          </Box>
        ),
        accessor: 'price',
        cellClass: 'cellStyling',
        Cell: (props: any) => (
          <Typography variant="h4">
            {' '}
            <Skeleton />
          </Typography>
        ),
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
        cellClass: 'cellStyling',
        Cell: (props: any) => (
          <Typography variant="h4">
            {' '}
            <Skeleton />
          </Typography>
        ),
      },
      {
        Header: '24H',
        accessor: 'h24',
        cellClass: 'cellStyling',
        Cell: (props: any) => (
          <Typography variant="h4">
            {' '}
            <Skeleton />
          </Typography>
        ),
      },
    ],
    [handleChange]
  );

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
        Header: () => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div>Price</div>
            <div className="refresh-indicator refresh-indicator--light refresh-indicator--running">
              <div className="refresh-indicator__left-half">
                <div className="refresh-indicator__left-half-progress"></div>
              </div>{' '}
              <div className="refresh-indicator__right-half">
                <div className="refresh-indicator__right-half-progress"></div>
              </div>
            </div>
          </Box>
        ),
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
        Header: () => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <div>Price</div>
            <div className="refresh-indicator refresh-indicator--light refresh-indicator--running">
              <div className="refresh-indicator__left-half">
                <div className="refresh-indicator__left-half-progress"></div>
              </div>{' '}
              <div className="refresh-indicator__right-half">
                <div className="refresh-indicator__right-half-progress"></div>
              </div>
            </div>
          </Box>
        ),
        accessor: 'price',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.row.original.price}</>,
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.row.original.marketCap}</>,
      },
      {
        Header: '24H',
        accessor: 'h24',
        cellClass: 'cellStyling',
        Cell: (props: any) => <>{props.row.original.h24}</>,
      },
    ],
    [handleChange]
  );
  const dumbSkel: any = {
    id: 1,
    name: 'Ethereum',
    code: 'ETH',
    rank: 2,
    image: 'https://cdn.coinranking.com/rk4RKHOuW/eth.svg?size=30x30',
    price: '$1,230.02',
    marketCap: '$148.79 billion',
    h24: '-0.03%',
  };

  return (
    <>
      <Container fixed>
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
          }}
        ></div>

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
              sx={{ maxWidth: '50%' }}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          )}
        />

        {isFavLoading ? (
          <CryptoTable columns={skeletonCols} data={Array(5).fill(dumbSkel)} />
        ) : (
          <>{fav ? <CryptoTable columns={favCols} data={fav} /> : null}</>
        )}

        {isLoading ? (
          <CryptoTable
            columns={skeletonCols}
            data={Array(10).fill(dumbSkel)}
            searchKeyword={searchKeyword}
            pagination
          />
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
    </>
  );
};

export default HomePage;
