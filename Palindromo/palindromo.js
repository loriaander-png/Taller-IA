//ejercicio de palindromos
//objetivo de crear una alogica completa encapsulada en una funcion 
//un palindromo es una palabra o frase que se lee igual de izquierda a derecha que de derecha a izquierda
//ejemplos de palindromos: "anita lava la tina", "reconocer", "la ruta natural"
//crea una funcion llamada esPalindromo que reciba un texto y retorne true si es un palindromo o false si no lo es
function esPalindromo(texto) {
    // Validar que la entrada sea una cadena de texto
    if (typeof texto !== 'string') {
        throw new Error('Debes ingresar una cadena de texto válida');
    }
    
    // Convertir a minúsculas y eliminar espacios y caracteres especiales
    const textoLimpio = texto.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Invertir el texto
    const textoInvertido = textoLimpio.split('').reverse().join('');
    
    // Comparar el texto limpio con su inverso
    return textoLimpio === textoInvertido;
}