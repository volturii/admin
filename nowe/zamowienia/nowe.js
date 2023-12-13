// Funkcja do pobierania listy produktów i aktualizowania rozwijanej listy w formularzu
function loadProducts() {
    const produktyContainer = document.getElementById('produktyContainer');

    // Sprawdź, czy element został znaleziony
    if (!produktyContainer) {
        console.error('Nie można znaleźć elementu "produktyContainer" na stronie.');
        return;
    }

    // Wyczyść istniejące opcje przed dodaniem nowych
    produktyContainer.innerHTML = '';

    // Dodaj pierwsze pole produktu
    addProductRow();
}

// Dodaj nowe pole produktu do formularza
function addProductRow() {
    const produktyContainer = document.getElementById('produktyContainer');

    if (!produktyContainer) {
        console.error('Nie można znaleźć elementu "produktyContainer" na stronie.');
        return;
    }

    const produktRow = document.createElement('div');
    produktRow.classList.add('produkt-row');

    produktRow.innerHTML = `
        <label for="produkt">Wybierz produkt:</label>
        <select class="produkt" name="produkt" required></select>
        <label for="ilosc">Ilość produktu (Dostępne: <span class="dostepnaIlosc">0</span>):</label>
        <input type="number" class="ilosc" name="ilosc" required>
    `;

    produktyContainer.appendChild(produktRow);

    const produktySelect = produktRow.querySelector('.produkt');
    const dostepnaIloscSpan = produktRow.querySelector('.dostepnaIlosc');
    const productsRef = db.collection('produkty');

    productsRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const productData = doc.data();
                const option = document.createElement('option');
                option.value = doc.id;
                option.text = productData.nazwa;
                produktySelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error loading products: ', error);
        });

    produktySelect.addEventListener('change', function () {
        const selectedProductId = produktySelect.value;

        productsRef.doc(selectedProductId).get()
            .then((doc) => {
                const productData = doc.data();
                const dostepnaIlosc = productData.dostepna_ilosc || 0;

                dostepnaIloscSpan.textContent = dostepnaIlosc;
            })
            .catch((error) => {
                console.error('Error loading product details: ', error);
            });
    });
}

// Wywołaj funkcję załadowania produktów przy starcie aplikacji
loadProducts();

// Sprawdź, czy użytkownik jest zalogowany
auth.onAuthStateChanged((user) => {
    if (user) {
        // Użytkownik jest zalogowany, pobierz i wyświetl jego dane

  // Dodaj nasłuchiwanie na zdarzenie submit formularza
const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const imie = document.getElementById('imie').value;
    const email = document.getElementById('email').value;
    const telefon = document.getElementById('telefon').value;

    const produkty = document.querySelectorAll('.produkt-row');
    const zamowienie = [];

produkty.forEach((produkt) => {
    const produktSelect = produkt.querySelector('.produkt');
    const iloscInput = produkt.querySelector('.ilosc');

    const produktId = produktSelect.value;
    const ilosc = iloscInput.value;

    // Pobierz pełne informacje o produkcie na podstawie produktId
    const selectedProduct = Array.from(produktSelect.options).find(option => option.value === produktId);
    const produktNazwa = selectedProduct ? selectedProduct.text : 'Nieznany produkt';

    zamowienie.push({
        produkt: produktNazwa,
        ilosc: ilosc,
    });
});

            console.log(zamowienie);

            // Pobierz UID aktualnie zalogowanego użytkownika
            const uid = auth.currentUser.uid;

            // Pobierz bieżącą datę
            const currentDate = new Date();
            
            // Dodaj pole opis
            const opis = 'Wysłano';

 // Zapisz dane w Firestore z dodaną datą
    db.collection('users').doc(uid).collection('formData').add({
        imie: imie,
        email: email,
        telefon: telefon,
        zamowienie: zamowienie,
        data: currentDate,
        opis: opis
    })
    .then(() => {
        console.log('Dane zapisane poprawnie');
        form.reset();
    })
    .catch((error) => {
        console.error('Błąd podczas zapisywania danych: ', error);
        alert(error.message);
    });

    console.log('Po zapisie do Firestore');
});
    } else {
        // Użytkownik nie jest zalogowany, przekieruj na stronę logowania
        window.location.href = '../logowanie-rejestracja/logowanie.html';
    }
});
