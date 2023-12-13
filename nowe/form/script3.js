document.addEventListener('DOMContentLoaded', function () {
    // Pobierz aktualnego użytkownika
    var user = auth.currentUser;

    // Sprawdź, czy użytkownik jest zalogowany
    if (user) {
        // Pobierz dane formularza dla danego użytkownika
        db.collection('zamowienia').where('userId', '==', user.uid)
            .get()
            .then(function (querySnapshot) {
                // Znajdź kontener HTML, gdzie chcesz wyświetlić dane
                var ordersContainer = document.getElementById('orders-container');

                querySnapshot.forEach(function (doc) {
                    // Stwórz elementy HTML do wyświetlenia danych formularza
                    var orderDiv = document.createElement('div');
                    orderDiv.classList.add('order');

                    var productPara = document.createElement('p');
                    productPara.textContent = 'Produkt: ' + doc.data().produkt;

                    var datePara = document.createElement('p');
                    datePara.textContent = 'Data: ' + doc.data().timestamp.toDate();

                    var quantityPara = document.createElement('p');
                    quantityPara.textContent = 'Ilość: ' + doc.data().ilosc;

                    var phonePara = document.createElement('p');
                    phonePara.textContent = 'Telefon: ' + doc.data().telefon;

                    // Dodaj elementy do kontenera
                    orderDiv.appendChild(productPara);
                    orderDiv.appendChild(datePara);
                    orderDiv.appendChild(quantityPara);
                    orderDiv.appendChild(phonePara);

                    ordersContainer.appendChild(orderDiv);

                    console.log('-----');
                });
            })
            .catch(function (error) {
                console.error('Błąd podczas pobierania danych formularza: ', error);
                // Dodaj kod obsługujący błędy
            });
    } else {
        console.log('Użytkownik nie jest zalogowany');
        // Dodaj kod obsługujący, gdy użytkownik nie jest zalogowany
    }
});
