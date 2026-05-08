class Carga extends Phaser.Scene {

    constructor(){
        super("Carga");
    }

    preload(){

        let ancho = this.scale.width;
        let alto = this.scale.height;

        // Logo
        let logo = this.add.image(ancho/2, alto/2 - 150, "logo");
        logo.setScale(0.5);

        // Texto
        let texto = this.add.text(ancho/2, alto/2 - 60, "Cargando...", {
            fontSize: "30px",
            fill: "#ffffff",
            fontStyle: "bold"
        }).setOrigin(0.5);

        // Barra fondo
        let barraFondo = this.add.rectangle(ancho/2, alto/2, 300, 30, 0xffffff, 0.3);

        // Barra progreso
        let barra = this.add.rectangle(ancho/2 - 150, alto/2, 0, 30, 0xffffff).setOrigin(0, 0.5);

        this.load.on("progress", (value) => {
            barra.width = 300 * value;
        });

        // Assets del juego
        this.load.image("fondo", "./Fondo1.png");
        this.load.image("cubo", "./Bubble2.png");
        this.load.image("spike", "./obstaculos.png");
        this.load.image("spike2", "./obstaculo2.png");
        this.load.image("suelo", "./Piso.png");
        this.load.image("play", "./botonplay.png");

        this.load.image("fondo_inicio", "./fondete.jpg");
        this.load.audio("musica", "./Juego.mp3");
        this.load.audio("salto_fx", "./salto.mp3");
        this.load.audio("sonido_muerte", "./explosion.mp3");

        this.load.image("plataforma", "./Plataforma.png");

        // Simular carga
        for(let i = 0; i < 30; i++){
            this.load.image("fake" + i, "./Bubble2.png");
        }
        // Nos ayuda a que la barra no carga instantaneamente
        // Nos da mas tiempo de mostrar animaciones/logo
    }

    create(){
        this.time.delayedCall(1000, () => {
            this.scene.start("Inicio");
        });
    }
}