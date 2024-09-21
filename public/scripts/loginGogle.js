import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { auth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {
  const googleSignInButton = document.querySelector("#googleLoginSignIn");
  const googleSignUpButton = document.querySelector("#googleLoginSignUp");

  const showMessage = (message, isSuccess) => {
    const messageElement = isSuccess 
      ? document.getElementById('signupSuccessMessage') 
      : document.getElementById('signupErrorMessage');
      
    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.display = 'block';

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        messageElement.style.display = 'none';
      }, 3000);
    } else {
      console.error("El elemento del mensaje no existe en el DOM");
    }
  };

  const handleGoogleLogin = async (buttonType) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userName = user.displayName || user.email.split('@')[0];

      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify({ userName, userId: user.uid }));

      if (buttonType === 'signin') {
        // Redirigir a la página de inicio
        window.location.href = '/public/start.html';
      } else {
        // Comprobar si el usuario ya está registrado
        const existingUser = JSON.parse(localStorage.getItem('user'));

        if (existingUser && existingUser.userId === user.uid) {
          // El usuario ya está registrado
          showMessage("Ya estás registrado. Inicia sesión.", false);
        } else {
          // Mostrar mensaje de éxito
          showMessage("Registro exitoso. Ya puedes iniciar sesión.", true);
        }
      }
    } catch (error) {
      console.error(`Error en Google Login (${buttonType}):`, error.message);
      alert(`Error de inicio de sesión: ${error.message}`);
    }
  };

  if (googleSignInButton) {
    googleSignInButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleGoogleLogin('signin');
    });
  }

  if (googleSignUpButton) {
    googleSignUpButton.addEventListener("click", (e) => {
      e.preventDefault();
      handleGoogleLogin('signup');
    });
  }
});
