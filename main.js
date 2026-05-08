const config = {
    type: Phaser.AUTO,
    width: 1280, // Resolución base (puedes dejar esta)
    height: 720,
   scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        forceOrientation: true, // Fuerza una orientación
        orientation: Phaser.Scale.Orientation.LANDSCAPE // Pide modo horizontal
    },
    // IMPORTANTE: Para móviles, añade esto para que el audio funcione tras el primer toque
    input: {
        activePointers: 3 
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false // Cámbialo a false para la versión final
        }
    },
    scene: [Boot, Carga, Inicio, Juego]
};

window.onload = function(){ // Funciona como un evento 
    new Phaser.Game(config); //Cuando la pagina termine de cagar completamente inicia el juego, aranca phaser y carga el sistema de escenas
}
