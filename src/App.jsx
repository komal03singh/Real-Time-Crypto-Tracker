import React,{useEffect} from 'react'
import { useDispatch ,useSelector } from 'react-redux'
import { updatePrice } from './features/cryptoSlice'
import {CryptoWebSocket} from './app/websocket'
import chart from './assets/chart.png'
function App() {

  const dispatch = useDispatch()
  const prices = useSelector(state => state.crypto.asset)

  useEffect(() => {
    const handleUpdates = (data) => {
      if(data.e === '24hrTicker')
        dispatch(updatePrice({
          symbol:data.s,
          price:parseFloat(data.c),
          percentChange1h:parseFloat(data.p),
          percentChange24h: parseFloat(data.P),
          volume24h: parseFloat(data.q),
          marketCap: parseFloat(data.c) * 21000000
      }));
    }
    
    const ws = new CryptoWebSocket('wss://stream.binance.com:9443/ws', handleUpdates);

    ['btcusdt', 'ethusdt', 'bnbusdt', 'xrpusdt', 'ltcusdt'].forEach(symbol => ws.subscribe(symbol));

    return () => {
      ['btcusdt', 'ethusdt', 'bnbusdt'].forEach(symbol => ws.unsubscribe(symbol));
      ws.socket.close();
    };
  },[dispatch])

  return (
    <>
      <table className="border border-gray-400 w-full h-screen">
        <thead>
          <tr className='border border-gray-400 '>
            <th className='px-2'>S.No</th>
            <th className='px-2'>Name</th>
            <th className='px-2'>Price</th>
            <th className='px-2'>1h%</th>
            <th className='px-2'>24h%</th>
            <th className='px-2'>7d%</th>
            <th className='px-2'>Market Cap</th>
            <th className='px-2'>Volume (24hr)</th>
            <th className='px-2'>Circulating Supply</th>
            <th className='px-2'>Last 7 Days</th>
          </tr>
        </thead>
        <tbody>
        {prices.map((asset, index) => (
          <tr className='border border-gray-400 text-center' key={index}>
            <td>{index + 1}</td>
            <td>{asset.symbol}</td>
            <td>${asset.price.toFixed(2)}</td>
            <td style={{ color: asset.percentChange1h >=0?'green' : 'red' }}>
              {asset.percentChange1h?.toFixed(2)}%
            </td>
            <td style={{ color: asset.percentChange24h >= 0 ? 'green' : 'red' }}>
                {asset.percentChange24h.toFixed(2)}%
              </td>
              <td>{asset.percentChange7d?.toFixed(2) || '10%'}</td>{/*dummy number*/}
              <td>${(asset.marketCap / 1e9).toFixed(2)} B</td>
              <td>${(asset.volume24h / 1e6).toFixed(2)} M</td>
              <td>{(asset.circulatingSupply / 1e6).toFixed(2)} M</td>
              <td><img className='h-15 w-30' src={chart} alt="chart" /></td>
          </tr>))}
        </tbody>
      </table>
    </>
  )
}

export default App
