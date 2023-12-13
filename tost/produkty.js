        const db = firebase.firestore();
        const productsRef = db.collection('produkty');

        function addProduct(nazwa, cena, dostepnaIlosc) {
            productsRef.add({
                nazwa: nazwa,
                cena: cena,
                dostepna_ilosc: dostepnaIlosc
            })
            .then(() => {
                console.log("Produkt dodany pomyślnie.");
                loadProductList();
            })
            .catch((error) => {
                console.error("Błąd dodawania produktu: ", error);
            });
        }

        function deleteProduct(productId) {
            productsRef.doc(productId).delete()
            .then(() => {
                console.log("Produkt usunięty pomyślnie.");
                loadProductList();
            })
            .catch((error) => {
                console.error("Błąd usuwania produktu: ", error);
            });
        }

let currentProductId;

function editProduct(productId) {
    // Ustawienie wartości zmiennej currentProductId
    currentProductId = productId;

    productsRef.doc(productId).get()
        .then((doc) => {
            currentProductData = doc.data();

            document.getElementById('editNazwa').value = currentProductData.nazwa;
            document.getElementById('editCena').value = currentProductData.cena;
            document.getElementById('editDostepnaIlosc').value = currentProductData.dostepna_ilosc;

            document.getElementById('editProductModal').style.display = 'block';
        })
        .catch((error) => {
            console.error('Błąd pobierania danych produktu: ', error);
        });
}

        function cancelEdit() {
            document.getElementById('editProductModal').style.display = 'none';
        }

        function applyEdit() {
            const newName = document.getElementById('editNazwa').value;
            const newPrice = parseFloat(document.getElementById('editCena').value);
            const newQuantity = parseInt(document.getElementById('editDostepnaIlosc').value, 10);

            if (isNaN(newPrice) || isNaN(newQuantity) || newPrice <= 0 || newQuantity < 0) {
                alert('Wprowadź poprawne dane.');
                return;
            }

            const updatedFields = {};

            if (newName !== currentProductData.nazwa) {
                updatedFields.nazwa = newName;
            }

            if (!isNaN(newPrice) && newPrice !== currentProductData.cena) {
                updatedFields.cena = newPrice;
            }

            if (!isNaN(newQuantity) && newQuantity !== currentProductData.dostepna_ilosc) {
                updatedFields.dostepna_ilosc = newQuantity;
            }

            if (Object.keys(updatedFields).length > 0) {
                productsRef.doc(currentProductId).update(updatedFields)
                    .then(() => {
                        console.log('Produkt zaktualizowany pomyślnie.');
                        document.getElementById('editProductModal').style.display = 'none';
                        loadProductList();
                    })
                    .catch((error) => {
                        console.error('Błąd aktualizacji produktu: ', error);
                    });
            } else {
                alert('Nie wprowadzono żadnych zmian.');
            }
        }

        function loadProductList() {
            const productList = document.getElementById('productList');

            productList.innerHTML = '';

            productsRef.get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const productData = doc.data();
                        const productId = doc.id;

                        const listItem = document.createElement('li');
                        listItem.innerHTML = `${productData.nazwa} - Cena: ${productData.cena}, Dostępna ilość: ${productData.dostepna_ilosc}
                                             <button onclick="editProduct('${productId}')">Edytuj</button>
                                             <button onclick="deleteProduct('${productId}')">Usuń</button>`;
                        productList.appendChild(listItem);
                    });
                })
                .catch((error) => {
                    console.error('Błąd ładowania listy produktów: ', error);
                });
        }

        loadProductList();

        document.getElementById('addProductForm').addEventListener('submit', function (event) {
            event.preventDefault();

            const nazwa = document.getElementById('nazwa').value;
            const cena = parseFloat(document.getElementById('cena').value);
            const dostepnaIlosc = parseInt(document.getElementById('dostepnaIlosc').value, 10);

            if (isNaN(cena) || cena <= 0) {
                alert('Wprowadź poprawną cenę.');
                return;
            }

            if (isNaN(dostepnaIlosc) || dostepnaIlosc < 0) {
                alert('Wprowadź poprawną dostępną ilość.');
                return;
            }

            addProduct(nazwa, cena, dostepnaIlosc);
        });