import React, { useState, useEffect } from "react";

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const fetchWeather = (latitude, longitude) => {
    const API_KEY = "04685745071442d789157d7e6fb2a400";
    const url = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${API_KEY}&include=minutely`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setWeather(data.data[0]);
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Weather Report</h2>
      {!locationAllowed && (
        <button onClick={getLocation}>Allow Location</button>
      )}
      {weather && (
        <div>
          <p>Location: {weather.city_name}, {weather.country_code}</p>
          <p>Temperature: {weather.temp}°C</p>
          <p>Weather: {weather.weather.description}</p>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
