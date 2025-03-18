import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// All of these routes are PREFIXED with '/api/weather'

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  // console.log(req.body);
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Fetch weather data
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history
    await HistoryService.addCity(cityName);
    console.log("weatherData is", weatherData);
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// GET Request to retrieve search history
// router.get('/history', async (req, res) => {
//   try {
//     const history = await HistoryService.getSearchHistory();
//     res.status(200).json(history);
//   } catch (error) {
//     console.error('Error fetching search history:', error);
//     res.status(500).json({ error: 'Failed to retrieve search history' });
//   }
// });

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  // console.log("Hit History Route");
  try {
    const history = await HistoryService.getCities();
    // console.log("History: ", history);
    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await HistoryService.removeCity(id);
    if (!deleted) {
      return res.status(404).json({ error: 'City not found in history' });
    }

    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error deleting search history:', error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
