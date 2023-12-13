// Funkcja do pobierania listy produktów i aktualizowania rozwijanej listy w formularzu
function loadProducts() {
    const produktSelect = document.getElementById('produkt');
    const dostepnaIloscSpan = document.getElementById('dostepnaIlosc');

    // Wyczyść istniejące opcje przed dodaniem nowych
    produktSelect.innerHTML = '';

    // Deklaruj productsRef tutaj
    const productsRef = db.collection('produkty');

    // Pobierz dane produktów z Firestore
    productsRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const productData = doc.data();
                const option = document.createElement('option');
                option.value = doc.id; // Ustaw wartość opcji na ID produktu
                option.text = productData.nazwa; // Ustaw tekst opcji na nazwę produktu
                produktSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error loading products: ', error);
        });

    // Dodaj nasłuchiwanie na zmiany w wybranym produkcie
    produktSelect.addEventListener('change', function () {
        const selectedProductId = produktSelect.value;

        // Pobierz dane produktu z Firestore
        productsRef.doc(selectedProductId).get()
            .then((doc) => {
                const productData = doc.data();
                const dostepnaIlosc = productData.dostepna_ilosc || 0;

                // Uaktualnij widoczny tekst dostępnej ilości obok pola ilości
                dostepnaIloscSpan.textContent = dostepnaIlosc;

                // Ustaw maksymalną ilość w polu ilości na dostępną ilość
                document.getElementById('ilosc').max = dostepnaIlosc;
            })
            .catch((error) => {
                console.error('Error loading product details: ', error);
            });
    });
}

// Wywołaj funkcję załadowania produktów przy starcie aplikacji
loadProducts();


// Funkcja do wyświetlania danych użytkownika
function showUserData(uid) {
    const userDataList = document.getElementById('userDataList');

    // Wyczyść istniejące dane przed ponownym wyświetleniem
    userDataList.innerHTML = '';

    // Pobierz dane z Firestore dla danego użytkownika
    db.collection('users').doc(uid).collection('formData').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const formData = doc.data();
                const listItem = document.createElement('li');

                // Dodaj wyświetlanie daty
                const date = formData.data ? formData.data.toDate().toLocaleString() : 'Brak daty';

                listItem.innerHTML = `
                    <strong>Imię:</strong> ${formData.imie}<br>
                    <strong>Email:</strong> ${formData.email}<br>
                    <strong>Nr. telefonu:</strong> ${formData.telefon}<br>
                    <strong>Nazwa produktu:</strong> ${formData.produkt}<br>
                    <strong>Ilość produktu:</strong> ${formData.ilosc}<br>
                    <strong>Data:</strong> ${date}<br>
                    <hr>
                `;
                userDataList.appendChild(listItem);
            });
        })
        .catch((error) => {
            alert(error.message);
        });
}

// Sprawdź, czy użytkownik jest zalogowany
auth.onAuthStateChanged((user) => {
    if (user) {
        // Użytkownik jest zalogowany, pobierz i wyświetl jego dane
        showUserData(user.uid);

// Dodaj nasłuchiwanie na zdarzenie submit formularza
const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const imie = document.getElementById('imie').value;
    const email = document.getElementById('email').value;
    const telefon = document.getElementById('telefon').value;
    const produktId = document.getElementById('produkt').value; // Pobierz ID wybranego produktu
    const ilosc = document.getElementById('ilosc').value;

    // Pobierz dostępną ilość
    const dostepnaIlosc = parseInt(document.getElementById('dostepnaIlosc').textContent, 10);

    // Sprawdź, czy ilość nie przekracza dostępnej ilości
    if (parseInt(ilosc, 10) > dostepnaIlosc) {
        alert('Ilość nie może przekroczyć dostępnej ilości produktu.');
        return;
    }

    // Pobierz UID aktualnie zalogowanego użytkownika
    const uid = auth.currentUser.uid;

    // Pobierz bieżącą datę
    const currentDate = new Date();

    // Zapisz dane w Firestore z dodaną datą
    db.collection('users').doc(uid).collection('formData').add({
        imie: imie,
        email: email,
        telefon: telefon,
        produkt: produktId, // Użyj pola 'produkt' zamiast 'produktId'
        ilosc: ilosc,
        data: currentDate // Dodaj pole data
    })
        .then(() => {
            // Po zapisaniu danych odśwież widok
            showUserData(uid);

            // Opcjonalnie: Zresetuj formularz po zapisie danych
            form.reset();
        })
        .catch((error) => {
            alert(error.message);
        });
});
    } else {
        // Użytkownik nie jest zalogowany, przekieruj na stronę logowania
        window.location.href = 'login.html';
    }
});