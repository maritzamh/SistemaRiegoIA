const class_names = ['Margarita', 'Diente de Leon', 'Rosa', 'Girasol', 'Tulipan'];

async function predecirImagen() {
    const inputElement = document.getElementById("fileInput");
    const file = inputElement.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async function() {
            const img = new Image();
            img.src = reader.result;
            await img.decode();

            const imagenElement = document.getElementById("imagen");
            imagenElement.src = reader.result;

            const tensor = tf.browser.fromPixels(img).toFloat();
            const inputTensor = tensor.expandDims();
            const model = await tf.loadLayersModel('modelos/model.json');
            const predictions = model.predict(inputTensor).dataSync();

            const resultadoDiv = document.getElementById("resultado");
            resultadoDiv.innerHTML = "";

            let categoriaMaxProbabilidad = '';
            let maxProbabilidad = 0;

            // Iterar sobre las predicciones para encontrar la categoría con la máxima probabilidad
            for (let i = 0; i < predictions.length; i++) {
                if (predictions[i] > maxProbabilidad) {
                    categoriaMaxProbabilidad = class_names[i];
                    maxProbabilidad = predictions[i];
                }
                const class_name = class_names[i];
                const probabilidad = predictions[i];
                const porcentaje = (probabilidad * 100).toFixed(2);
                resultadoDiv.innerHTML += `<p>${class_name}: ${porcentaje}%</p>`;
            }

            // Mostrar el nombre de la flor con la mayor probabilidad en grande
            const florNombreDiv = document.getElementById('florNombre');
            florNombreDiv.innerHTML = `${categoriaMaxProbabilidad} `;

            // Mostrar solo la categoría con la mayor probabilidad
            const categoriaMaximaDiv = document.getElementById('categoriaMaxima');
            categoriaMaximaDiv.innerHTML = ` ${categoriaMaxProbabilidad}`;
            // Llamar a la función para mostrar la tarjeta correspondiente
            mostrarTarjeta(categoriaMaxProbabilidad);


            // Mostrar el resultado con la máxima probabilidad
            const avisoElement = document.getElementById('aviso');
            const umbrales = {
                'Girasol': { max: 60, min: 40 },
                'Diente de Leon': { max: 70, min: 45 },
                'Margarita': { max: 55, min: 35 },
                'Rosa': { max: 75, min: 45 },
                'Tulipan': { max: 60, min: 45 }
            };

            if (categoriaMaxProbabilidad && umbrales[categoriaMaxProbabilidad]) {
                const umbral = umbrales[categoriaMaxProbabilidad];
                if (maxProbabilidad * 100 >= umbral.min && maxProbabilidad * 100 <= umbral.max) {
                    avisoElement.innerHTML = `<p>La categoría con la mayor probabilidad es ${categoriaMaxProbabilidad} con ${ (maxProbabilidad * 100).toFixed(2) }% de probabilidad.</p>`;
                } else {
                    avisoElement.innerHTML = `<p>La categoría con la mayor probabilidad es ${categoriaMaxProbabilidad}, pero no está dentro del rango de umbral permitido.</p>`;
                }
            } else {
                avisoElement.innerHTML = `<p>No se pudo determinar la categoría con la mayor probabilidad.</p>`;
            }

            // Obtener la humedad actual y mostrar el aviso correspondiente
            if (categoriaMaxProbabilidad in umbrales) {
                fetch('/lastHumidity')
                    .then(response => response.json())
                    .then(data => {
                        const humedadActual = data.humidity;
                        if (humedadActual !== null) {
                            if (humedadActual > umbrales[categoriaMaxProbabilidad].max) {
                                avisoElement.innerText = `¡Necesita ser regado hasta que la humedad sea menor a ${umbrales[categoriaMaxProbabilidad].max} y mayor de ${umbrales[categoriaMaxProbabilidad].min}!`;
                                if (humedadActual > umbrales[categoriaMaxProbabilidad].max) {
                                    enviar_comando_regar();
                                }
                            } else if (humedadActual < umbrales[categoriaMaxProbabilidad].min) {
                                avisoElement.innerText = "¡Necesita dejar secar la tierra!";
                            } else {
                                avisoElement.innerText = "¡Tierra en condiciones óptimas!";
                            }
                        } else {
                            avisoElement.innerText = "No se pudieron obtener los datos de humedad.";
                        }
                    })
                    .catch(error => {
                        console.error('Error al obtener los datos de humedad:', error);
                        avisoElement.innerText = "Error al obtener los datos de humedad.";
                    });
            }
        };

        reader.readAsDataURL(file);
    } else {
        alert("Por favor, selecciona una imagen antes de hacer clic en Predecir.");
    }
}

function obtenerHumedad() {
    fetch('/lastHumidity')
        .then(response => response.json())
        .then(data => {
            console.log('Datos de humedad recibidos:', data);
            const humedadElement = document.getElementById('humedad');
            if (data.humidity !== null) {
                humedadElement.innerText = `Humedad actual: ${data.humidity}%`;
            } else {
                humedadElement.innerText = "Humedad actual: Datos no disponibles";
            }
        })
        .catch(error => console.error('Error al obtener los datos de humedad:', error));
}

function enviar_comando_regar() {
    fetch('/regardesdejs') // Reemplaza '/regardesdejs' con la ruta correcta en tu servidor
        .then(response => {
            if (response.ok) {
                console.log('Comando de riego enviado correctamente desde JavaScript.');
            } else {
                console.error('Error al enviar el comando de riego desde JavaScript:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error al enviar el comando de riego desde JavaScript:', error);
        });
}
// Añadir el manejador de eventos para el botón de ir al chatbot
document.getElementById('irAlChat').addEventListener('click', function() {
    const categoriaMaxProbabilidad = document.getElementById('categoriaMaxima').innerText.trim();
    const url = `chat_bot.html?flor=${encodeURIComponent(categoriaMaxProbabilidad)}`;
    window.location.href = url;
});
window.addEventListener('DOMContentLoaded', obtenerHumedad);



