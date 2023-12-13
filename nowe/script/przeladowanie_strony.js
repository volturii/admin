        window.onload = function() {
            // Tutaj umieść kod, który ma być wykonany po pełnym załadowaniu strony
            // Na przykład, kod ukrywający ikonę.
            hideIcon();
        };

        function hideIcon() {
            const userIcon = document.getElementById('userIcon');
            if (userIcon) {
                userIcon.style.display = 'none';
            }
        }
