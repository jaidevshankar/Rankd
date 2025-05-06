import axios from 'axios';

const TMDB_API_KEY = "213e8f28caae25b3b4cc495a11db1272";
const SPOTIFY_CLIENT_ID = "30b50adac3584635a327735395823eb7";
const SPOTIFY_CLIENT_SECRET = "7471275b93e44c929743e06936760cc5";
const YELP_API_KEY = "ucZ-Ad_-RlW5rWrFLkUEo26NwPXJer4-8x5D-kwrJXYk8IOWseuNMiofbR0_YgpPBhzcDTa4GR4a6B9-xUyKPkmAsr6-xQALz73qxmeNSTIgVd0V2W1KZ7y760t7Z3Yx";

export interface SearchResult {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'album' | 'restaurant';
  image?: string;
  artist?: string;
  rating?: number;
  year?: string;
}

export const searchService = {
  searchAll: async (query: string): Promise<SearchResult[]> => {
    try {
      const [movies, tvShows, albums, restaurants] = await Promise.all([
        searchService.searchMovies(query),
        searchService.searchTVShows(query),
        searchService.searchAlbums(query),
        searchService.searchRestaurants(query)
      ]);

      // Combine all results and ensure unique IDs
      const allResults = [
        ...movies.map(item => ({ ...item, id: `movie-${item.id}` })),
        ...tvShows.map(item => ({ ...item, id: `tv-${item.id}` })),
        ...albums.map(item => ({ ...item, id: `album-${item.id}` })),
        ...restaurants.map(item => ({ ...item, id: `restaurant-${item.id}` }))
      ];

      return allResults;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  searchMovies: async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          language: 'en-US',
          page: 1
        }
      });
      
      return response.data.results.map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title,
        type: 'movie',
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
        rating: movie.vote_average,
        year: movie.release_date?.split('-')[0]
      }));
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  searchTVShows: async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/search/tv`, {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          language: 'en-US',
          page: 1
        }
      });
      
      return response.data.results.map((show: any) => ({
        id: show.id.toString(),
        title: show.name,
        type: 'tv',
        image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : undefined,
        rating: show.vote_average,
        year: show.first_air_date?.split('-')[0]
      }));
    } catch (error) {
      console.error('Error searching TV shows:', error);
      return [];
    }
  },

  searchAlbums: async (query: string): Promise<SearchResult[]> => {
    try {
      // First get an access token
      const authResponse = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
          }
        }
      );

      const accessToken = authResponse.data.access_token;

      const response = await axios.get('https://api.spotify.com/v1/search', {
        params: {
          q: query,
          type: 'album',
          limit: 10
        },
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return response.data.albums.items.map((album: any) => ({
        id: album.id,
        title: album.name,
        type: 'album',
        image: album.images[0]?.url,
        artist: album.artists[0]?.name,
        year: album.release_date?.split('-')[0]
      }));
    } catch (error) {
      console.error('Error searching albums:', error);
      return [];
    }
  },

  searchRestaurants: async (query: string): Promise<SearchResult[]> => {
    try {
      // Get user's location or use a default
      const location = 'San Francisco, CA'; // You might want to make this dynamic based on user's location
      
      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        params: {
          term: query,
          location: location,
          limit: 10,
          sort_by: 'best_match'
        },
        headers: {
          'Authorization': `Bearer ${YELP_API_KEY}`,
          'Accept': 'application/json'
        }
      });

      if (!response.data.businesses) {
        console.error('No businesses found in Yelp response');
        return [];
      }

      return response.data.businesses.map((business: any) => ({
        id: business.id,
        title: business.name,
        type: 'restaurant',
        image: business.image_url,
        rating: business.rating,
        year: business.is_closed ? 'Closed' : 'Open'
      }));
    } catch (error) {
      console.error('Error searching restaurants:', error);
      if (axios.isAxiosError(error)) {
        console.error('Yelp API Error:', error.response?.data);
      }
      return [];
    }
  }
};

export default {}; 