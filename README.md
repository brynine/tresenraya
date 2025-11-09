# INTEGRANTES:
Robinson Redrovan, Bryam Mejia
# GameTresEnRaya
Juego tres en raya aplicando estándares HTML5, CSS3 y JavaScript
# Descripción
El juevo del tres en raya es una versión divertida y didactica, para que dos jugadores se distraigan de lo cotidiano, cada jugados puede elegir un símbolo (X  o O)el cual se debe colocar en un tablero de 3x3. El objetivo y lo que lo hace divertido es alinear tres símbolos del mismo tipo en fila, columna o que sea diagonal antes que el otro jugador.
Een el juego implementamos un sistema de historial,temporizador, efectos visuales y que sea adaptable a diferentes dispositivos, para que los jugadores puedan disfrutar.

# Instrucciones de ejecución local
1. Debemos descargar todos los archivos(HTML,CSS y JS).
2. Gurdar la estructura:
   /tresenraya/
    index.html
    /css/
        styles.css
    /js/
        game.js
        storage.js
    /assets/ (opcional)
    README.md
3. El proyecto utiliza módulos de JavaScript ya sea por el import o el export, que debemos ejecutar desde el servidor local y no directamente desde el archivo HTML(index.html).
Se puede usar el siguiente comando "python -m http.server 8000" y luego en el navegador abrimos como "http://localhost:8000"

# Decisiones Técnicas
1. Para el almacenamiento se uso el LocalStorage ya que es una solucion simple,rapida y adecuada para guardar pequeñas cantidades de datos, como en este caso que el historial de las partidas.
2. La estructura de los datos:
* El estado del tablero lo guardamos en un array de 9 posiciones, lo cual representa las celdas del tablero, cada uno de los movimiento lo actualiza en el arreglo y el resultado se almacena en el hisotrial mediante los objetos como ( jugaodr1:"X") , ( jugador2: "O" ), (ganador: jugador1), (fecha) y (duración).  El historial se gestiona mediante funciones de storage como guardar, cargar,etc.

# Lista de comprobación de estándares
1. Semántica HTML:
Se emplean etiquetas adecuadas (header>, <main>, <section>, <button>, <table>, <footer>).
<img width="466" height="217" alt="image" src="https://github.com/user-attachments/assets/802d5a4a-0a71-43a8-9937-b13a776253dd" />

3. 
   

