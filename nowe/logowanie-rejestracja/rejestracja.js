// Obsługa rejestracji
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const displayName = document.getElementById('displayName').value;

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Dodaj dodatkowe dane do Firestore
            return db.collection('users').doc(userCredential.user.uid).set({
                displayName: displayName
            });
        })
        .then(() => {
            // Wyloguj użytkownika po zarejestrowaniu
            return auth.signOut();
        })
                .then(() => {
            // Wyświetl komunikat o pomyślnej rejestracji
            alert('Zostałeś pomyślnie zarejestrowany. Możesz przejść do logowania.');

            // Przekieruj użytkownika na stronę logowania
            window.location.href = 'logowanie.html';
        })
        .catch((error) => {
            alert(error.message);
        });
});