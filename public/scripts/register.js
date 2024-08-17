import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVEIzoC2ZLqim7-z1gWiWvTXglc92QbOQ",
    authDomain: "floranet.firebaseapp.com",
    projectId: "floranet",
    storageBucket: "floranet.appspot.com",
    messagingSenderId: "483650882111",
    appId: "1:483650882111:web:688b041cb368a3045dc68a",
    measurementId: "G-TG26MPZHDG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('signUpForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const displayName = document.getElementById('signupUserName').value;
    const errorDisplay = document.createElement('p'); // Crear elemento para mostrar errores
    errorDisplay.style.color = 'red';
    errorDisplay.id = 'registerErrorDisplay';

    try {
        // Crear un nuevo usuario con el correo y contraseña proporcionados
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar el perfil del usuario con el nombre ingresado
        await updateProfile(user, {
            displayName: displayName
        });

        // Borrar los datos del formulario
        document.getElementById('signupUserName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';

        // Mostrar mensaje de éxito
        const successMessage = document.getElementById('signupSuccessMessage');
        successMessage.style.display = 'block';

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        // Redirigir al login
        window.location.href = 'login.html';

    } catch (error) {
        // Manejar errores específicos
        switch (error.code) {
            case 'auth/invalid-email':
                errorDisplay.textContent = 'Correo inválido.';
                break;
            case 'auth/weak-password':
                errorDisplay.textContent = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
                break;
            case 'auth/email-already-in-use':
                errorDisplay.textContent = 'El correo ya está en uso. Por favor, utiliza otro correo o inicia sesión.';
                break;
            default:
                errorDisplay.textContent = `Error: ${error.message}`;
        }

        // Agregar mensaje de error al formulario si no existe
        if (!document.getElementById('registerErrorDisplay')) {
            document.getElementById('signUpForm').appendChild(errorDisplay);
        }

        // Ocultar mensaje de error después de 5 segundos
        setTimeout(() => {
            if (errorDisplay) {
                errorDisplay.remove();
            }
        }, 5000);
    }
});
