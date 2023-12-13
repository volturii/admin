
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
    document.getElementById('userDisplayName').innerHTML =  displayName;

}

function hideDisplayName() {
    document.getElementById('userDisplayName').innerHTML = '';

}

function logout() {
    firebase.auth().signOut().then(function() {
        hideDisplayName();
    }).catch(function(error) {
        console.error(error.message);
    });
}
