const db = firebase.firestore();
const usersRef = db.collection('users');
const productsRef = db.collection('produkty');

const productSelect = document.getElementById('product');
const produktyContainer = document.getElementById('produktyContainer');

// Funkcja do ładowania opcji do pola rozwijanego z kolekcji "produkty"
function loadProductOptions() {
    productsRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((productDoc) => {
                const productName = productDoc.data().nazwa;
                const option = document.createElement('option');
                option.value = productName;
                option.text = productName;
                productSelect.appendChild(option);
            });
        })
        .catch((error) => {
            console.error('Error loading product options: ', error);
        });
}

// Funkcja do dodawania nowego pola produktu do formularza
function addProductRow() {
    const produktyContainer = document.getElementById('produktyContainer');

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

// Funkcja do usuwania ostatniego pola produktu z formularza
function removeProductRow() {
    const produktyContainer = document.getElementById('produktyContainer');

    if (produktyContainer.children.length > 0) {
        produktyContainer.removeChild(produktyContainer.lastChild);
    }
}

// Funkcja do dodawania danych do bazy
function addData() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    if (!name || !email || !phone) {
        alert('Wszystkie pola formularza są wymagane.');
        return;
    }

    const produktyRows = document.querySelectorAll('.produkt-row');
    const zamowienie = [];

    produktyRows.forEach((produktRow) => {
        const produktSelect = produktRow.querySelector('.produkt');
        const iloscInput = produktRow.querySelector('.ilosc');

        const produktId = produktSelect.value;
        const ilosc = iloscInput.value;

        const selectedProduct = Array.from(produktSelect.options).find(option => option.value === produktId);
        const produktNazwa = selectedProduct ? selectedProduct.text : 'Nieznany produkt';

        zamowienie.push({
            produkt: produktNazwa,
            ilosc: ilosc,
        });
    });

    const formData = {
        imie: name,
        email: email,
        telefon: phone,
        zamowienie: zamowienie,
        data: new Date(),
    };

    const userId = "DkQXcCZgwkOkmQtGgKl4uFBlMxo2";

    usersRef.doc(userId).collection('formData').add(formData)
        .then(() => {
            console.log('Dane zostały pomyślnie dodane do bazy danych.');
            clearForm();
        })
        .catch((error) => {
            console.error('Błąd podczas dodawania danych: ', error);
            alert(error.message);
        });
}

// Funkcja do czyszczenia formularza
function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';

    // Usuń dodane pola produktów
    while (produktyContainer.firstChild) {
        produktyContainer.removeChild(produktyContainer.firstChild);
    }
}


// Wywołaj funkcję ładowania opcji produktów przy starcie aplikacji
loadProductOptions();