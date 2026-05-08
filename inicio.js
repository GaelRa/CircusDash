class Inicio extends Phaser.Scene {

    constructor(){
        super("Inicio");
    }

    create(){

        let ancho = this.scale.width;
        let alto = this.scale.height;

        // Fondo con imagen
        let fondo = this.add.image(ancho/2, alto/2, "fondo_inicio");

        // Ajustar a pantalla
        fondo.setDisplaySize(ancho, alto);

        // (Opcional) bajar un poco brillo para que el texto resalte
        fondo.setAlpha(0.8);

        // Título
        let titulo = this.add.text(ancho/2, alto/2 + 210, "Circus Dash", {
            fontSize: "40px",
            fill: "#01ffea",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Animación del título
        this.tweens.add({
            targets: titulo,
            scale: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // Botón con imagen
        let boton = this.add.image(ancho/2, alto/2 + 300, "play")
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });
        // Ajustar tamaño si hace falta
        boton.setScale(0.2);

        // Hover
        boton.on("pointerover", () => boton.setScale(0.3));
        boton.on("pointerout", () => boton.setScale(0.2));

        // Iniciar juego
        boton.on("pointerdown", () => {
            this.scene.start("Juego");
        });

        // Instrucciones
        this.add.text(ancho/2, alto/2 + 380,
            "Toca la pantalla o presiona espacio para saltar",
            { fontSize: "30px", fill: "#00d9ff", fontStyle: "bold"}
        ).setOrigin(0.5);
    }
}