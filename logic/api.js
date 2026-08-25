// ==========================================
// CineFlow Dynamic OMDb API Service (Paginated & Multi-Genre)
// ==========================================
import { CONFIG } from './config.js';

export class ApiService {
  static _cache = new Map();

  /**
   * Search already cached and loaded movie catalog
   */
  static searchCatalog(query) {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results = [];
    for (const [, value] of this._cache.entries()) {
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item && item.title && item.title.toLowerCase().includes(q)) {
            results.push(item);
          }
        });
      } else if (value && value.title && value.title.toLowerCase().includes(q)) {
        results.push(value);
      }
    }
    return this._deduplicate(results);
  }

  /**
   * Search real movies via OMDb API with caching
   */
  static async searchOMDb(query, page = 1) {
    if (!query || query.trim().length === 0) return [];
    const cacheKey = `search_${query.toLowerCase()}_${page}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const url = `${CONFIG.OMDB_BASE_URL}?apikey=${CONFIG.OMDB_API_KEY}&s=${encodeURIComponent(query)}&page=${page}&type=movie`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === 'True' && data.Search) {
        const movies = data.Search
          .filter(item => item.Poster && item.Poster !== 'N/A' && item.Poster.startsWith('http'))
          .map(item => this._formatMovieSummary(item));
        this._cache.set(cacheKey, movies);
        return movies;
      }
      return [];
    } catch (err) {
      console.warn('OMDb API Search failed:', err);
      return [];
    }
  }

  /**
   * Get Full Movie Details from OMDb by IMDb ID
   */
  static async getMovieById(idOrImdb) {
    const imdbID = idOrImdb ? idOrImdb.replace('omdb_', '').replace('film_', '') : '';
    if (!imdbID) return null;
    const cacheKey = `detail_${imdbID}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    try {
      const url = `${CONFIG.OMDB_BASE_URL}?apikey=${CONFIG.OMDB_API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.Response === 'True') {
        const formatted = this._formatMovieDetail(data);
        this._cache.set(cacheKey, formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('OMDb detail fetch failed for ID:', idOrImdb, err);
    }

    return null;
  }

  /**
   * Dynamically fetch Hero Movie from API (top trending film)
   */
  static async fetchHeroMovie() {
    const trending = await this.fetchTrending();
    if (trending && trending.length > 0) {
      const topMovie = trending[0];
      const fullDetail = await this.getMovieById(topMovie.imdbID);
      if (fullDetail) return fullDetail;
      return topMovie;
    }

    const fallbackResults = await this.searchOMDb('Dune');
    if (fallbackResults && fallbackResults.length > 0) {
      const detail = await this.getMovieById(fallbackResults[0].imdbID);
      if (detail) return detail;
    }

    return {
      id: 'omdb_hero',
      imdbID: '',
      title: 'Premiere Cinema',
      synopsis: 'Explore the full catalog of blockbuster films and curated collections.',
      genre: 'Cinema',
      category: 'all',
      duration: 'Feature Film',
      year: '2025',
      rating: '8.8',
      director: '',
      cast: '',
      badge: '4K Ultra HD',
      poster: '',
      backdrop: '',
      videoUrl: ''
    };
  }

  /**
   * Fetch Trending Blockbusters (Expansive items via API)
   */
  static async fetchTrending() {
    const cacheKey = 'shelf_trending_large';
    if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

    const queries = ['Dune', 'Oppenheimer', 'Interstellar', 'Avatar', 'Inception', 'Avengers', 'Gladiator', 'Batman'];
    const results = await Promise.all(queries.map(q => this.searchOMDb(q, 1)));
    const combined = this._deduplicate(results.flat());

    this._cache.set(cacheKey, combined);
    return combined;
  }

  /**
   * Fetch Curated Sci-Fi & Cyberpunk Masterpieces
   */
  static async fetchCuratedSciFi() {
    const cacheKey = 'shelf_scifi_cyber_large';
    if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

    const queries = ['Blade Runner', 'Matrix', 'Cyberpunk', 'Arrival', 'Tenet', 'Tron', 'Alien', 'Ghost in the Shell'];
    const results = await Promise.all(queries.map(q => this.searchOMDb(q, 1)));
    const combined = this._deduplicate(results.flat());

    this._cache.set(cacheKey, combined);
    return combined;
  }

  /**
   * Fetch Action & Thriller Titles
   */
  static async fetchActionThrillers() {
    const cacheKey = 'shelf_action_large';
    if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

    const queries = ['Batman', 'John Wick', 'Mad Max', 'Mission Impossible', 'Top Gun', 'Die Hard', 'Casino Royale'];
    const results = await Promise.all(queries.map(q => this.searchOMDb(q, 1)));
    const combined = this._deduplicate(results.flat());

    this._cache.set(cacheKey, combined);
    return combined;
  }

  /**
   * Fetch Mythic Fantasy & Worlds
   */
  static async fetchMythicFantasy() {
    const cacheKey = 'shelf_fantasy_large';
    if (this._cache.has(cacheKey)) return this._cache.get(cacheKey);

    const queries = ['Lord of the Rings', 'Harry Potter', 'Hobbit', 'Star Wars', 'Witcher', 'Chronicles of Narnia'];
    const results = await Promise.all(queries.map(q => this.searchOMDb(q, 1)));
    const combined = this._deduplicate(results.flat());

    this._cache.set(cacheKey, combined);
    return combined;
  }

  /**
   * Paginated Genre Fetcher for Discovery View
   */
  static async fetchGenrePaginated(genreId = 'all', page = 1) {
    const cacheKey = `genre_paginated_${genreId}_${page}`;
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const keywords = CONFIG.GENRE_SEARCH_KEYWORDS[genreId] || CONFIG.GENRE_SEARCH_KEYWORDS.all;
    const keywordIndex = (page - 1) % keywords.length;
    const currentQuery = keywords[keywordIndex];
    const secondaryQuery = keywords[(keywordIndex + 1) % keywords.length];

    const [batch1, batch2] = await Promise.all([
      this.searchOMDb(currentQuery, Math.ceil(page / 2)),
      this.searchOMDb(secondaryQuery, Math.ceil(page / 2))
    ]);

    const combined = this._deduplicate([...batch1, ...batch2]);
    const result = {
      movies: combined,
      page,
      totalPages: 8,
      genre: genreId
    };

    this._cache.set(cacheKey, result);
    return result;
  }

  /**
   * All Universes Aggregated Overview for Discovery
   */
  static async getMoviesByGenreAsync(genreId, page = 1) {
    if (genreId === 'all') {
      const [trending, scifi, action, fantasy, horror] = await Promise.all([
        this.fetchTrending(),
        this.fetchCuratedSciFi(),
        this.fetchActionThrillers(),
        this.fetchMythicFantasy(),
        this.searchOMDb('Shining')
      ]);

      return {
        trending,
        scifi,
        action,
        fantasy,
        horror,
        all: this._deduplicate([...trending, ...scifi, ...action, ...fantasy, ...horror])
      };
    }

    return await this.fetchGenrePaginated(genreId, page);
  }

  // --- Internal Helpers ---

  static _formatMovieSummary(item) {
    const posterUrl = item.Poster && item.Poster !== 'N/A' ? item.Poster : '';
    return {
      id: `omdb_${item.imdbID}`,
      imdbID: item.imdbID,
      title: item.Title,
      year: item.Year,
      genre: item.Type ? item.Type.toUpperCase() : 'CINEMA',
      poster: posterUrl,
      backdrop: posterUrl,
      rating: '8.5',
      duration: 'Feature Film',
      videoUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(item.Title + ' ' + (item.Year || '') + ' official trailer')}&autoplay=1`
    };
  }

  static _formatMovieDetail(data) {
    const mainGenre = data.Genre ? data.Genre.split(',')[0].trim() : 'Cinema';
    let category = 'all';
    const gLower = data.Genre ? data.Genre.toLowerCase() : '';
    if (gLower.includes('action') || gLower.includes('thriller')) category = 'action';
    else if (gLower.includes('fantasy') || gLower.includes('adventure')) category = 'fantasy';
    else if (gLower.includes('horror')) category = 'horror';
    else if (gLower.includes('cyber') || gLower.includes('sci-fi')) category = 'scifi';

    const posterUrl = data.Poster && data.Poster !== 'N/A' ? data.Poster : '';

    return {
      id: `omdb_${data.imdbID}`,
      imdbID: data.imdbID,
      title: data.Title,
      tagline: data.Awards && data.Awards !== 'N/A' ? data.Awards : `${data.Genre || 'Cinema'} • ${data.Year || ''}`,
      synopsis: data.Plot && data.Plot !== 'N/A' ? data.Plot : 'An extraordinary cinematic experience featuring iconic performances and visual depth.',
      genre: mainGenre,
      category: category,
      duration: data.Runtime && data.Runtime !== 'N/A' ? data.Runtime : 'Feature Film',
      year: data.Year || '',
      rating: data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : '8.5',
      director: data.Director && data.Director !== 'N/A' ? data.Director : 'Director',
      cast: data.Actors && data.Actors !== 'N/A' ? data.Actors : 'Cast',
      badge: data.Rated && data.Rated !== 'N/A' ? data.Rated : '4K Ultra HD',
      poster: posterUrl,
      backdrop: posterUrl,
      videoUrl: `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(data.Title + ' ' + (data.Year || '') + ' official trailer')}&autoplay=1`,
      directorInsight: {
        track: `Audio Commentary: ${data.Title}`,
        duration: '14:20',
        quote: `Directed by ${data.Director || 'Director'}. Starring ${data.Actors || 'Cast'}.`
      }
    };
  }

  static _deduplicate(list) {
    const map = new Map();
    list.forEach(item => {
      if (item && item.imdbID && !map.has(item.imdbID)) {
        map.set(item.imdbID, item);
      }
    });
    return Array.from(map.values());
  }
}
