

//const clave = "AIzaSyAWjXwAj9IzPMkJiymAfNBpEq3uxnhGr70";  // Reemplaza con tu clave
//https://aistudio.google.com/app/apikey
import { GoogleGenerativeAI } from "@google/generative-ai"
    const clave = ""  // copiar su clave

    const genAI = new GoogleGenerativeAI(clave)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    document.querySelector("#botonConsulta").addEventListener("click", async () => {
      desactivarBoton()
      const consulta = document.querySelector("#consulta").value
      const resultadoConsulta = document.querySelector("#resultadoConsulta")
      try {
        const result = await model.generateContent(consulta)
        const response = await result.response
        const text = response.text()
        resultadoConsulta.innerHTML = text
      } catch (error) {
        resultadoConsulta.innerHTML = 'Problemas en la consulta'
      }
      activarBoton()
    })

    function desactivarBoton() {
      const botonConsulta = document.querySelector("#botonConsulta")
      botonConsulta.disabled = true
      botonConsulta.innerText = "Consultando..."
    }

    function activarBoton() {
      const botonConsulta = document.querySelector("#botonConsulta")
      botonConsulta.disabled = false
      botonConsulta.innerText = "Consultar"
    }