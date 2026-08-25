// ==========================================
// CineFlow Router Service (Paginated & Query-Aware)
// ==========================================
import { renderHomeView } from './views/homeView.js';
import { renderDiscoveryView } from './views/discoveryView.js';
import { renderLibraryView } from './views/libraryView.js';
import { renderFilmView } from './views/filmView.js';

export class Router {
  constructor(viewContainer) {
    this.viewContainer = viewContainer;
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  parseHash() {
    const rawHash = window.location.hash || '#home';
    const [routePart, queryPart] = rawHash.split('?');
    const params = new URLSearchParams(queryPart || '');
    return {
      route: routePart,
      params,
      rawHash
    };
  }

  handleRoute() {
    const { route, params } = this.parseHash();

    // Update active nav links across topbar, sidebar, and mobile nav
    this.updateActiveNavLinks(route);

    // Film Detail Route
    if (route.startsWith('#film/')) {
      const movieId = route.replace('#film/', '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderFilmView(this.viewContainer, movieId);
      return;
    }

    // Discovery Route with optional genre & page params
    if (route === '#discovery') {
      const genre = params.get('genre') || 'all';
      const page = parseInt(params.get('page'), 10) || 1;
      renderDiscoveryView(this.viewContainer, genre, page);
      return;
    }

    // Library Route
    if (route === '#library') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderLibraryView(this.viewContainer);
      return;
    }

    // Default: Home Route
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderHomeView(this.viewContainer);
  }

  updateActiveNavLinks(route) {
    const baseRoute = route.startsWith('#film/') ? '#home' : route;

    // Topbar
    document.querySelectorAll('.c-topbar__link').forEach(link => {
      if (link.getAttribute('href') === baseRoute) {
        link.classList.add('c-topbar__link--active');
      } else {
        link.classList.remove('c-topbar__link--active');
      }
    });

    // Sidebar
    document.querySelectorAll('.c-sidebar__item').forEach(item => {
      if (item.getAttribute('href') === baseRoute) {
        item.classList.add('c-sidebar__item--active');
      } else {
        item.classList.remove('c-sidebar__item--active');
      }
    });

    // Mobile nav
    document.querySelectorAll('.c-mobile-nav__item').forEach(item => {
      if (item.getAttribute('href') === baseRoute) {
        item.classList.add('c-mobile-nav__item--active');
      } else {
        item.classList.remove('c-mobile-nav__item--active');
      }
    });
  }
}
