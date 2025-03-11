import fs from 'fs/promises';
//import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  id: string;
  name: string;

  constructor(name: string) {
    this.id = uuidv4(); // Generate unique ID
    this.name = name;
  }
}
// TODO: Complete the HistoryService class
class HistoryService {
  //private filePath = path.join(process.cwd(), 'searchHistory.json');
  private filePath = 'db/db.json'
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return an empty array
        return [];
      }
      console.error('Error reading search history:', error);
      throw error;
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing search history:', error);
      throw error;
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}
  async getCities(): Promise<City[]> {
    return await this.read();
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}
  async addCity(city: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(city);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.read();
    const index = cities.findIndex((city) => city.id === id);
    if (index === -1) {
      return false;
    }
    cities.splice(index, 1);
    await this.write(cities);
    return true;
  }
}

export default new HistoryService();
