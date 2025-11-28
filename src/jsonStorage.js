// JSON Cloud Storage using JSONBin.io (Free service)
const JSONBIN_API_URL = 'https://api.jsonbin.io/v3';
const JSONBIN_API_KEY = '$2b$10$YourAPIKeyHere'; // We'll use public bins for now

// Generate or get bin ID for this session
export const getBinId = () => {
  let binId = localStorage.getItem('calculator_bin_id');

  if (!binId) {
    // Generate a unique session identifier
    binId = 'local_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    localStorage.setItem('calculator_bin_id', binId);
  }

  return binId;
};

// Get bin ID from URL
export const getBinIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('bin');
};

// Create a new JSON bin with history data
export const createBin = async (history) => {
  try {
    const response = await fetch(`${JSONBIN_API_URL}/b`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Bin-Private': 'false', // Public bin so anyone with link can access
      },
      body: JSON.stringify({
        history: history,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create bin');
    }

    const data = await response.json();
    const binId = data.metadata.id;

    // Save bin ID to localStorage
    localStorage.setItem('calculator_bin_id', binId);

    return binId;
  } catch (error) {
    console.error('Error creating bin:', error);
    return null;
  }
};

// Update existing bin with new history
export const updateBin = async (binId, history) => {
  try {
    const response = await fetch(`${JSONBIN_API_URL}/b/${binId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        history: history,
        lastUpdated: new Date().toISOString(),
        version: '1.0'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update bin');
    }

    return true;
  } catch (error) {
    console.error('Error updating bin:', error);
    return false;
  }
};

// Load history from bin
export const loadFromBin = async (binId) => {
  try {
    const response = await fetch(`${JSONBIN_API_URL}/b/${binId}/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to load bin');
    }

    const data = await response.json();
    return data.record.history || [];
  } catch (error) {
    console.error('Error loading from bin:', error);
    return [];
  }
};

// Track usage for today
export const trackUsage = () => {
  const today = new Date().toISOString().split('T')[0];
  const usageData = getUsageData();

  usageData[today] = (usageData[today] || 0) + 1;

  localStorage.setItem('calculator_usage', JSON.stringify(usageData));
  return usageData;
};

// Get usage data
export const getUsageData = () => {
  const data = localStorage.getItem('calculator_usage');
  return data ? JSON.parse(data) : {};
};

// Save history to cloud (create or update bin)
export const saveHistoryToCloud = async (history) => {
  // Always save to localStorage first
  localStorage.setItem('calculator_history', JSON.stringify(history));

  let binId = localStorage.getItem('calculator_bin_id');

  if (!binId) {
    // Create new bin
    binId = await createBin(history);
    return binId !== null;
  } else {
    // Update existing bin
    return await updateBin(binId, history);
  }
};

// Load history from cloud or localStorage
export const loadHistoryFromCloud = async (binId) => {
  // If bin ID is provided (from URL), load from that bin
  if (binId && binId.startsWith('b-')) {
    const cloudHistory = await loadFromBin(binId);
    if (cloudHistory.length > 0) {
      // Save to localStorage as well
      localStorage.setItem('calculator_history', JSON.stringify(cloudHistory));
      localStorage.setItem('calculator_bin_id', binId);
      return cloudHistory;
    }
  }

  // Otherwise, load from localStorage
  const localHistory = localStorage.getItem('calculator_history');
  return localHistory ? JSON.parse(localHistory) : [];
};

// Get shareable URL
export const getShareableUrl = () => {
  const binId = localStorage.getItem('calculator_bin_id');
  if (binId && binId.startsWith('b-')) {
    return `${window.location.origin}?bin=${binId}`;
  }
  return window.location.origin;
};

// Export history as JSON file
export const exportHistoryAsJson = (history) => {
  const dataStr = JSON.stringify({
    history: history,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }, null, 2);

  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `calculator-history-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import history from JSON file
export const importHistoryFromJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data.history || []);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
