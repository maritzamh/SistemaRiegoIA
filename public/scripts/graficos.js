anychart.onDocumentReady(function () {
  var gauge = anychart.gauges.circular();
  gauge
    .fill('#fff')
    .stroke(null)
    .padding(0)
    .margin(100)
    .startAngle(270)
    .sweepAngle(180);

  gauge
    .axis()
    .labels()
    .padding(5)
    .fontSize(14)
    .position('outside')
    .format('${%Value}%');

  gauge
    .axis()
    .scale()
    .minimum(0)
    .maximum(100)
    .ticks({ interval: 10 })
    .minorTicks({ interval: 5 });

  gauge
    .axis()
    .fill('#545f69')
    .width(1)
    .ticks({ type: 'line', fill: 'white', length: 2 });

  gauge.title(
    '<span style="color:#009900; font-size: 14px;">(Humedad actual: <strong>45%</strong>)</span>'
  );
  gauge
    .title()
    .useHtml(true)
    .padding(0)
    .fontColor('#212121')
    .hAlign('center')
    .margin([0, 0, 10, 0]);

  gauge
    .needle()
    .stroke('2 #545f69')
    .startRadius('5%')
    .endRadius('90%')
    .startWidth('0.1%')
    .endWidth('0.1%')
    .middleWidth('0.1%');

  gauge.cap().radius('3%').enabled(true).fill('#545f69');

  gauge.range(0, {
    from: 0,
    to: 30,
    position: 'inside',
    fill: '#dd2c00 0.4',
    startSize: 50,
    endSize: 50,
    radius: 98
  });

  gauge.range(1, {
    from: 30,
    to: 70,
    position: 'inside',
    fill: '#ffa000 0.4',
    startSize: 50,
    endSize: 50,
    radius: 98
  });

  gauge.range(2, {
    from: 70,
    to: 100,
    position: 'inside',
    fill: '#009900 0.4',
    startSize: 50,
    endSize: 50,
    radius: 98
  });

  gauge
    .label(1)
    .text('Bajo')
    .fontColor('#212121')
    .fontSize(14)
    .offsetY('68%')
    .offsetX(25)
    .anchor('center');

  gauge
    .label(2)
    .text('Moderado')
    .fontColor('#212121')
    .fontSize(14)
    .offsetY('68%')
    .offsetX(90)
    .anchor('center');

  gauge
    .label(3)
    .text('Alto')
    .fontColor('#212121')
    .fontSize(14)
    .offsetY('68%')
    .offsetX(155)
    .anchor('center');

  gauge.container('container');
  gauge.draw();

  var waterButton = document.getElementById('water-button');
  var warning = document.getElementById('warning');

  function updateGauge(value) {
    gauge.data([value]);
    gauge.title().text(`Humedad actual: <strong>${value}%</strong>`);
    if (value < 30) {
      warning.textContent = '¡Advertencia! La humedad está baja. ¡Debe regar la planta!';
    } else {
      warning.textContent = '';
    }
  }

  waterButton.addEventListener('click', function() {
    fetch('http://your-server-address/humidity')
      .then(response => response.json())
      .then(data => {
        var newHumidity = data.humidity;
        updateGauge(newHumidity);
      })
      .catch(error => console.error('Error fetching humidity data:', error));
  });

    // Función para actualizar la hora y la fecha
  function updateTimeAndDate() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    var day = now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById('date-time-container').innerHTML = 
        `<div>EL TIEMPO<br/><span style="color:#1976d2; font-size: 20px; font-weight: 300"> Fecha: ${day} <br/> Hora: ${hours}:${minutes}:${seconds}</span></div>`;
  }

  // Actualiza cada segundo
  setInterval(updateTimeAndDate, 1000); 
  // Actualiza inmediatamente al cargar la página
  updateTimeAndDate();

});
