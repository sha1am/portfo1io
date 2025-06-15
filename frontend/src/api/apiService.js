// src/api/apiService.js

// Base URL for API requests, defaulting to localhost if the environment variable is not set
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Function to fetch data from a specific endpoint
export const fetchData = async (endpoint) => {
  try {
    // Construct the full URL for the API request
    const url = `${API_BASE_URL}/${endpoint}`;
    
    // Perform the fetch request
    const response = await fetch(url);
    
    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    // Parse the JSON data from the response
    const data = await response.json();
    
    // Return the parsed data
    return data;
  } catch (error) {
    // Handle any errors that occur during the fetch request
    console.error("Error fetching data:", error);
    throw error; // Optionally rethrow the error to be handled by the caller
  }
};

// Example of another API call function
export const postData = async (endpoint, payload) => {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};
