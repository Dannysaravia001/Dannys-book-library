// Import the jwt-decode library to decode JWT tokens
import decode from 'jwt-decode';

// Create a class to handle authentication-related operations
class AuthService {
  // Retrieve user information from the token
  getProfile() {
    return decode(this.getToken());
  }

  // Check if the user is currently logged in
  loggedIn() {
    // Check if a token is present and it's not expired
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if the token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      // Compare the expiration time to the current time
      if (decoded.exp < Date.now() / 1000) {
        return true; // Token is expired
      } else {
        return false; // Token is still valid
      }
    } catch (err) {
      return false; // Failed to decode the token
    }
  }

  // Retrieve the token from localStorage
  getToken() {
    return localStorage.getItem('id_token');
  }

  // Save the token to localStorage and redirect to the homepage
  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  // Remove the token from localStorage and redirect to the homepage
  logout() {
    localStorage.removeItem('id_token');
    // Reload the page to reset the application state
    window.location.assign('/');
  }
}

// Export an instance of the AuthService class
export default new AuthService();