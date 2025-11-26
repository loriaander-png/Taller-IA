// Explicación: en JavaScript, una variable es como una caja de mudanza.
// La caja guarda cosas (valores) y la etiqueta de la caja es el nombre de la variable.

// 1) Crear una caja y poner algo dentro:
// Usamos 'var' para crear la variable (la etiqueta en la caja).
var caja = 'ropa'; // La caja llamada 'caja' contiene la palabra 'ropa'

// 2) Cambiar lo que hay dentro de la misma caja:
// No creamos una nueva caja, simplemente ponemos algo distinto dentro.
caja = 'libros'; // Ahora la caja 'caja' contiene 'libros'

// 3) Tener varias cajas con etiquetas distintas:
var cajaAzul = 'platos';
var cajaRoja = 'vasos';

// 4) Usar el contenido de las cajas (por ejemplo, mostrarlo):
console.log('Contenido de caja:', caja);       // Muestra: Contenido de caja: libros
console.log('Contenido cajaAzul:', cajaAzul); // Muestra: Contenido cajaAzul: platos
console.log('Contenido cajaRoja:', cajaRoja); // Muestra: Contenido cajaRoja: vasos

// 5) Puntos clave de la analogía:
// - La variable = la etiqueta en la caja (el nombre que usamos para referirnos al contenido).
// - El valor dentro de la variable = lo que hay dentro de la caja (texto, número, etc.).
// - Podemos cambiar el contenido de la caja sin cambiar la etiqueta.
// - Podemos tener muchas cajas con nombres diferentes para guardar cosas distintas.