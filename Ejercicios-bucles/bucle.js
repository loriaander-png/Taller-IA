//ejercicio arrays objeto 
//1.arrays (listas)
//crea una lista de tus 3 comidas favoritas
let comidasFavoritas = ["Pizza", "Sushi", "Tacos"];
// como agrego un elemento array en js
comidasFavoritas.push("Helado");
//muestrame la lista en consola
console.log(comidasFavoritas);

//2.Objetos (diccionarios/fichas)
//crea un objeto que represente a una persona con las siguientes propiedades: nombre, edad, si te gusta programar
let persona = {
    nombre: "Ander",
    edad: 18,
    gustaProgramar: true,
    habilidades: ["Clashito, FriGod"],
    estatura: 1.67

};
// Pídele a la IA: "Cómo accedo a la propiedad nombre de mi objeto alumno?"
console.log(persona.nombre);
console.log(persona.edad);
console.log(persona.gustaProgramar);
console.log(persona.habilidades);
console.log(persona.estatura);

//crea una lista de 3 alumnos (objetos) con nombre y calificacion
let alumnos = [
    { nombre: "Ana", calificacion: 50 },
    { nombre: "Luis", calificacion: 80 },
    { nombre: "Maria", calificacion: 100 }
];
//muestra la lista de alumnos en consola
console.log(alumnos);
alumnos.forEach(function(alumno) {
    console.log("Nombre: " + alumno.nombre + ", Calificación: " + alumno.calificacion);
}); 

//escribir un bucle que recorra el array de alumnos e imprima solo los que aprobaron (calificacion >= 80)
for (let i = 0; i < alumnos.length; i++) {
    if (alumnos[i].calificacion >= 6) {
        console.log(alumnos[i].nombre + " aprobó con calificación: " + alumnos[i].calificacion);
    }
}
