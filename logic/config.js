// ==========================================
// CineFlow Application Configuration (Expanded)
// ==========================================

export const CONFIG = {
  OMDB_API_KEY: 'c4633901',
  OMDB_BASE_URL: 'https://www.omdbapi.com/',
  STORAGE_KEYS: {
    WATCHLIST: 'cineflow_watchlist',
    HISTORY: 'cineflow_history',
    PROGRESS: 'cineflow_progress',
    LIKES: 'cineflow_likes'
  },
  DEFAULT_ROUTE: '#home',
  
  // Primary Quick Filter Pills
  PRIMARY_GENRES: [
    { id: 'all', label: 'All Universes', icon: 'auto_awesome' },
    { id: 'scifi', label: 'Sci-Fi', icon: 'rocket_launch' },
    { id: 'cyber', label: 'Cyberpunk', icon: 'memory' },
    { id: 'action', label: 'Action', icon: 'local_fire_department' },
    { id: 'fantasy', label: 'Fantasy', icon: 'castle' },
    { id: 'horror', label: 'Horror', icon: 'psychology_alt' }
  ],

  // Extended Genre Multiverse for "Other Filters" Modal
  ALL_GENRES: [
    { id: 'all', label: 'All Universes', icon: 'auto_awesome', desc: 'The complete infinite cinema multiverse' },
    { id: 'scifi', label: 'Sci-Fi & Space', icon: 'rocket_launch', desc: 'Interstellar travel, singularity, and quantum dimensions' },
    { id: 'cyber', label: 'Cyberpunk & Synth', icon: 'memory', desc: 'Neon dystopian cities, AI rebellion, and neural networks' },
    { id: 'action', label: 'Action & Thrillers', icon: 'local_fire_department', desc: 'High-octane velocity, stunts, and tactical operations' },
    { id: 'fantasy', label: 'Mythic Fantasy', icon: 'castle', desc: 'Ancient magic, mythical beasts, and celestial lore' },
    { id: 'horror', label: 'Cosmic & Dark Horror', icon: 'psychology_alt', desc: 'Supernatural fear, psychological tension, and occult mystery' },
    { id: 'anime', label: 'Anime & Animation', icon: 'animation', desc: 'Japanese animation masterpieces and futuristic visionary worlds' },
    { id: 'mystery', label: 'Mystery & Noir', icon: 'search', desc: 'Investigative detectives, rain-slicked alleys, and conspiracy' },
    { id: 'adventure', label: 'Epic Adventure', icon: 'explore', desc: 'Expeditions to lost realms and uncharted horizons' },
    { id: 'crime', label: 'Crime & Gangsters', icon: 'security', desc: 'Underworld syndicates, heists, and moral ambiguity' },
    { id: 'drama', label: 'Cinematic Drama', icon: 'theater_comedy', desc: 'Emotional depth, human conflict, and prestigious storytelling' },
    { id: 'classics', label: 'Classic Vintage', icon: 'history_edu', desc: 'Golden age masterpieces that shaped cinematic history' }
  ],

  // Keyword query mappings for high quality OMDb searches
  GENRE_SEARCH_KEYWORDS: {
    all: ['Interstellar', 'Dune', 'Blade Runner', 'Matrix', 'Avatar', 'Batman', 'Lord of the Rings', 'Inception'],
    scifi: ['Interstellar', 'Arrival', 'Star Wars', 'Alien', 'Gravity', '2001 A Space Odyssey', 'Tenet'],
    cyber: ['Blade Runner', 'Matrix', 'Cyberpunk', 'Tron', 'Ghost in the Shell', 'Akira', 'Total Recall'],
    action: ['Batman', 'John Wick', 'Mad Max', 'Mission Impossible', 'Top Gun', 'Gladiator', 'Die Hard'],
    fantasy: ['Lord of the Rings', 'Harry Potter', 'Hobbit', 'Witcher', 'Chronicles of Narnia', 'Pan Labyrinth'],
    horror: ['The Shining', 'Alien', 'A Quiet Place', 'Hereditary', 'Conjuring', 'Halloween', 'Scream', 'It'],
    anime: ['Spirited Away', 'Attack on Titan', 'Akira', 'Your Name', 'Princess Mononoke', 'Demon Slayer'],
    mystery: ['Se7en', 'Shutter Island', 'Zodiac', 'Knives Out', 'Memento', 'Sherlock Holmes', 'Prisoners'],
    adventure: ['Indiana Jones', 'Jurassic Park', 'Pirates of the Caribbean', 'Jumanji', 'Uncharted'],
    crime: ['The Godfather', 'Pulp Fiction', 'Goodfellas', 'Scarface', 'Casino', 'Heat', 'Departed'],
    drama: ['Oppenheimer', 'Shawshank Redemption', 'Forrest Gump', 'Fight Club', 'Whiplash'],
    classics: ['Casablanca', 'Citizen Kane', 'Psycho', 'Apocalypse Now', 'Metropolis', 'Sunset Boulevard']
  }
};
