//ejercicios: area y volumenes 
// objetivo: crear multiples funciones y reutilizables 
//crea una funcion para calcular el area de un circulo dado su radio
// Calcula el área de un círculo dado su radio
// Utiliza la fórmula: A = π * r²
function areaCirculo(radio) {
    // Valida que el radio sea un número positivo
    if (typeof radio !== 'number' || radio < 0) {
        throw new Error('El radio debe ser un número positivo');
    }
    // Retorna el área usando Math.PI y Math.pow para elevar al cuadrado
    return Math.PI * Math.pow(radio, 2);
}

// Ejemplo de uso:
// const area = areaCirculo(5);
// console.log(area); // Output: 78.53981633974483
//crea una funcion para calcular el area de un rectangulo dado su base y altura
/**
 * Calcula el área de un rectángulo multiplicando la base por la altura.
 * 
 * @param {number} base - La base del rectángulo en unidades. Debe ser un número positivo.
 * @param {number} altura - La altura del rectángulo en unidades. Debe ser un número positivo.
 * 
 * @returns {number} El área del rectángulo (base × altura).
 * 
 * @throws {Error} Si base o altura no son números o si alguno es negativo.
 * 
 * @example
 * // Calcula el área de un rectángulo de base 5 y altura 3
 * const area = areaRectangulo(5, 3);
 * console.log(area); // Output: 15
 * 
 * @example
 * // Lanza un error si se proporcionan valores inválidos
 * try {
 *   areaRectangulo(-5, 3); // Error: La base y la altura deben ser números positivos
 * } catch (e) {
 *   console.log(e.message);
 * }
 */
function areaRectangulo(base, altura) {
    if (typeof base !== 'number' || typeof altura !== 'number' || base < 0 || altura < 0) {
        throw new Error('La base y la altura deben ser números positivos');
    }
    return base * altura;
}
//crea una funcion para calcular el volumen de un cilindro 
//crea la funcion calcularVolumenCilindro reutilizando la funcion areaCirculo
/**
 * Calcula el volumen de un cilindro.
 * 
 * @param {number} radio - El radio de la base del cilindro en unidades de longitud
 * @param {number} altura - La altura del cilindro en unidades de longitud (debe ser positivo)
 * @returns {number} El volumen del cilindro calculado como área de la base × altura
 * @throws {Error} Si la altura no es un número o es negativa
 * 
 * @example
 * // Ejemplo: Cilindro con radio 5 y altura 10
 * const volumen = volumenCilindro(5, 10);
 * console.log(volumen); // Resultado: 785.3981633974483 (aproximadamente)
 */
function volumenCilindro(radio, altura) {
    if (typeof altura !== 'number' || altura < 0) {
        throw new Error('La altura debe ser un número positivo');
    }
    const areaBase = areaCirculo(radio);
    return areaBase * altura;
}
// crea una funcion para calcular una derivada simple de una funcion polinomia de grado n
function derivadaPolinomio(coeficientes) {

    if (!Array.isArray(coeficientes) || !coeficientes.every(c => typeof c === 'number')) {
        throw new Error('Los coeficientes deben ser un array de números');
    }

    const derivada = coeficientes.map((c, i) => c * i).slice(1);
    return derivada;
}