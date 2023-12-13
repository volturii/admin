// script2.js

document.addEventListener('DOMContentLoaded', function () {
    // Obsługa formularza
    var form = document.querySelector('form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Pobierz dane formularza
        var imie = document.getElementById('imie').value;
        var email = document.getElementById('email').value;
        var telefon = document.getElementById('telefon').value;
        var produkt = document.getElementById('produkt').value;
        var ilosc = document.getElementById('ilosc').value;

        // Sprawdź, czy użytkownik jest zalogowany
        var user = auth.currentUser;
        if (user) {
            // Utwórz obiekt z danymi formularza
            var formData = {
                imie: imie,
                email: email,
                telefon: telefon,
                produkt: produkt,
                ilosc: ilosc,
                userId: user.uid, // Dodaj identyfikator użytkownika
                timestamp: firebase.firestore.FieldValue.serverTimestamp() // Dodaj znacznik czasu
            };

            // Dodaj dane formularza do Firestore
            db.collection('zamowienia').add(formData)
                .then(function (docRef) {
                    console.log('Dane formularza dodane z ID: ', docRef.id);
                    // Dodaj kod obsługujący przekierowanie lub wyświetlanie komunikatu po wysłaniu formularza
                })
                .catch(function (error) {
                    console.error('Błąd podczas dodawania danych formularza: ', error);
                    // Dodaj kod obsługujący błędy
                });
        } else {
            console.log('Użytkownik nie jest zalogowany');
            // Dodaj kod obsługujący, gdy użytkownik nie jest zalogowany
        }
    });
});
