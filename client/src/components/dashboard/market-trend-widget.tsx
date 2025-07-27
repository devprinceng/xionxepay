'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Define market data interface with safe types
interface MarketData {
  price: number | null
  price_change_24h_percentage: number | null
  last_updated: string | null
  market_cap: number | null
  total_volume: number | null
}

// Interface for historical price data
interface PriceHistoryPoint {
  timestamp: string
  price: number
}

// Default market data with safe null values
const defaultMarketData: MarketData = {
  price: null,
  price_change_24h_percentage: null,
  last_updated: null,
  market_cap: null,
  total_volume: null
}

export const MarketTrendWidget = () => {
  const [marketData, setMarketData] = useState<MarketData>(defaultMarketData)
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Safe number formatter that handles nulls
  const formatNumber = (num: number | null): string => {
    if (num === null || num === undefined) return '$0.00'
    
    try {
      if (num >= 1000000000) {
        return `$${(num / 1000000000).toFixed(2)}B`
      } else if (num >= 1000000) {
        return `$${(num / 1000000).toFixed(2)}M`
      } else if (num >= 1000) {
        return `$${(num / 1000).toFixed(2)}K`
      } else {
        return `$${num.toFixed(2)}`
      }
    } catch (err) {
      console.error('Error formatting number:', err)
      return '$0.00'
    }
  }

  // Safe price formatter with decimal places
  const formatPrice = (price: number | null): string => {
    if (price === null || price === undefined) return '$0.000000'
    
    try {
      return `$${price.toFixed(6)}`
    } catch (err) {
      console.error('Error formatting price:', err)
      return '$0.000000'
    }
  }

  // Safe percentage formatter
  const formatPercentage = (percentage: number | null): string => {
    if (percentage === null || percentage === undefined) return '0.00'
    
    try {
      return percentage.toFixed(2)
    } catch (err) {
      console.error('Error formatting percentage:', err)
      return '0.00'
    }
  }

  // Safely get price change (positive or negative)
  const getPriceChange = (): number => {
    return marketData.price_change_24h_percentage || 0
  }

  // Determine if price change is positive
  const isPriceChangePositive = (): boolean => {
    return getPriceChange() >= 0
  }
  
  // Generate mock historical data based on current price
  const generateMockPriceHistory = useCallback((currentPrice: number | null) => {
    if (currentPrice === null) return []
    
    const points: PriceHistoryPoint[] = []
    const now = new Date()
    const basePrice = currentPrice
    const volatility = basePrice * 0.05 // 5% volatility for realistic fluctuations
    const priceChangePercentage = marketData.price_change_24h_percentage || 0
    
    // Generate 24 hourly data points for the last day
    for (let i = 24; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000))
      // Create realistic price movements with some randomness
      const randomFactor = Math.random() * volatility - (volatility / 2)
      const trendFactor = (i / 24) * (priceChangePercentage / 100) * basePrice
      const price = basePrice - trendFactor + randomFactor
      
      points.push({
        timestamp: timestamp.toISOString(),
        price: Math.max(0, price) // Ensure price doesn't go negative
      })
    }
    
    return points
  }, [marketData.price_change_24h_percentage])

  // Fetch market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true)
        // Using CoinGecko API to fetch XION price data
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=xion&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true'
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }
        
        const data = await response.json()
        
        if (data && data.xion) {
          // Safely extract data with type checking
          const newData: MarketData = {
            price: typeof data.xion.usd === 'number' ? data.xion.usd : null,
            price_change_24h_percentage: typeof data.xion.usd_24h_change === 'number' ? data.xion.usd_24h_change : null,
            last_updated: data.xion.last_updated_at ? new Date(data.xion.last_updated_at * 1000).toLocaleString() : null,
            market_cap: typeof data.xion.usd_market_cap === 'number' ? data.xion.usd_market_cap : null,
            total_volume: typeof data.xion.usd_24h_vol === 'number' ? data.xion.usd_24h_vol : null
          }
          setMarketData(newData)
          
          // Generate mock price history based on current price
          // In a production app, you would fetch real historical data from an API
          const history = generateMockPriceHistory(newData.price)
          setPriceHistory(history)
        } else {
          throw new Error('Invalid market data format')
        }
      } catch (err) {
        console.error('Error fetching market data:', err)
        setError('Failed to load market data')
      } finally {
        setLoading(false)
      }
    }

    fetchMarketData()
    
    // Refresh market data every 60 seconds
    const intervalId = setInterval(fetchMarketData, 60000)
    
    return () => clearInterval(intervalId)
  }, [generateMockPriceHistory])

  // These functions are now defined above the generateMockPriceHistory function

  // Chart configuration
  const chartData = {
    labels: priceHistory.map(point => {
      const date = new Date(point.timestamp)
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    }),
    datasets: [
      {
        label: 'XION Price (USD)',
        data: priceHistory.map(point => point.price),
        borderColor: isPriceChangePositive() ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)',
        backgroundColor: isPriceChangePositive() ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(107, 114, 128, 0.3)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (items: any) => {
            if (!items.length) return ''
            const index = items[0].dataIndex
            const date = new Date(priceHistory[index]?.timestamp || '')
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          label: (item: any) => {
            return `$${item.raw.toFixed(6)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.7)',
          font: {
            size: 9
          },
          maxRotation: 0,
          maxTicksLimit: 6
        }
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
          drawBorder: false
        },
        ticks: {
          color: 'rgba(156, 163, 175, 0.7)',
          font: {
            size: 10
          },
          callback: (value: any) => `$${value.toFixed(6)}`
        }
      }
    }
  }

  return (
    <Card className="bg-gray-800/50 p-6 rounded-xl overflow-hidden relative h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">XION Market Trend</h3>
          {!loading && !error && marketData.last_updated && (
            <span className="text-xs text-gray-400">
              Updated: {marketData.last_updated}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-aurora-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline mb-4">
              <span className="text-3xl font-bold text-white">
                {formatPrice(marketData.price)}
              </span>
              <div className={`ml-3 flex items-center ${isPriceChangePositive() ? 'text-green-400' : 'text-red-400'}`}>
                {isPriceChangePositive() ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {isPriceChangePositive() ? '+' : ''}
                  {formatPercentage(marketData.price_change_24h_percentage)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Market Cap</p>
                <p className="text-sm font-medium text-white">{formatNumber(marketData.market_cap)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">24h Volume</p>
                <p className="text-sm font-medium text-white">{formatNumber(marketData.total_volume)}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${isPriceChangePositive() ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(getPriceChange()), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Price Chart */}
            <div className="mt-4 h-[180px]">
              {priceHistory.length > 0 && (
                <Line data={chartData} options={chartOptions} />
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
