// Importuj funkcje Firestore
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
// Importuj db z pliku firebase-config.js
import { db } from "./firebase-config.js";

document.querySelector('.formularz').addEventListener('submit', async function (e) {
  e.preventDefault();

  // Pobierz wartości z formularza
  const imie = document.querySelector('input[name="imie"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const temat = document.querySelector('input[name="temat"]').value;
  const wiadomosc = document.querySelector('textarea').value;

  // Dodaj dane do kolekcji "kontakt" w Firestore
  try {
    const docRef = await addDoc(collection(db, 'kontakt'), {
      imie,
      email,
      temat,
      wiadomosc,
    });

    // Wyświetl komunikat sukcesu
    document.getElementById('success-message').style.display = 'block';

    console.log('Dane wysłane do Firestore z ID:', docRef.id);
  } catch (error) {
    console.error('Błąd podczas wysyłania danych:', error);
  }
});