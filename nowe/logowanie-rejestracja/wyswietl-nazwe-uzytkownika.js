// logowanie-rejestracja/wyswietl-nazwe-uzytkownika.js

// Funkcja do wykonania po załadowaniu DOM
function onDOMLoaded() {
    // Ukryj nazwę użytkownika, dropdown i ikonę na początku
    const userNameElement = document.getElementById('userName');
    const dropdownContainer = document.getElementById('dropdownContainer');
    const userIcon = document.getElementById('userIcon');

    if (userNameElement) {
        userNameElement.style.display = 'none';
    }

    if (dropdownContainer) {
        dropdownContainer.style.display = 'none';
    }

    // Ukryj ikonę użytkownika za pomocą klasy hidden-icon w stylach CSS
    if (userIcon) {
        userIcon.classList.add('hidden-icon');
    }

    // Funkcja do pobierania danych użytkownika
    function getUserData(userId) {
        db.collection('users')
            .doc(userId)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    const displayName = doc.data().displayName;

                    // Pokaż nazwę użytkownika po uzyskaniu danych
                    if (userNameElement) {
                        userNameElement.innerText = displayName;
                        userNameElement.style.display = 'inline-block'; // lub 'block', w zależności od potrzeb stylizacji
                    }

                    // Ukryj ikonę użytkownika
                    if (userIcon) {
                        userIcon.style.display = 'none';
                    }

                    // Pokaż element dropdown tylko dla zalogowanego użytkownika
                    if (dropdownContainer) {
                        dropdownContainer.style.display = 'block';
                    }
                } else {
                    console.log('Brak danych użytkownika w Firestore.');

                    // Pokaż ikonę użytkownika, jeśli użytkownik nie jest zalogowany
                    if (userIcon) {
                        userIcon.style.display = 'block';
                    }

                    // Ukryj element dropdown dla niezalogowanego użytkownika
                    if (dropdownContainer) {
                        dropdownContainer.style.display = 'none';
                    }
                }
            })
            .catch((error) => {
                console.error('Błąd podczas pobierania danych użytkownika z Firestore: ', error);
            });
    }

   auth.onAuthStateChanged((user) => {
        if (user) {
            // Jeśli użytkownik jest zalogowany, pobierz i wyświetl jego dane
            getUserData(user.uid);
        } else {
            // Pokaż ikonę użytkownika, jeśli użytkownik nie jest zalogowany
            if (userIcon) {
                userIcon.style.display = 'block';
            }

            // Ukryj nazwę użytkownika i dropdown dla niezalogowanego użytkownika
            if (userNameElement) {
                userNameElement.style.display = 'none';
            }

            if (dropdownContainer) {
                dropdownContainer.style.display = 'none';
            }
        }
    });

    // Usunięcie klasy hidden-icon po 1 sekundzie
    setTimeout(() => {
        if (userIcon) {
            userIcon.classList.remove('hidden-icon');
        }
    }, 1000);
}

// Dodaj event do obiektu document, aby uruchomić funkcję onDOMLoaded po załadowaniu DOM
document.addEventListener('DOMContentLoaded', onDOMLoaded);