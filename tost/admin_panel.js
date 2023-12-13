const db = firebase.firestore();
const usersRef = db.collection('users');

// Pobierz referencję do elementów HTML
const userListDiv = document.getElementById('userList');
const formDataDiv = document.getElementById('formData');
const userFilterInput = document.getElementById('userFilter');
const userSelect = document.getElementById('userSelect');

// Funkcja do pobierania listy użytkowników
function loadUserList() {
    console.log('Loading user list...');
    // Sprawdź, czy element o identyfikatorze 'userListDiv' istnieje
    const userListDiv = document.getElementById('userListDiv');

    if (!userListDiv) {
        console.error("Element with ID 'userListDiv' not found.");
        return;
    }

    // Wyczyść istniejące dane przed pobraniem nowych
    userListDiv.innerHTML = '';

    // Pobierz listę użytkowników z Firestore
    usersRef.get()
        .then((querySnapshot) => {
            // Dodaj domyślną opcję
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.text = 'Select a user';
            userSelect.appendChild(defaultOption);

            querySnapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                const userId = userDoc.id;

                // Dodaj użytkownika do listy rozwijanej
                const option = document.createElement('option');
                option.value = userId;
                option.text = userData.displayName || 'N/A';
                userSelect.appendChild(option);
            });

            // Utwórz listę filtrowaną
            const filteredUserList = Array.from(userSelect.options);
            
            // Dodaj nasłuchiwanie na zmianę wartości w polu filtrowania
            userFilterInput.addEventListener('input', function() {
                const filterText = userFilterInput.value.toLowerCase();

                // Filtrowanie opcji rozwijanej
                const filteredOptions = filteredUserList.filter(option => option.text.toLowerCase().includes(filterText));

                // Wyczyść istniejące opcje
                userSelect.innerHTML = '';

                // Dodaj nowe opcje do listy rozwijanej
                filteredOptions.forEach(option => {
                    userSelect.appendChild(option.cloneNode(true));
                });
            });
        })
        .catch((error) => {
            console.error('Error loading user list: ', error);
        });
}




// Funkcja do obsługi zmiany użytkownika w liście rozwijanej
function onUserSelectChange() {
    const userSelect = document.getElementById('userSelect');
    const selectedUserId = userSelect.value;

    // Wywołaj funkcję ładowania formularzy tylko jeśli wybrano użytkownika
    if (selectedUserId) {
        loadFormData(selectedUserId);
    }
}

// Dodaj nasłuchiwanie na zmianę użytkownika w liście rozwijanej
document.getElementById('userSelect').addEventListener('change', onUserSelectChange);

// Funkcja do ładowania formularzy dla danego użytkownika
// Funkcja do ładowania formularzy dla danego użytkownika
function loadFormData(userId) {
    // Wyczyść istniejące dane przed pobraniem nowych
    formDataDiv.innerHTML = '';

    // Pobierz referencję do kolekcji "formData" dla danego użytkownika
    const userFormsRef = db.collection('users').doc(userId).collection('formData');

    userFormsRef.get()
        .then((querySnapshot) => {
            console.log(`User ID: ${userId}`);

            querySnapshot.forEach((formDoc) => {
                const formData = formDoc.data();
                const formId = formDoc.id; // Dodaj pobranie ID formularza

                console.log(`Form Data (Form ID: ${formId}): ${JSON.stringify(formData)}`);

                // Zmiana: Przygotuj listę produktów
                const productsList = formData.zamowienie.map(item => `${item.ilosc} szt. ${item.produkt}`).join('<br>');

                // Dodaj formularz do listy
                const formDiv = document.createElement('div');
                formDiv.innerHTML = `<p><strong>Name:</strong> ${formData.imie || 'N/A'}</p>
                                     <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
                                     <p><strong>Products:</strong><br>${productsList || 'N/A'}</p>
                                     <button onclick="viewFormData('${userId}', '${formId}')">View Details</button>`;
                formDiv.classList.add('formDataItem');
                formDataDiv.appendChild(formDiv);
            });
        })
        .catch((error) => {
            console.error('Error loading form data: ', error);
        });
}




// Funkcja do otwierania modala
function openModal() {
  const modal = document.getElementById('formDetailsModal');
  modal.style.display = 'block';
}

// Funkcja do zamykania modala
function closeModal() {
  const modal = document.getElementById('formDetailsModal');
  modal.style.display = 'none';
}

// Funkcja do wyświetlania szczegółów konkretnego formularza
function viewFormData(userId, formId) {
    const userFormsRef = db.collection('users').doc(userId).collection('formData').doc(formId);

    userFormsRef.get()
        .then((doc) => {
            if (doc.exists) {
                const formData = doc.data();
                console.log(`Viewing Form Data (Form ID: ${formId}): ${JSON.stringify(formData)}`);

                // Zmiana: Przygotuj listę produktów
                const productsList = (formData.zamowienie ?? []).map(item => `${item.ilosc} szt. ${item.produkt}`).join('<br>');

                // Wyświetl szczegóły formularza w modalu
                const formDetailsDiv = document.getElementById('formDetails');
                formDetailsDiv.innerHTML = `Form Details:<br>
                                            Name: ${formData.imie || 'N/A'}<br>
                                            Phone: ${formData.telefon || 'N/A'}<br>
                                            Products: ${productsList || 'N/A'}<br>
                                            Date: ${formData.data.toDate().toLocaleString()}<br>
                                            Email: ${formData.email || 'N/A'}<br>
                                            Opis: ${formData.opis || 'Brak opisu'}<br>
                                            <button onclick="editOpis('${userId}', '${formId}', '${formData.opis || ''}')">Edit Opis</button>
                                            <button onclick="addOpis('${userId}', '${formId}')">Add Opis</button>`;

                // Otwórz modal
                openModal();
            } else {
                console.error('Form not found');
            }
        })
        .catch((error) => {
            console.error('Error loading form data: ', error);
        });
}

// Funkcja do edycji opisu
function editOpis(userId, formId, currentOpis) {
  // Wyświetl pole input do wprowadzania opisu
  const formDetailsDiv = document.getElementById('formDetails');
  formDetailsDiv.innerHTML += `<br>Nowy Opis: <textarea id="newOpisInput">${currentOpis || ''}</textarea>
                               <button onclick="saveOpis('${userId}', '${formId}')">Zapisz Opis</button>`;
}

// Funkcja do dodawania opisu
function addOpis(userId, formId) {
  // Wyświetl pole input do wprowadzania opisu
  const formDetailsDiv = document.getElementById('formDetails');
  formDetailsDiv.innerHTML += `<br>Nowy Opis: <textarea id="newOpisInput"></textarea>
                               <button onclick="saveOpis('${userId}', '${formId}')">Zapisz Opis</button>`;
}

// Funkcja do zapisywania opisu
function saveOpis(userId, formId) {
  // Pobierz wartość wprowadzoną w polu opisu
  const newOpisInputValue = document.getElementById('newOpisInput').value;

  // Uzyskaj referencję do konkretnego formularza
  const userFormsRef = db.collection('users').doc(userId).collection('formData').doc(formId);

  // Zaktualizuj pole 'opis' w dokumencie formularza
  userFormsRef.update({
    opis: newOpisInputValue
  })
  .then(() => {
    console.log('Opis został pomyślnie dodany/zaktualizowany.');
    closeModal(); // Zamknij modal po zapisaniu zmian
  })
  .catch((error) => {
    console.error('Błąd podczas dodawania/zaktualizowania opisu: ', error);
  });
}





// Wywołaj funkcję załadowania listy użytkowników przy starcie aplikacji
loadUserList();




function displayProductReport(productCountMap) {
    const productReportDiv = document.getElementById('productReport');

    // Wyczyść istniejącą zawartość
    productReportDiv.innerHTML = '';

    // Dodaj nową zawartość - raport
    const reportContent = Array.from(productCountMap.entries())
        .map(([productName, quantity]) => `<p>${productName}: ${quantity}</p>`)
        .join('');

    productReportDiv.innerHTML = reportContent;
    console.log('Product Report:', reportContent); // Możesz usunąć tę linię, jeśli nie jest potrzebna w konsoli
}

// Funkcja do generowania raportu o produktach
function generateProductReport() {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Ustaw datę 30 dni wstecz
    const productCountMap = new Map();

    // Pobierz wszystkie formularze z ostatnich 30 dni
    usersRef.get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                console.log('No forms found.');
                return;
            }

            querySnapshot.forEach((userDoc) => {
                const formDataRef = userDoc.ref.collection('formData');

                // Pobierz formularze z ostatnich 30 dni dla danego użytkownika
                formDataRef.where('data', '>=', startDate).get()
                    .then((formQuerySnapshot) => {
                        formQuerySnapshot.forEach((formDoc) => {
                            const formData = formDoc.data();

                            if (!formData.zamowienie || formData.zamowienie.length === 0) {
                                console.log('No orders in this form.');
                                return;
                            }

                            // Sprawdź, czy formularz jest z ostatnich 30 dni
                            if (formData.data.toDate() >= startDate) {
                                // Dla każdego produktu w zamówieniu, zaktualizuj licznik w mapie
                                formData.zamowienie.forEach((item) => {
                                    const productName = item.produkt;
                                    const quantity = parseInt(item.ilosc, 10);

                                    if (!isNaN(quantity)) {
                                        if (productCountMap.has(productName)) {
                                            productCountMap.set(productName, productCountMap.get(productName) + quantity);
                                        } else {
                                            productCountMap.set(productName, quantity);
                                        }
                                    } else {
                                        console.error(`Invalid quantity for product ${productName}`);
                                    }
                                });
                            }
                        });

                        console.log('Product Count Map:', Array.from(productCountMap.entries()));
                        displayProductReport(productCountMap); // Przesuń wywołanie funkcji do tego miejsca
                    })
                    .catch((error) => {
                        console.error('Error generating product report: ', error);
                    });
            });
        })
        .catch((error) => {
            console.error('Error fetching users: ', error);
        });
}


generateProductReport();
