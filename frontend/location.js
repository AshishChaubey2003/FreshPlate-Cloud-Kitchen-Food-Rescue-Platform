// Location and Map functionality
let map;
let markers = [];
let currentView = "kitchen";

// Location data
const locations = {
  kitchen: {
    lat: 28.5355,
    lng: 77.391,
    title: "FreshPlate Cloud Kitchen",
    address: "Sector 19, Noida, Uttar Pradesh 201301",
    type: "kitchen",
  },
  delivery: [
    { lat: 28.5692, lng: 77.3211, title: "Sector 18", type: "delivery" },
    { lat: 28.5355, lng: 77.391, title: "Sector 19", type: "delivery" },
    { lat: 28.6, lng: 77.365, title: "Sector 20", type: "delivery" },
    { lat: 28.6275, lng: 77.3765, title: "Sector 62", type: "delivery" },
    { lat: 28.632, lng: 77.38, title: "Sector 63", type: "delivery" },
  ],
  rescue: [
    {
      lat: 28.58,
      lng: 77.325,
      title: "Noida Food Bank",
      address: "Sector 12, Noida",
      phone: "+91 9876543210",
      type: "rescue",
    },
    {
      lat: 28.52,
      lng: 77.4,
      title: "Community Shelter",
      address: "Sector 22, Noida",
      phone: "+91 9876543211",
      type: "rescue",
    },
  ],
};

// Initialize map
function initMap() {
  map = L.map("map").setView([28.5355, 77.391], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Show kitchen location by default
  showKitchenLocation();
}

// Show cloud kitchen location
function showKitchenLocation() {
  clearMarkers();
  updateActiveButton("kitchen");
  currentView = "kitchen";

  const kitchen = locations.kitchen;
  const marker = L.marker([kitchen.lat, kitchen.lng]).addTo(map).bindPopup(`
            <div class="map-popup">
                <h3>${kitchen.title}</h3>
                <p>${kitchen.address}</p>
                <p><strong>🕒 Open:</strong> 10:00 AM - 11:00 PM</p>
            </div>
        `);

  markers.push(marker);
  map.setView([kitchen.lat, kitchen.lng], 14);
}

// Show delivery areas
function showDeliveryAreas() {
  clearMarkers();
  updateActiveButton("delivery");
  currentView = "delivery";

  locations.delivery.forEach((location) => {
    const marker = L.marker([location.lat, location.lng]).addTo(map).bindPopup(`
                <div class="map-popup">
                    <h3>${location.title}</h3>
                    <p>✅ Delivery Available</p>
                    <p><strong>🚚 Time:</strong> 30-45 minutes</p>
                </div>
            `);

    markers.push(marker);
  });

  // Fit map to show all delivery areas
  const group = new L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.1));
}

// Show rescue centers
function showRescueCenters() {
  clearMarkers();
  updateActiveButton("rescue");
  currentView = "rescue";

  locations.rescue.forEach((location) => {
    const marker = L.marker([location.lat, location.lng]).addTo(map).bindPopup(`
                <div class="map-popup">
                    <h3>${location.title}</h3>
                    <p>📍 ${location.address}</p>
                    <p>📞 ${location.phone}</p>
                    <p><strong>Food Donation Center</strong></p>
                </div>
            `);

    markers.push(marker);
  });

  // Fit map to show all rescue centers
  const group = new L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.1));
}

// Clear all markers
function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

// Update active button state
function updateActiveButton(view) {
  document.querySelectorAll(".map-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document
    .querySelector(
      `.map-btn:nth-child(${
        view === "kitchen" ? 1 : view === "delivery" ? 2 : 3
      })`
    )
    .classList.add("active");
}

// Show specific location on map
function showOnMap(type) {
  if (type === "kitchen") {
    showKitchenLocation();
  } else if (type === "rescue") {
    showRescueCenters();
  }
}

// Get user location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        L.marker([userLat, userLng])
          .addTo(map)
          .bindPopup("Your Location")
          .openPopup();

        map.setView([userLat, userLng], 13);
      },
      (error) => {
        console.log("Error getting location:", error);
        alert("Unable to get your location. Please enable location services.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  initMap();
});
