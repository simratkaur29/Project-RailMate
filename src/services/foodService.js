/**
 * Food Service — Isolates data access for the Station Bites feature.
 *
 * Currently backed by local demonstration data. This module can later
 * be replaced with real API calls without changing consumer components.
 *
 * NOTE: All data returned by this service is SAMPLE / DEMONSTRATION data.
 */

import restaurants from '../data/restaurants';
import foodStations from '../data/foodStations';
import { calculateDistance } from '../utils/calculateDistance';

/**
 * Returns all supported food stations.
 */
export function getAllStations() {
  return foodStations;
}

/**
 * Returns a station by its ID.
 */
export function getStationById(stationId) {
  return foodStations.find((s) => s.id === stationId) || null;
}

/**
 * Returns a restaurant by its ID.
 */
export function getRestaurantById(restaurantId) {
  return restaurants.find((r) => r.id === restaurantId) || null;
}

/**
 * Searches for restaurants near a given location within a radius.
 *
 * @param {number} lat - Latitude of the reference point
 * @param {number} lon - Longitude of the reference point
 * @param {number} radiusKm - Search radius in kilometers
 * @param {Object} filters - Optional filters { cuisine, vegetarian, search, priceRange }
 * @returns {Array} Restaurants with a `distance` field attached, sorted by distance.
 */
export function searchRestaurants(lat, lon, radiusKm = 2, filters = {}) {
  if (lat == null || lon == null) return [];

  let results = restaurants
    .map((restaurant) => {
      const distance = calculateDistance(lat, lon, restaurant.latitude, restaurant.longitude);
      return { ...restaurant, distance };
    })
    .filter((r) => r.distance !== null && r.distance <= radiusKm);

  // Apply filters
  if (filters.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(
      (r) =>
        r.name.toLowerCase().includes(term) ||
        r.cuisine.toLowerCase().includes(term) ||
        r.description.toLowerCase().includes(term)
    );
  }

  if (filters.cuisine && filters.cuisine !== 'all') {
    results = results.filter((r) => r.cuisine === filters.cuisine);
  }

  if (filters.vegetarian) {
    results = results.filter((r) => r.vegetarian);
  }

  if (filters.priceRange && filters.priceRange !== 'all') {
    switch (filters.priceRange) {
      case 'budget':
        results = results.filter((r) => r.avgPrice <= 100);
        break;
      case 'mid':
        results = results.filter((r) => r.avgPrice > 100 && r.avgPrice <= 200);
        break;
      case 'premium':
        results = results.filter((r) => r.avgPrice > 200);
        break;
    }
  }

  // Sort
  if (filters.sort) {
    switch (filters.sort) {
      case 'distance':
        results.sort((a, b) => a.distance - b.distance);
        break;
      case 'price-low':
        results.sort((a, b) => a.avgPrice - b.avgPrice);
        break;
      case 'price-high':
        results.sort((a, b) => b.avgPrice - a.avgPrice);
        break;
      default:
        results.sort((a, b) => a.distance - b.distance);
    }
  } else {
    results.sort((a, b) => a.distance - b.distance);
  }

  return results;
}

/**
 * Returns all unique cuisine types from the dataset.
 */
export function getAllCuisines() {
  const cuisines = new Set(restaurants.map((r) => r.cuisine));
  return Array.from(cuisines).sort();
}
