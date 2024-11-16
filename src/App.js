import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Search from './components/Search/Search';
import WeeklyForecast from './components/WeeklyForecast/WeeklyForecast';
import TodayWeather from './components/TodayWeather/TodayWeather';
import { fetchWeatherData } from './api/OpenWeatherService';
import { transformDateFormat } from './utilities/DatetimeUtils';
import UTCDatetime from './components/Reusable/UTCDatetime';
import LoadingBox from './components/Reusable/LoadingBox';
import Logo from './assets/logo.png';
import ErrorBox from './components/Reusable/ErrorBox';
import WindyEmbed from './components/Reusable/WindyEmbed';
import { ALL_DESCRIPTIONS } from './utilities/DateConstants';
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from './utilities/DataUtils';

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  // Geolocation to fetch weather data based on user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchWeatherForLocation(latitude, longitude);
        },
        (error) => {
          setError(true);
          console.log(error.message);
        }
      );
    } else {
      setError(true);
    }
  }, []);

  // Fetch weather data based on location (latitude, longitude)
  const fetchWeatherForLocation = async (latitude, longitude) => {
    setIsLoading(true);
    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] = await fetchWeatherData(
        latitude,
        longitude
      );
      const all_today_forecasts_list = getTodayForecastWeather(weekForecastResponse, currentDate, dt_now);
      const all_week_forecasts_list = getWeekForecastWeather(weekForecastResponse, ALL_DESCRIPTIONS).slice(0, 7);

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: `Lat: ${latitude}, Lon: ${longitude}`, ...todayWeatherResponse });
      setWeekForecast({
        city: `Lat: ${latitude}, Lon: ${longitude}`,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  // Search change handler
  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(' ');

    setIsLoading(true);
    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] = await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(weekForecastResponse, currentDate, dt_now);
      const all_week_forecasts_list = getWeekForecastWeather(weekForecastResponse, ALL_DESCRIPTIONS).slice(0, 7);

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  // Static theme configuration
  const theme = createTheme({
    palette: {
      mode: 'light', // Set static light mode
      primary: {
        main: '#1976d2',
      },
      background: {
        default: '#ffffff',
        paper: '#f4f6f8',
      },
    },
  });

  // Conditional content rendering
  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: '100%',
        minHeight: '500px',
      }}
    >
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: '12px', sm: '14px' },
          color: 'rgba(0, 0, 0, .85)',
          fontFamily: 'Poppins',
          textAlign: 'center',
          margin: '2rem 0',
          maxWidth: '80%',
          lineHeight: '22px',
        }}
      >
        Explore current weather data and 7-day forecast of more than 200,000 cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={6}>
          <TodayWeather data={todayWeather} forecastList={todayForecast} />
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox margin="3rem auto" flex="inherit" errorMessage="Something went wrong" />
    );
  }

  if (isLoading) {
    appContent = (
      <LoadingBox value="1">
        <Typography variant="h3" component="h3" sx={{ fontSize: '16px' }}>
          Loading...
        </Typography>
      </LoadingBox>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ maxWidth: '90%', margin: '0 auto', padding: '1rem' }}>
        <Grid container columnSpacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box component="img" sx={{ height: '56px' }} alt="logo" src={Logo} />
              <UTCDatetime />
            </Box>
            <Search onSearchChange={searchChangeHandler} />
          </Grid>
          {appContent}
        </Grid>
        <Box sx={{ marginTop: '3rem' }}>
          <WindyEmbed />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
