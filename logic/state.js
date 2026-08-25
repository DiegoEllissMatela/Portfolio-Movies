// ==========================================
// CineFlow State Management Service (Dynamic)
// ==========================================
import { CONFIG } from './config.js';

class StateManager {
  constructor() {
    this.watchlist = this._load(CONFIG.STORAGE_KEYS.WATCHLIST, []);
    this.history = this._load(CONFIG.STORAGE_KEYS.HISTORY, []);
    this.progress = this._load(CONFIG.STORAGE_KEYS.PROGRESS, {});
    this.likes = this._load(CONFIG.STORAGE_KEYS.LIKES, []);

    this.notifications = [
      { id: 'notif_1', title: 'OMDb Live Bridge', msg: 'Streaming metadata and live catalog connected directly to OMDb cloud.', time: 'Just now', read: false, icon: 'cloud_done' },
      { id: 'notif_2', title: 'Director’s Commentary', msg: 'Interactive ambient audio insights enabled for all titles.', time: '1h ago', read: false, icon: 'mic' }
    ];

    this.listeners = new Set();
  }

  _load(key, fallback) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : fallback;
      }
    } catch (e) {
      console.warn('LocalStorage access failed:', e);
    }
    return fallback;
  }

  _save(key, val) {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    this._notify();
  }

  _notify() {
    this.listeners.forEach(fn => fn(this));
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // Watchlist Management
  getWatchlist() {
    return this.watchlist;
  }

  isInWatchlist(movieId) {
    return this.watchlist.some(m => m.id === movieId || m.imdbID === movieId);
  }

  toggleWatchlist(movie) {
    const exists = this.isInWatchlist(movie.id || movie.imdbID);
    if (exists) {
      this.watchlist = this.watchlist.filter(m => m.id !== movie.id && m.imdbID !== movie.imdbID);
    } else {
      this.watchlist.unshift(movie);
    }
    this._save(CONFIG.STORAGE_KEYS.WATCHLIST, this.watchlist);
    return !exists;
  }

  removeFromWatchlist(movieId) {
    this.watchlist = this.watchlist.filter(m => m.id !== movieId && m.imdbID !== movieId);
    this._save(CONFIG.STORAGE_KEYS.WATCHLIST, this.watchlist);
  }

  // Progress (Continue Watching) Management
  getProgress(movieId) {
    return this.progress[movieId] || 0;
  }

  setProgress(movieId, percentage) {
    this.progress[movieId] = Math.min(100, Math.max(0, percentage));
    this._save(CONFIG.STORAGE_KEYS.PROGRESS, this.progress);
  }

  removeFromProgress(movieId) {
    delete this.progress[movieId];
    this._save(CONFIG.STORAGE_KEYS.PROGRESS, this.progress);
  }

  getContinueWatching() {
    const list = [];
    for (const [id, pct] of Object.entries(this.progress)) {
      if (pct > 0) {
        const found = this.history.find(m => m.id === id || m.imdbID === id) ||
                      this.watchlist.find(m => m.id === id || m.imdbID === id);
        if (found) {
          list.push({ ...found, watchProgress: pct });
        }
      }
    }
    return list;
  }

  // History (Recently Watched) Management
  getHistory() {
    return this.history;
  }

  addToHistory(movie) {
    this.history = this.history.filter(m => m.id !== movie.id && m.imdbID !== movie.imdbID);
    this.history.unshift(movie);
    if (this.history.length > 30) this.history.pop();
    this._save(CONFIG.STORAGE_KEYS.HISTORY, this.history);
  }

  removeFromHistory(movieId) {
    this.history = this.history.filter(m => m.id !== movieId && m.imdbID !== movieId);
    this._save(CONFIG.STORAGE_KEYS.HISTORY, this.history);
  }

  clearHistory() {
    this.history = [];
    this._save(CONFIG.STORAGE_KEYS.HISTORY, this.history);
  }

  // Likes Management
  getLiked() {
    return this.likes;
  }

  isLiked(movieId) {
    return this.likes.some(m => m.id === movieId || m.imdbID === movieId);
  }

  toggleLike(movie) {
    const exists = this.isLiked(movie.id || movie.imdbID);
    if (exists) {
      this.likes = this.likes.filter(m => m.id !== movie.id && m.imdbID !== movie.imdbID);
    } else {
      this.likes.unshift(movie);
    }
    this._save(CONFIG.STORAGE_KEYS.LIKES, this.likes);
    return !exists;
  }

  // Notification Management
  getNotifications() {
    return this.notifications;
  }

  markNotificationsRead() {
    this.notifications.forEach(n => n.read = true);
    this._notify();
  }

  // User Stats
  getStats() {
    const moviesWatched = this.history.length;
    const watchlistCount = this.watchlist.length;
    const totalHours = Math.round(moviesWatched * 2.2 + watchlistCount * 0.5);
    return {
      moviesWatched,
      watchlistCount,
      likedCount: this.likes.length,
      totalHours,
      rank: moviesWatched >= 5 ? 'Quantum Master' : (moviesWatched >= 1 ? 'Nexus Explorer' : 'Cinema Initiate')
    };
  }

  // Reset Storage
  resetStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
    }
    this.watchlist = [];
    this.history = [];
    this.progress = {};
    this.likes = [];
    this._notify();
  }
}

export const State = new StateManager();
