import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const JobMap = ({ location }) => {
  useEffect(() => {
    // Vérifie si les coordonnées de localisation sont valides
    if (location && location.lat && location.lng) {
      // Initialise la carte et définit la vue
      const map = L.map('job-map').setView([location.lat, location.lng], 13);

      // Ajoute une couche de tuiles OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Définit l'icône du marqueur
      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png', // Correct URL for the marker icon
        shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png', // Correct URL for the shadow icon
        iconSize: [25, 41], // Size of the icon
        iconAnchor: [12, 41], // Anchor point for the icon
      });

      L.marker.prototype.options.icon = defaultIcon;

      // Ajoute un marqueur à la position de localisation
      const marker = L.marker([location.lat, location.lng], { icon: defaultIcon }).addTo(map)
        .bindPopup(`${location.lat}, ${location.lng}`) // Utilisation des coordonnées dans le popup
        .openPopup();

      // Nettoie la carte lorsque le composant est démonté ou si l'emplacement change
      return () => {
        map.remove();
      };
    }
  }, [location]);

  return <div id="job-map" style={{ height: '300px', width: '100%' }}></div>;
};

export default JobMap;