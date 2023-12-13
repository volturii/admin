

firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
        if (user.displayName !== null) {
            showDisplayName(user.displayName);
        } else {
            try {
                const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
                const usernameFromFirestore = userDoc.data().displayName;
                if (usernameFromFirestore) {
                    showDisplayName(usernameFromFirestore);
                } else {
                    console.warn("Nazwa użytkownika jest ustawiona na null.");
                }
            } catch (error) {
                console.error("Błąd podczas pobierania danych z Firestore:", error);
            }
        }
    } else {
        hideDisplayName();
    }
});

function showDisplayName(displayName) {
    document.getElementById('userDisplayName').innerHTML = 'Witaj, ' + displayName + '!';
    document.getElementById('loginButton').style.display = 'none';
    document.getElementById('logoutButton').style.display = 'block';
}

function hideDisplayName() {
    document.getElementById('userDisplayName').innerHTML = '';
    document.getElementById('loginButton').style.display = 'block';
    document.getElementById('logoutButton').style.display = 'none';
}

function logout() {
    auth.signOut().then(() => {
        alert('Wylogowano pomyślnie!');
        document.getElementById('userName').innerText = '';
    }).catch((error) => {
        alert(error.message);
    });
}

