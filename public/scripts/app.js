document.addEventListener("DOMContentLoaded", () => {
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  if (sign_in_btn && sign_up_btn && container) {
    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });
  } else {
    console.error("No se encontraron los elementos necesarios.");
  }

  const sign_in_nav_btn = document.querySelector("#sign-in-nav-btn");
  const sign_up_nav_btn = document.querySelector("#sign-up-nav-btn");

  if (sign_in_nav_btn && sign_up_nav_btn) {
    sign_in_nav_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });

    sign_up_nav_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });
  } else {
    console.error("No se encontraron los botones de navegación.");
  }
});
