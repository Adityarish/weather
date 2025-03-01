import React, { useState, useEffect } from "react";

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const fetchWeather = (latitude, longitude) => {
    const API_KEY = "04685745071442d789157d7e6fb2a400";
    const url = `https://api.weatherbit.io/v2.0/forecast/hourly?lat=${latitude}&lon=${longitude}&key=${API_KEY}&hours=6`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data.data[0]);
        setHourlyData(data.data.slice(0, 6));
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch weather data");
        setLoading(false);
      });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationAllowed(true);
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const WeatherCard = ({ hourlyData }) => {
    return (
      <div className="weather-card">
        <div className="hourly-forecast">
          {hourlyData.map((hour, index) => (
            <div className="hour" key={index}>
              <div className="time">{new Date(hour.timestamp_local).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="icon">{getWeatherIcon(hour.weather.code)}</div>
              <div className="temp">{hour.temp}°C</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getWeatherIcon = (code) => {
    const icons = {
      200: '⛈️',
      300: '🌧️',
      500: '🌧️',
      800: '☀️',
      801: '🌤️',
      802: '☁️',
      803: '☁️',
      804: '☁️'
    };
    return icons[code] || '🌫️';
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {!locationAllowed && (
        <button onClick={getLocation}>Allow Location</button>
      )}
      {weather && (
        <div>
 
          {hourlyData.length > 0 && <WeatherCard hourlyData={hourlyData} />}
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
