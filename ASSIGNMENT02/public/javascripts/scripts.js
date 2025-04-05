// This file contains JavaScript code for the main functionality of the application.
function confirmDelete() {
  return confirm("Are you sure you want to delete this item?");
}

// Global map and marker references for Add/Edit form
let map, marker;

// Utility function to initialize the map in the main form
function initMainMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return; // No map on this page

  map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map);
}

// Shared function to update the map based on city & country inputs
function updateMap() {
  // Check if map is initialized
  const city = document.getElementById("city")?.value;
  const country = document.getElementById("country")?.value;

  if (city && country && map) {
    const location = `${city}, ${country}`;
    // Clear previous marker if it exists
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`
    )
      //
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);

          map.setView([lat, lon], 10);

          if (marker) {
            marker.setLatLng([lat, lon]);
          } else {
            marker = L.marker([lat, lon]).addTo(map);
          }
        }
      })
      .catch((err) => console.error("Map update failed:", err));
  }
}

// Modal Map Logic (Keep separate, it’s context-specific)
let modalMap, modalMarker;
// This function initializes the map in the modal when it is shown
// It uses the Leaflet library to create a map and display a marker based on the city and country passed from the button that triggered the modal.
document
  .getElementById("mapModal")
  ?.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const city = button.getAttribute("data-city");
    const country = button.getAttribute("data-country");
    const location = `${city}, ${country}`;
    const modalBody = document.querySelector("#mapModal .modal-body");

    modalBody.innerHTML = `<div id="modalMap" style="height: 400px;"></div>`;

    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length === 0) {
          modalBody.innerHTML = `
          <div class="alert alert-warning">
            <strong>Location not found:</strong> "${location}" could not be located. Please check the city and country.
          </div>
        `;
          return;
        }
        // Clear previous map if it exists
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        modalMap = L.map("modalMap").setView([lat, lon], 10);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        }).addTo(modalMap);

        modalMarker = L.marker([lat, lon]).addTo(modalMap);

        setTimeout(() => {
          modalMap.invalidateSize();
        }, 200);
      })
      // Handle errors in geocoding
      // If the geocoding fails, we show an error message in the modal body.
      .catch((err) => {
        console.error("Geocoding error:", err);
        modalBody.innerHTML = `
        <div class="alert alert-danger">
          Could not load map due to an error.
        </div>
      `;
      });
  });

// DOM Load: only trigger if map exists (Add or Edit page)
document.addEventListener("DOMContentLoaded", () => {
  initMainMap();
  updateMap(); // initial load if values are already there

  document.getElementById("city")?.addEventListener("blur", updateMap);
  document.getElementById("country")?.addEventListener("blur", updateMap);
});
