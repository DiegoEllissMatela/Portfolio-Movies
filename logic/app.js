// ==========================================
// CineFlow Main Application Entry (Production)
// ==========================================
import { Router } from './router.js';
import { SearchBar } from './components/searchBar.js';
import { VideoModal } from './components/modal.js';
import { Toast } from './components/toast.js';
import { NotificationCenter } from './components/notifications.js';
import { ProfileModal } from './components/profileModal.js';

document.addEventListener('DOMContentLoaded', () => {
  const viewContainer = document.getElementById('app-view');
  if (!viewContainer) return;

  // Initialize Global Modals & Toasts
  VideoModal.init();
  Toast.init();
  NotificationCenter.init();
  ProfileModal.init();

  // Initialize Router
  const router = new Router(viewContainer);
  router.init();

  // Initialize Topbar Search
  const topbarSearchEl = document.getElementById('topbar-search');
  if (topbarSearchEl) {
    new SearchBar(topbarSearchEl, (movieId) => {
      window.location.hash = `#film/${movieId}`;
    });
  }

  // Topbar scroll effect
  const topbar = document.querySelector('.c-topbar');
  if (topbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        topbar.classList.add('c-topbar--scrolled');
      } else {
        topbar.classList.remove('c-topbar--scrolled');
      }
    });
  }

  // Notification Button
  const notifBtn = document.getElementById('topbar-notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      NotificationCenter.open();
    });
  }

  // Account Profile Button
  const accountBtn = document.getElementById('topbar-account-btn');
  if (accountBtn) {
    accountBtn.addEventListener('click', () => {
      ProfileModal.open();
    });
  }

  // Mobile Hamburger Menu Logic
  const mobileHamburgerBtn = document.getElementById('mobile-hamburger-btn');
  const mobileHeaderModal = document.getElementById('mobile-header-modal');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  
  if (mobileHamburgerBtn && mobileHeaderModal && mobileCloseBtn) {
    mobileHamburgerBtn.addEventListener('click', () => {
      mobileHeaderModal.style.display = 'flex';
    });
    
    mobileCloseBtn.addEventListener('click', () => {
      mobileHeaderModal.style.display = 'none';
    });
    
    // Close modal when a nav link is clicked
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileHeaderModal.style.display = 'none';
      });
    });

    // Wire up mobile modal action buttons
    document.getElementById('mobile-notif-btn')?.addEventListener('click', () => {
      mobileHeaderModal.style.display = 'none';
      NotificationCenter.open();
    });
    document.getElementById('mobile-account-btn')?.addEventListener('click', () => {
      mobileHeaderModal.style.display = 'none';
      ProfileModal.open();
    });
  }

  console.log('⚡ DNM Movies Production Cinematic Nexus initialized successfully.');
});
