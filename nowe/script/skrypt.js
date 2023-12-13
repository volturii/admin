// skrypt.js

// Funkcja otwierająca okno modalne dla wartości odżywczych
function openModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
}

// Funkcja zamykająca okno modalne dla wartości odżywczych
function closeModal() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// Zamykanie okna modalnego po kliknięciu poza jego obszarem
window.onclick = function (event) {
  var modal = document.getElementById("myModal");

  if (event.target == modal) {
    modal.style.display = "none";
  }
};
