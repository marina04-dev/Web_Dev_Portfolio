import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { CoinContext } from '../../context/CoinContext';
import { Link } from 'react-router-dom';

const Home = () => {
  const {allCoin, currency} = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState('');

  const inputHandler = (event) => {
    setInput(event.target.value);
    if (event.target.value === "") {
      setDisplayCoin(allCoin);
    }
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    const coins = await allCoin.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(coins);
  }

  useEffect(() => {
    setDisplayCoin(allCoin);
  },[allCoin]);

  return (
    <div className='home'>
      <div className='hero'>
        <h1>Largest <br/> Crypto Marketplace</h1>
        <p>Welcome To The World's Largest Cryptocurrency Marketplace. Sign Up To Explore More About Cryptos.</p>
        <form onSubmit={searchHandler}>
          <input  type='text' placeholder='Search Crypto...' list='coin-list' value={input} required onChange={inputHandler}/>
          <datalist id='coin-list'>{allCoin.map((item) => (
            <option key={item.id} value={item.name}></option>
          ))}</datalist>
          <button type='submit'>Search</button>
        </form>
      </div>
      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign: "center"}}>24H Change</p>
          <p className='market-cap'>Market Cap</p>
        </div>
        {displayCoin.slice(0,10).map((item) => (
          <Link to={`/coin/${item.id}`} className='table-layout' key={item.id}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt={`${item.name} logo`}/>
              <p>{item.name + " - " + item.symbol}</p>
            </div>
            <p>{currency.symbol} {item.current_price ? item.current_price.toLocaleString() : 'N/A'}</p>
            <p className={item.price_change_percentage_24h > 0  ? "green" : "red"}>{Math.floor(item.price_change_percentage_24h * 100)/100}</p>
            <p className='market-cap'>{currency.symbol} {item.market_cap.toLocaleString()}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home