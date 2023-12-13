

    // Pobierz referencję do kolekcji "Wspolrzedne" w Firestore
    const wspolrzedneCollection = firebase.firestore().collection("Wspolrzedne");

    // Utwórz mapę Leaflet
    const map = L.map('map', {
        scrollWheelZoom: false // Zablokuj scrollowanie przy użyciu kółka myszki
    }).setView([50.12457054695064, 21.753937868339456], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Tablica do przechowywania wszystkich markerów
    const markers = [];

    // Pobierz dane z Firebase Firestore i zaznacz na mapie
    wspolrzedneCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
            const data = doc.data();
            const lat = data.lat;
            const lng = data.lng;
            const nazwaSklepu = data.nazwa_sklepu;
            const cena = data.cena;

            // Dodaj marker do mapy
            const marker = L.marker([lat, lng]);
            marker.bindPopup(`<b>${nazwaSklepu}</b><br>Cena: ${cena}`).openPopup();
            markers.push(marker);
        });

        // Dodaj wszystkie markery na raz do mapy
        const markerGroup = L.layerGroup(markers);
        markerGroup.addTo(map);
    }).catch(error => {
        console.error("Błąd pobierania danych z Firebase: ", error);
    });

    // Funkcja do filtrowania markerów na mapie
    function filterMarkers() {
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;

        // Filtruj markery według ceny
        const filteredMarkers = markers.filter(marker => {
            const cenaMarker = parseFloat(marker.getPopup().getContent().split('Cena: ')[1]);
            return (isNaN(minPrice) || cenaMarker >= parseFloat(minPrice)) &&
                   (isNaN(maxPrice) || cenaMarker <= parseFloat(maxPrice));
        });

        // Usuń wszystkie markery z mapy
        markers.forEach(marker => map.removeLayer(marker));

        // Dodaj tylko przefiltrowane markery
        const filteredMarkerGroup = L.layerGroup(filteredMarkers);
        filteredMarkerGroup.addTo(map);
    }

