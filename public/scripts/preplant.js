const class_names = [
    'Apple Scab', 'Apple Black Rot', 'Cedar Apple Rust', 'Healthy Apple', 
    'Blueberry Healthy', 'Cherry Powdery Mildew', 'Healthy Cherry', 'Corn Cercospora Leaf Spot', 
    'Corn Common Rust', 'Corn Northern Leaf Blight', 'Healthy Corn', 'Grape Black Rot', 
    'Grape Esca (Black Measles)', 'Grape Leaf Blight (Isariopsis Leaf Spot)', 'Healthy Grape', 
    'Orange Huanglongbing (Citrus Greening)', 'Peach Bacterial Spot', 'Healthy Peach', 
    'Pepper Bell Bacterial Spot', 'Healthy Pepper Bell', 'Potato Early Blight', 'Potato Late Blight', 
    'Healthy Potato', 'Raspberry Healthy', 'Soybean Healthy', 'Squash Powdery Mildew', 
    'Strawberry Leaf Scorch', 'Healthy Strawberry', 'Tomato Bacterial Spot', 'Tomato Early Blight', 
    'Tomato Late Blight', 'Tomato Leaf Mold', 'Tomato Septoria Leaf Spot', 'Tomato Spider Mites', 
    'Tomato Target Spot', 'Tomato Yellow Leaf Curl Virus', 'Tomato Mosaic Virus', 'Healthy Tomato'
];

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

            // Preprocesar la imagen en un tensor
            const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([256, 256]).toFloat().div(tf.scalar(255));
            const inputTensor = tensor.expandDims();

            // Cargar el nuevo modelo de plantas
            const model = await tf.loadLayersModel('plant/model.json');

            // Realizar la predicción
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

            // Mostrar el nombre de la planta con la mayor probabilidad en grande
            const plantaNombreDiv = document.getElementById('plantaNombre');
            plantaNombreDiv.innerHTML = `${categoriaMaxProbabilidad}`;

            // Mostrar solo la categoría con la mayor probabilidad
            const categoriaMaximaDiv = document.getElementById('categoriaMaxima');
            categoriaMaximaDiv.innerHTML = ` ${categoriaMaxProbabilidad}`;

            // Mostrar el resultado con la máxima probabilidad
            const avisoElement = document.getElementById('aviso');
            avisoElement.innerHTML = `<p>La categoría con la mayor probabilidad es ${categoriaMaxProbabilidad} con ${(maxProbabilidad * 100).toFixed(2)}% de probabilidad.</p>`;

            // Obtener la humedad actual y mostrar el aviso correspondiente
            fetch('/lastHumidity')
                .then(response => response.json())
                .then(data => {
                    const humedadActual = data.humidity;
                    if (humedadActual !== null) {
                        // Lógica personalizada basada en la clase y humedad
                        if (humedadActual > 70) {
                            avisoElement.innerText += " ¡La planta necesita ser regada!";
                            enviar_comando_regar();
                        } else if (humedadActual < 30) {
                            avisoElement.innerText += " ¡Deje que la tierra se seque!";
                        } else {
                            avisoElement.innerText += " ¡La humedad del suelo es óptima!";
                        }
                    } else {
                        avisoElement.innerText = "No se pudieron obtener los datos de humedad.";
                    }
                })
                .catch(error => {
                    console.error('Error al obtener los datos de humedad:', error);
                    avisoElement.innerText = "Error al obtener los datos de humedad.";
                });
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
    const url = `chat_bot.html?planta=${encodeURIComponent(categoriaMaxProbabilidad)}`;
    window.location.href = url;
});

window.addEventListener('DOMContentLoaded', obtenerHumedad);
