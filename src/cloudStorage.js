import { database } from './firebase';
import { ref, set, get, onValue } from 'firebase/database';

// Generate or get session ID
export const getSessionId = () => {
  let sessionId = localStorage.getItem('calculator_session_id');

  if (!sessionId) {
    // Generate a unique session ID
    sessionId = generateUniqueId();
    localStorage.setItem('calculator_session_id', sessionId);
  }

  return sessionId;
};

// Generate unique ID
const generateUniqueId = () => {
  return 'calc_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
};

// Save history to cloud
export const saveHistoryToCloud = async (history, sessionId) => {
  if (!database) {
    console.warn('Firebase not initialized, saving to localStorage only');
    localStorage.setItem('calculator_history', JSON.stringify(history));
    return false;
  }

  try {
    const historyRef = ref(database, `history/${sessionId}`);
    await set(historyRef, {
      history: history,
      lastUpdated: new Date().toISOString()
    });

    // Also save to localStorage as backup
    localStorage.setItem('calculator_history', JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving to cloud:', error);
    // Fallback to localStorage
    localStorage.setItem('calculator_history', JSON.stringify(history));
    return false;
  }
};

// Load history from cloud
export const loadHistoryFromCloud = async (sessionId) => {
  if (!database) {
    console.warn('Firebase not initialized, loading from localStorage');
    const localHistory = localStorage.getItem('calculator_history');
    return localHistory ? JSON.parse(localHistory) : [];
  }

  try {
    const historyRef = ref(database, `history/${sessionId}`);
    const snapshot = await get(historyRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return data.history || [];
    } else {
      // Try localStorage as fallback
      const localHistory = localStorage.getItem('calculator_history');
      return localHistory ? JSON.parse(localHistory) : [];
    }
  } catch (error) {
    console.error('Error loading from cloud:', error);
    // Fallback to localStorage
    const localHistory = localStorage.getItem('calculator_history');
    return localHistory ? JSON.parse(localHistory) : [];
  }
};

// Listen for real-time updates
export const subscribeToHistory = (sessionId, callback) => {
  if (!database) {
    return () => {}; // Return empty unsubscribe function
  }

  try {
    const historyRef = ref(database, `history/${sessionId}`);
    return onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        callback(data.history || []);
      }
    });
  } catch (error) {
    console.error('Error subscribing to history:', error);
    return () => {};
  }
};

// Get shareable URL
export const getShareableUrl = (sessionId) => {
  return `${window.location.origin}?session=${sessionId}`;
};

// Get session ID from URL
export const getSessionIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('session');
};
