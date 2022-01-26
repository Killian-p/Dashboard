import  React, { useEffect, useState } from 'react';
import { CCard, CAlert, CImage } from '@coreui/react'
import { fetchWidgetData } from '../../../api/widget';
import { useToken } from '../../../hooks/useToken';

interface WeatherData {
  coord: {
    lon: number,
    lat: number
  },
  weather: [
    {
      id: number,
      main: string,
      description: string,
      icon: string
    }
  ],
  base: string,
  main: {
    temp: number,
    feels_like: number,
    temp_min: number,
    temp_max: number,
    pressure: number,
    humidity: number,
    sea_level: number,
    grnd_level: number
  },
  visibility: number,
  wind: {
    speed: number,
    deg: number,
    gust: number
  },
  clouds: {
    all: number
  },
  dt: number,
  sys: {
    type: number,
    id: number,
    country: string,
    sunrise: number,
    sunset: number
  },
  timezone: number,
  id: number,
  name: string,
  cod: number,
  message: string
}

const WeatherWidget = ({id}: {id: number}) => {
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const token = useToken();

  const fetchWeatherData = () => fetchWidgetData<WeatherData>(token.get(), id, 'GET');

  const updateData = () => {
    fetchWeatherData()
      .then(setWeatherData)
      .catch(console.error)
  }

  useEffect(() => {
    updateData();
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CCard style={{ width: '22rem' }}>
      {
        (weatherData) ?
          (weatherData?.cod === 200) ?
            <div>
              <div className="grid grid-cols-2 bg-blue-400 pt-3">
                <div className="pl-4">
                  <p className="text-2xl">{weatherData?.name}, {weatherData?.sys.country}</p>
                  <p>{weatherData?.weather[0].description}</p>
                </div>
                <div>
                  <CImage fluid width={100} height={100} src={`http://openweathermap.org/img/w/${weatherData?.weather[0].icon}.png`}/>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="grid grid-row-2">
                  <div className="grid grid-cols-2">
                    <div className="h-auto flex flex-wrap content-center justify-center">
                      <p className="text-blue-500 text-2xl font-bold">{weatherData?.main.temp_min}°C</p>
                    </div>
                    <div className="h-auto flex flex-wrap content-center justify-center">
                      <p className="text-red-500 text-2xl font-bold">{weatherData?.main.temp_max}°C</p>
                    </div>
                  </div>
                    <div className="h-auto flex flex-wrap content-center justify-center">
                    <p className="text-5xl font-bold">{weatherData?.main.temp}°C</p>
                  </div>
                </div>
                <div>
                  <p className="text-xl pt-2">Details :</p>
                  <div className="grid grid-cols-2">
                    <div>
                      <p className="m-0">Wind</p>
                      <p className="m-0">Humidity</p>
                      <p className="m-0">Cloud</p>
                      <p className="m-0">Pressure</p>
                    </div>
                    <div>
                      <p className="m-0">{weatherData?.wind.speed} m/s</p>
                      <p className="m-0">{weatherData?.main.humidity}%</p>
                      <p className="m-0">{weatherData?.clouds.all}%</p>
                      <p className="m-0">{weatherData?.main.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="bg-blue-400 flex justify-end p-0 m-0">{new Date(weatherData?.dt! * 1000).toLocaleString('fr-FR', { timeZone: 'UTC' })}</p>
            </div>
            :
            <div>
              <CAlert className="m-0" color="danger">
                <p className="flex justify-center m-0">Weather Widget Error:</p>
                <p className="flex justify-center m-0">City not found.</p>
              </CAlert>
            </div>
          :
          <></>
      }
    </CCard>
  )
}

export default WeatherWidget;