import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  humidity: number;
  description: string;
  city: string;
  date: string;
  icon: string;


  constructor(temp: number, humidity: number, description: string, city: string, date: string, icon: string) {
    this.temp = temp;
    this.humidity = humidity;
    this.description = description;
    this.city = city;
    this.date = date;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  // class WeatherService {
    private baseURL = 'https://api.openweathermap.org';
    private apiKey = process.env.API_KEY;
    private city = '';
  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  private async fetchLocationData(city: string): Promise<any> {
    try {
      const query = this.buildGeocodeQuery(city);
      const response = await axios.get(query);
      return response.data[0]; // OpenWeatherMap returns an array, we take the first result
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw new Error('Failed to fetch location data.');
    }
  }
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon
    };
  }
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.city);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
   
    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await axios.get(query);
      
      // console.log('Weather data:', response);
      const weatherAndForecast = this.buildForecastArray(this.parseCurrentWeather(response.data.list[0]),response.data.list);

      return weatherAndForecast;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data.');
    }

  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    console.log("Response is", response);
    return new Weather(
      response.weather.temp,
      response.weather.humidity,
      response.weather[0].description,
      this.city,
      response.weather.date,
      response.weather[0].icon,

  
    );
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    // console.log("WeaterDate.list is", weatherData[0]);
    const forecast : Weather[] = [currentWeather];
   weatherData.filter((data: any) => {return data })
  return forecast;
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather> {
    try {
      this.city = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData = await this.fetchWeatherData(coordinates);
      return weatherData;
    } catch (error) {
      console.error('Error getting weather for city:', error);
      throw error;
    }
  }


}

export default new WeatherService();
