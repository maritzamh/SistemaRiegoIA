import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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


document.getElementById('signInForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorDisplay = document.getElementById('loginErrorDisplay');

    // Ocultar cualquier mensaje previo de error
    errorDisplay.classList.remove('show', 'close');

    // Validar que el email y la contraseña no estén vacíos
    if (email === '' || password === '') {
        errorDisplay.textContent = 'Por favor ingrese el correo y la contraseña.';
        errorDisplay.classList.add('show');

        // Eliminar el mensaje después de 6 segundos
        setTimeout(() => {
            errorDisplay.classList.add('close');
        }, 6000);

        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = '/public/start.html'; // Redirecciona si el login es exitoso
    } catch (error) {
        let errorMessage = '';
        switch (error.code) {
            case 'auth/invalid-email':
                errorMessage = 'Correo inválido.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Contraseña incorrecta.';
                break;
            case 'auth/user-not-found':
                errorMessage = 'No se encontró un usuario con ese correo.';
                break;
            case 'auth/email-already-in-use':
                errorMessage = 'El correo ya está en uso por otra cuenta.';
                break;
            case 'auth/operation-not-allowed':
                errorMessage = 'La autenticación con correo y contraseña no está habilitada.';
                break;
            case 'auth/weak-password':
                errorMessage = 'La contraseña es demasiado débil.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Demasiados intentos fallidos. Por favor, intenta de nuevo más tarde.';
                break;
            case 'auth/network-request-failed':
                errorMessage = 'Error de red. Verifica tu conexión a internet.';
                break;
            case 'auth/requires-recent-login':
                errorMessage = 'Para realizar esta acción, debes iniciar sesión de nuevo.';
                break;
            case 'auth/credential-already-in-use':
                errorMessage = 'Estas credenciales ya están asociadas con otra cuenta de usuario.';
                break;
            case 'auth/invalid-credential':
                errorMessage = 'Las credenciales proporcionadas no son válidas.';
                break;
            case 'auth/user-disabled':
                errorMessage = 'La cuenta de este usuario ha sido deshabilitada.';
                break;
            case 'auth/account-exists-with-different-credential':
                errorMessage = 'Ya existe una cuenta con el mismo correo electrónico pero con credenciales diferentes.';
                break;
            case 'auth/popup-blocked':
                errorMessage = 'El inicio de sesión emergente ha sido bloqueado por el navegador.';
                break;
            case 'auth/popup-closed-by-user':
                errorMessage = 'El inicio de sesión emergente fue cerrado antes de completarse la operación.';
                break;
            case 'auth/unverified-email':
                errorMessage = 'El correo electrónico no ha sido verificado.';
                break;
            default:
                errorMessage = `Error: ${error.message}`;
                break;
        }

        errorDisplay.textContent = errorMessage;
        errorDisplay.classList.add('show');

        // Eliminar el mensaje después de 6 segundos
        setTimeout(() => {
            errorDisplay.classList.add('close');
        }, 6000);
    }
});
