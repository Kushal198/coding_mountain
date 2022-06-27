import React,{useEffect,useState} from 'react';
import { CryptoTable } from '../components/CryptoDataTable';
import {data} from '../components/data';
import { Container, Tooltip, Box } from '@mui/material';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';


const HomePage = () => {
 
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    const fetchData = async()=> {
      setIsLoading(true);
      const {data} = await axios('/api/price-feed');
      console.log(data);
      setData(data.result);
      setIsLoading(false);
    }
    fetchData();

  },[])

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
              
           
            
            <Box sx={{mr:4}}>
            <div className="coinRank">{props.row.original.rank}</div>
            </Box>
            <img style={{width: '30px'}} src={props.row.original.image}/>
            <Box sx={{ml: 2}}>
          
            <div className='coinName'>{props.row.original.name}</div>
            <div className='coinSymbol'>{props.row.original.code}</div>
            </Box>
            </Box>,
          },
          {
            Header: 'Price',
            accessor: 'price',
            cellClass: 'cellStyling',
            Cell: (props) => <>{props.value}</>,
          },
          {
            Header: 'Market Cap',
            accessor: 'marketCap',
            cellClass: 'cellStyling',
            Cell: (props) => <>{props.value}</>,
          },
          {
            Header: '24H',
            accessor: 'h24',
            cellClass: 'cellStyling',
            Cell: (props) => <>{props.value}</>,
          },
      ],[]);
    return(
        <Container fixed>
            <CryptoTable columns={cols} data={data} isLoading={isLoading}/>
        </Container>
    )
}

export default HomePage;