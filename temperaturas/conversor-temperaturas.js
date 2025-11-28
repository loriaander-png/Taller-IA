// Función para convertir temperaturas desde Celsius
// Parámetro: celsius (número)
// Retorna: objeto con las conversiones a Fahrenheit y Kelvin

function convertirTemperatura(celsius) {
  // Validar que el entrada sea un número válido
  if (typeof celsius !== 'number' || isNaN(celsius)) {
    throw new Error('Debes ingresar un número válido');
  }

  // Convertir de Celsius a Fahrenheit
  // Fórmula: (C × 9/5) + 32
  const fahrenheit = (celsius * 9 / 5) + 32;

  // Convertir de Celsius a Kelvin
  // Fórmula: C + 273.15
  const kelvin = celsius + 273.15;

  // Retornar un objeto con los resultados redondeados a 2 decimales
  return {
    celsius: Math.round(celsius * 100) / 100,
    fahrenheit: Math.round(fahrenheit * 100) / 100,
    kelvin: Math.round(kelvin * 100) / 100
  };
}

// ============= EJEMPLOS DE USO =============

// Ejemplo 1: Conversión de 0°C (punto de congelación del agua)
console.log('0°C:', convertirTemperatura(0));
// Resultado: { celsius: 0, fahrenheit: 32, kelvin: 273.15 }

// Ejemplo 2: Conversión de 100°C (punto de ebullición del agua)
console.log('100°C:', convertirTemperatura(100));
// Resultado: { celsius: 100, fahrenheit: 212, kelvin: 373.15 }

// Ejemplo 3: Conversión de 25°C (temperatura ambiente)
console.log('25°C:', convertirTemperatura(25));
// Resultado: { celsius: 25, fahrenheit: 77, kelvin: 298.15 }

// Ejemplo 4: Conversión de -40°C (donde Celsius y Fahrenheit coinciden)
console.log('-40°C:', convertirTemperatura(-40));
// Resultado: { celsius: -40, fahrenheit: -40, kelvin: 233.15 }

// Ejemplo 5: Manejo de errores
try {
  convertirTemperatura('texto'); // Esto lanzará un error
} catch (error) {
  console.error('Error:', error.message);
}
