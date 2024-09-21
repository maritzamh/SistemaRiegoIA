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
    const errorDisplay = document.getElementById('registerErrorDisplay');
    const successMessage = document.getElementById('signupSuccessMessage');

    errorDisplay.classList.remove('show', 'close'); // Ocultar error inicial
    successMessage.classList.remove('show', 'close'); // Ocultar mensaje de éxito inicial

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
        successMessage.textContent = 'Registro exitoso. Ya puedes iniciar sesión.';
        successMessage.classList.add('show');

        // Redirigir a la página de inicio de sesión
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000); // Retardo para que el usuario vea el mensaje de éxito

    } catch (error) {
        // Manejar errores específicos
        let errorMessage = '';
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Correo inválido.';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'El correo ya está en uso. Por favor, utiliza otro correo o inicia sesión.';
                break;
            default:
                errorMessage = `Error: ${error.message}`;
        }

        // Mostrar mensaje de error
        errorDisplay.textContent = errorMessage;
        errorDisplay.classList.add('show');

        // Eliminar el mensaje después de 6 segundos
        setTimeout(() => {
            errorDisplay.classList.add('close');
        }, 6000);
    }
});
