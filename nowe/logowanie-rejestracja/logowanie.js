// Sprawdź stan logowania przy załadowaniu strony
auth.onAuthStateChanged((user) => {
    if (user) {
        // Jeśli użytkownik jest zalogowany, przekieruj go na stronę główną
        window.location.href = '../index.html';
    }
});

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorMessageElement = document.getElementById('errorMessage');

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            getUserData(userCredential.user.uid);
            // Przekieruj użytkownika na stronę główną po zalogowaniu
            window.location.href = '../index.html';
        })
        .catch((error) => {
            // Jeśli wystąpi błąd, wyświetl komunikat błędu na stronie
            errorMessageElement.innerText = 'Login, e-mail lub hasło są nieprawidłowe';
        });
});
