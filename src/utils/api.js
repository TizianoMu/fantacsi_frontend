// This file contains utility functions for making API calls.

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

const fetchData = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const postData = async (endpoint, data) => {
  return await fetchData(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

const putData = async (endpoint, data) => {
  return await fetchData(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

const deleteData = async (endpoint) => {
  return await fetchData(endpoint, {
    method: 'DELETE',
  });
};

export { fetchData, postData, putData, deleteData };