import React from 'react';
import { CryptoTable } from '../components/CryptoDataTable';
import {data} from '../components/data';
import { Container, Tooltip, Box } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';


const HomePage = () => {
    const cols = React.useMemo(() => [
      {
        Header: '',
        accessor: 'id',
        Cell:(props) =>
        <>
        <Tooltip title="Add To Watchlist">
        <IconButton>
          <FavoriteBorderOutlinedIcon/>
        </IconButton>
        </Tooltip>
        </>
      },
        {
            Header: 'All Coins',
            accessor: 'coins',
            cellClass: '',
            Cell: (props) => 
            <Box sx={{display: 'flex', alignItems: 'center'}}>
            <img style={{width: '30px'}} src='https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg?size=68x68' alt='coins img'/>
            <Box sx={{ml: 2}}>
            <div className='coinName'>{props.row.original.coins}</div>
            <div className='coinSymbol'>{props.row.original.symbol}</div>
            </Box>
            </Box>,
          },
          {
            Header: 'Price',
            accessor: 'price',
            cellClass: 'cellStyling',
            Cell: (props) => <>${props.value}</>,
          },
          {
            Header: 'Market Cap',
            accessor: 'marketCap',
            cellClass: 'cellStyling',
            Cell: (props) => <>${props.value}</>,
          },
          {
            Header: '24H',
            accessor: '24H',
            cellClass: 'cellStyling',
            Cell: (props) => <>{props.value}</>,
          },
      ],[]);
    return(
        <Container fixed>
            <CryptoTable columns={cols} data={data}/>
        </Container>
    )
}

export default HomePage;