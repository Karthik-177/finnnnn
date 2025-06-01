/**
 * ProfileManager - Handles user profile UI interactions and state
 */
class ProfileManager {
  constructor() {
    // UI Elements
    this.profileButton = document.getElementById('profileButton');
    this.profileDropdown = document.getElementById('profileDropdown');
    this.userInitial = document.getElementById('userInitial');
    this.userName = document.getElementById('userName');
    this.profileEmail = document.getElementById('profileEmail');
    this.logoutButton = document.getElementById('logoutButton');

    // Bind event handlers
    this.handleProfileClick = this.handleProfileClick.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleLogout = this.handleLogout.bind(this);

    this.init();
  }

  init() {
    // Initialize event listeners
    this.profileButton.addEventListener('click', this.handleProfileClick);
    document.addEventListener('click', this.handleClickOutside);
    this.logoutButton.addEventListener('click', this.handleLogout);

    // Load user data
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        this.redirectToLogin();
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      this.updateUserInterface(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
      this.redirectToLogin();
    }
  }

  updateUserInterface(userData) {
    // Update user initial
    const initial = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
    this.userInitial.textContent = initial;

    // Update username
    this.userName.textContent = userData.name || 'User';

    // Update email in dropdown
    this.profileEmail.textContent = userData.email || '';
  }

  handleProfileClick(event) {
    event.stopPropagation();
    const isExpanded = this.profileButton.getAttribute('aria-expanded') === 'true';
    this.toggleDropdown(!isExpanded);
  }

  handleClickOutside(event) {
    if (!this.profileButton.contains(event.target)) {
      this.toggleDropdown(false);
    }
  }

  toggleDropdown(show) {
    this.profileDropdown.classList.toggle('hidden', !show);
    this.profileButton.setAttribute('aria-expanded', show);
  }

  async handleLogout() {
    try {
      // Clear local storage
      localStorage.removeItem('token');
      
      // Redirect to login page
      this.redirectToLogin();
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect to login page even if there's an error
      this.redirectToLogin();
    }
  }

  redirectToLogin() {
    window.location.href = '/login.html';
  }
}

// Initialize the profile manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProfileManager();
}); 