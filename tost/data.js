
function searchForms() {
    const searchDateInput = document.getElementById('searchDate');
    const searchDate = new Date(searchDateInput.value);

    if (isNaN(searchDate.getTime())) {
        alert('Please select a valid date.');
        return;
    }

    const searchStartDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate());
    const searchEndDate = new Date(searchDate.getFullYear(), searchDate.getMonth(), searchDate.getDate() + 1);

    // Wyczyść istniejące dane przed pobraniem nowych
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';

    // Pobierz formularze z Firestore na podstawie wybranego zakresu dat
    usersRef.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((userDoc) => {
                const userId = userDoc.id;
                const userFormsRef = usersRef.doc(userId).collection('formData');

                userFormsRef.where('data', '>=', searchStartDate).where('data', '<', searchEndDate).get()
                    .then((formSnapshot) => {
                        formSnapshot.forEach((formDoc) => {
                            const formData = formDoc.data();

                            // Zmiana: Przygotuj listę produktów
                            const productsList = (formData.zamowienie ?? []).map(item => `${item.ilosc} szt. ${item.produkt}`).join('<br>');

                            // Wyświetl formularz w wynikach wyszukiwania
                            const formDiv = document.createElement('div');
                            formDiv.innerHTML = `<p><strong>Name:</strong> ${formData.imie || 'N/A'}</p>
                                                 <p><strong>Email:</strong> ${formData.email || 'N/A'}</p>
                                                 <p><strong>Products:</strong> ${productsList || 'N/A'}</p>
                                                 <button onclick="viewFormData('${userId}', '${formDoc.id}')">View Details</button>`;
                            formDiv.classList.add('formDataItem');
                            searchResultsDiv.appendChild(formDiv);
                        });
                    })
                    .catch((error) => {
                        console.error('Error loading form data: ', error);
                    });
            });
        })
        .catch((error) => {
            console.error('Error loading user list: ', error);
        });
}


function clearResults() {
    // Wyczyść wyniki wyszukiwania
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';

    // Wyczyść pole daty
    const searchDateInput = document.getElementById('searchDate');
    searchDateInput.value = '';
}