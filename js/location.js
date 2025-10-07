let map;
let userMarker;
let surauMarker;
let radiusCircle;
let currentSurauLocation = { lat: 3.058514, lng: 101.498851, name: 'Surau Shah Alam' };
const RADIUS = 50; // meters

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // radius bumi (meter)
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2)**2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // hasil dalam meter
}

function initMap() {
  // Initialize map centered on surau location
  map = L.map('map').setView([currentSurauLocation.lat, currentSurauLocation.lng], 16);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // Add surau marker
  const surauIcon = L.divIcon({
    html: '<div style="font-size: 32px;">🕌</div>',
    className: 'custom-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  surauMarker = L.marker([currentSurauLocation.lat, currentSurauLocation.lng], {
    icon: surauIcon
  }).addTo(map).bindPopup(`<b>${currentSurauLocation.name}</b>`);

  // Add radius circle
  radiusCircle = L.circle([currentSurauLocation.lat, currentSurauLocation.lng], {
    color: '#667eea',
    fillColor: '#667eea',
    fillOpacity: 0.2,
    radius: RADIUS
  }).addTo(map);

  // Get user location
  getUserLocation();
}

function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        const accuracy = position.coords.accuracy;

        // Update accuracy display
        document.getElementById('accuracy-value').textContent = `±${Math.round(accuracy)}m`;

        // Remove old user marker if exists
        if (userMarker) {
          map.removeLayer(userMarker);
        }

        // Add user marker
        const userIcon = L.divIcon({
          html: '<div style="font-size: 32px;">📍</div>',
          className: 'custom-icon',
          iconSize: [40, 40],
          iconAnchor: [20, 40]
        });

        userMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon
        }).addTo(map).bindPopup('<b>Lokasi Anda</b>');

        // Calculate distance
        const distance = haversine(
          userLocation.lat, userLocation.lng,
          currentSurauLocation.lat, currentSurauLocation.lng
        );

        // Update distance display
        document.getElementById('distance-value').textContent = distance.toFixed(1);

        // Update status
        const statusEl = document.getElementById('status');
        if (distance <= RADIUS) {
          statusEl.innerHTML = `✅ Anda berada di kawasan ${currentSurauLocation.name} (${distance.toFixed(1)} m)`;
          statusEl.className = 'status-inside';
        } else {
          statusEl.innerHTML = `❌ Anda di luar kawasan ${currentSurauLocation.name} (${distance.toFixed(1)} m)`;
          statusEl.className = 'status-outside';
        }

        // Fit map to show both markers
        const bounds = L.latLngBounds([
          [userLocation.lat, userLocation.lng],
          [currentSurauLocation.lat, currentSurauLocation.lng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });
      },
      (error) => {
        showError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  } else {
    showError({ message: 'Peranti anda tidak menyokong GPS.' });
  }
}

function showError(error) {
  const errorContainer = document.getElementById('error-container');
  let errorMessage = '';

  switch(error.code) {
    case error.PERMISSION_DENIED:
      errorMessage = '❌ Akses lokasi ditolak. Sila benarkan akses lokasi untuk menggunakan ciri ini.';
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage = '❌ Maklumat lokasi tidak tersedia.';
      break;
    case error.TIMEOUT:
      errorMessage = '❌ Masa tamat untuk mendapatkan lokasi.';
      break;
    default:
      errorMessage = `❌ ${error.message}`;
  }

  errorContainer.innerHTML = `<div class="error-message">${errorMessage}</div>`;
  
  const statusEl = document.getElementById('status');
  statusEl.innerHTML = '⚠️ Gagal mendapatkan lokasi';
  statusEl.className = 'status-outside';
}

function refreshLocation() {
  document.getElementById('status').innerHTML = '🔄 Mengesan semula lokasi...';
  document.getElementById('status').className = 'status-loading';
  document.getElementById('error-container').innerHTML = '';
  getUserLocation();
}

function changeSurauLocation(lat, lng, name) {
  currentSurauLocation = { lat, lng, name };

  // Update active state
  document.querySelectorAll('.location-item').forEach(item => {
    item.classList.remove('active');
  });
  event.currentTarget.classList.add('active');

  // Update map
  map.setView([lat, lng], 16);
  surauMarker.setLatLng([lat, lng]);
  surauMarker.setPopupContent(`<b>${name}</b>`);
  radiusCircle.setLatLng([lat, lng]);

  // Refresh location check
  refreshLocation();
}

// Initialize map when page loads
window.addEventListener('DOMContentLoaded', initMap);