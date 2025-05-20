import Head from 'next/head'

type Forecast = {
  wind_speed: number
  pressure: number
  rain: number
}

function evaluateFishing(forecast: Forecast): string {
  const { wind_speed, pressure, rain } = forecast
  if (wind_speed < 4 && pressure > 1005 && rain < 1) return "კარგი"
  if (wind_speed < 7 && pressure > 1000 && rain < 3) return "საშუალო"
  return "ცუდი"
}

export default function Home() {
  const forecast: Forecast = { wind_speed: 3, pressure: 1012, rain: 0.5 }
  const rating = evaluateFishing(forecast)

  return (
    <div className="p-6 text-center">
      <Head>
        <title>შამაია - სათევზაო ამინდი</title>
      </Head>
      <h1 className="text-4xl font-bold mb-4">ამინდის შეფასება</h1>
      <p className="text-xl">სათევზაო დღე: <strong>{rating}</strong></p>
    </div>
  )
}