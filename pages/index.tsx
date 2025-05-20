
import { useEffect, useState } from "react";

const cities = [
  { name: "თბილისი", lat: 41.7151, lon: 44.8271 },
  { name: "სიონი", lat: 42.1866, lon: 45.2624 },
  { name: "წალკა", lat: 41.6, lon: 44.5 },
  { name: "ნადარბაზევი", lat: 42.1833, lon: 44.8667 },
  { name: "ბაზალეთი", lat: 42.0167, lon: 44.5667 }
];

const evaluateFishing = (forecast) => {
  const wind = forecast.wind_speed;
  const pressure = forecast.pressure;
  const rain = forecast.rain;

  if (wind < 5 && pressure >= 1010 && pressure <= 1025 && rain < 0.5) return "კარგი";
  if (wind < 7 && pressure >= 1000 && rain < 2) return "საშუალო";
  return "ცუდი";
};

const fetchWeather = async (lat, lon) => {
  const res = await fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
    { headers: { "User-Agent": "shotcrimp.com weather app" } }
  );
  const data = await res.json();
  const today = data.properties.timeseries[0];

  return {
    time: today.time,
    temp: today.data.instant.details.air_temperature,
    wind_speed: today.data.instant.details.wind_speed,
    pressure: today.data.instant.details.air_pressure_at_sea_level,
    rain: today.data.next_1_hours?.details?.precipitation_amount ?? 0
  };
};

export default function Home() {
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const all = await Promise.all(
        cities.map(async (city) => {
          const forecast = await fetchWeather(city.lat, city.lon);
          return {
            ...city,
            ...forecast,
            fishing: evaluateFishing(forecast)
          };
        })
      );
      setWeatherData(all);
    };
    load();
  }, []);

  return (
    <main className="min-h-screen p-6">
      <img src="/logo.png" alt="ლოგო" className="w-20 mb-4" />
      <h1 className="text-3xl font-bold mb-6">🎣 სათევზაო ამინდი</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {weatherData.map((city, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{city.name}</h2>
            <p>ტემპერატურა: {city.temp}°C</p>
            <p>ქარი: {city.wind_speed} m/s</p>
            <p>წნევა: {city.pressure} hPa</p>
            <p>ნალექი: {city.rain} mm</p>
            <p className="mt-2 font-bold">
              სათევზაო პირობები:{" "}
              <span className={
                city.fishing === "კარგი" ? "text-green-400" :
                city.fishing === "საშუალო" ? "text-yellow-400" : "text-red-500"
              }>{city.fishing}</span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
