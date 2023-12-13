function showUserData(uid) {
    const userDataList = document.getElementById('userDataList');

    userDataList.innerHTML = '';

    db.collection('users').doc(uid).collection('formData').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const formData = doc.data();
                const listItem = document.createElement('li');
                const date = formData.data ? formData.data.toDate().toLocaleString() : 'Brak daty';

                // Zmiany w tej sekcji
                const produktyList = formData.zamowienie.map((item) => {
                    return `<li>${item.ilosc} szt. ${item.produkt}</li>`;
                }).join('');

                listItem.innerHTML = `
                    <strong>Imię:</strong> ${formData.imie}<br>
                    <strong>Email:</strong> ${formData.email}<br>
                    <strong>Nr. telefonu:</strong> ${formData.telefon}<br>
                    <strong>Produkty:</strong> <ul>${produktyList}</ul>
                    <strong>Opis:</strong> ${formData.opis}<br>
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
    } else {
        // Użytkownik nie jest zalogowany, przekieruj na stronę logowania
        window.location.href = 'login.html';
    }
});
