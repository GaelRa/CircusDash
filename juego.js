class Juego extends Phaser.Scene {

    constructor() {
        super("Juego");
    }

    create() {
        this.muerto = false; // RESETEAR ESTADO

        let ancho = this.scale.width;
        let alto = this.scale.height;
        // Fondo
        /*this.cameras.main.setBackgroundColor('#1a1a2e');*/
        let fondo = this.fondo = this.add.tileSprite(0, 0, ancho, alto, "fondo");
        fondo.setAlpha(0.4);
        this.fondo.setOrigin(0, 0);

        this.plataformas = this.physics.add.group();
        
        // Suelo base ya lo tienes

        // Plataformas elevadas
        this.plataformas.create(400, alto - 150, "plataforma").setScale(0.5).refreshBody();
        this.plataformas.create(650, alto - 250, "plataforma").setScale(0.5).refreshBody();
        this.plataformas.create(900, alto - 180, "plataforma").setScale(0.5).refreshBody();
        this.plataformas.create(1200, alto - 300, "plataforma").setScale(0.5).refreshBody();


        // Crear el objeto de audio
        this.musicaNivel = this.sound.add("musica", {
            loop: true,   // Para que se repita si el nivel es largo
            volume: 0.5   // Volumen del 0 al 1
        });

        // Reproducir la música
        this.musicaNivel.play();

        // SUELO
        this.suelo = this.physics.add.staticGroup();
        this.suelo.create(ancho/2, alto - 20, "suelo")
            .setDisplaySize(ancho, 40)
            .refreshBody();
        
        // Variables de distancia
        this.distancia = 0;
        this.record = localStorage.getItem("record_maximo") || 0;

        // Texto en pantalla
        this.textoDistancia = this.add.text(20, 20, "Distancia: 0m", {
            fontSize: "24px",
            fill: "#ffffff",
            fontFamily: "Arial"
        });

        this.textoRecord = this.add.text(20, 50, "Récord: " + this.record + "m", {
            fontSize: "18px",
            fill: "#ffff00",
            fontFamily: "Arial"
        });

            // JUGADOR
        this.jugador = this.physics.add.sprite(150, alto - 100, "cubo");
        this.jugador.setDisplaySize(40, 40);
        this.jugador.setCollideWorldBounds(true);
        this.jugador.setGravityY(900); // Más gravedad para caída rápida
        //this.jugador.body.setSize(30, 30); // Hitbox un poco más pequeña que el arte (perdona errores)
        this.jugador.setTintFill(0xffffff);

        //fisicas de plataformas
            this.physics.add.collider(this.jugador, this.plataformas);
        
        this.physics.add.collider(this.jugador, this.suelo);

        this.sueloEfecto = this.add.tileSprite(0, alto - 40, ancho, 40, "suelo");
        this.sueloEfecto.setOrigin(0, 0);
        
        // GRUPO DE SPIKES
        this.spikes = this.physics.add.group();

        // Colisión con spikes
        this.physics.add.overlap(this.jugador, this.spikes, this.morir, null, this);
        this.crearSpikeConDelay();
        this.crearSpikeLoop();
        this.sueloY = this.suelo.children.entries[0].y;

        this.ultimoSpike = 0;
        this.cooldownSpike = 900;

        // GENERADOR DE SPIKES
        this.time.addEvent({
            delay: 1500,
            callback: this.crearSpike,
            callbackScope: this,
            loop: true
        });
        
        this.time.addEvent({
        delay: 2000,
        callback: this.crearPlataforma,
        callbackScope: this,
        loop: true
        });


        // CONTROLES
        this.input.keyboard.on("keydown-SPACE", this.saltar, this);
        this.input.on("pointerdown", this.saltar, this);

    }

   crearPlataforma() {
        let ancho = this.scale.width;
        let alto = this.scale.height;

        let alturaRandom = Phaser.Math.Between(alto - 180, alto - 120);

        let plataforma = this.plataformas.create(ancho + 100, alturaRandom, "plataforma");

        plataforma.setScale(0.5);

        // 🔥 HITBOX MÁS GRANDE
        plataforma.body.setSize(
            plataforma.displayWidth + 50,
            plataforma.displayHeight + 25
        );

        plataforma.body.setOffset(
            -5,
            -1
        );

        plataforma.setImmovable(true);
        plataforma.body.setAllowGravity(false);
    }
    crearSpike() {

    let tiempo = this.time.now;

    // ❌ si no ha pasado suficiente tiempo, no crea spike
    if (tiempo - this.ultimoSpike < this.cooldownSpike) {
        return;
    }

    this.ultimoSpike = tiempo;

    let ancho = this.scale.width;

    let spike = this.spikes.create(ancho + 50, this.sueloY - 30, "spike");
    spike.setDisplaySize(40, 40);

    spike.setSize(20, 25);
    spike.setOffset(10, 15);

    let velocidad = Phaser.Math.Between(300, 500);
    spike.setVelocityX(-velocidad);

    spike.body.setAllowGravity(false);
    }

    crearSpikeLoop() {
        this.crearSpike();

        let delay = Phaser.Math.Between(800, 2000);

        this.time.delayedCall(delay, this.crearSpikeLoop, [], this);
    }

    crearSpikeConDelay() {
    this.crearSpike();

    let nuevoDelay = Phaser.Math.Between(800, 2000);

    this.time.delayedCall(nuevoDelay, this.crearSpikeConDelay, [], this);
    }

    saltar() {
    if (this.muerto) return;

    if (this.jugador.body.touching.down) {
        this.sound.play("salto_fx", { volume: 0.3 }); // Reproduce efecto corto
        this.jugador.setVelocityY(-500);

        // Animar rotación
        this.tweens.add({
            targets: this.jugador,
            angle: this.jugador.angle + 90,
            duration: 400, // Ajusta según la fuerza del salto
            ease: "Power1"
             });
        }
    }

   morir() {
    if (this.muerto) return;
    this.muerto = true;

    // --- LÓGICA DE GUARDADO ---
    let distanciaFinal = Math.floor(this.distancia);
    if (distanciaFinal > this.record) {
        this.record = distanciaFinal;
        localStorage.setItem("record_maximo", this.record);
    }

    // 1. Detener música y sonidos
    this.musicaNivel.stop();
    this.sound.play("sonido_muerte", { volume: 0.6 });

    // 2. Efectos visuales de cámara
    this.cameras.main.shake(300, 0.02); // Sacudida un poco más fuerte
    this.cameras.main.flash(200, 255, 255, 255); // Flash blanco puro

    // 3. Ocultar al jugador y detenerlo
    this.jugador.setVelocity(0);
    this.jugador.setVisible(false);

    // 4. EXPLOSIÓN DE PARTÍCULAS MEJORADA
    const explosion = this.add.particles(0, 0, "cubo", {
        x: this.jugador.x,
        y: this.jugador.y,
        speed: { min: 200, max: 400 }, // Salen rápido
        angle: { min: 0, max: 360 },   // En todas las direcciones
        scale: { start: 0.4, end: 0 }, // Se encogen hasta desaparecer
        rotate: { min: 0, max: 360 },  // Los pedazos giran mientras vuelan
        lifespan: 700,                 // Duran casi un segundo
        quantity: 25,                  // Cantidad de trozos
        blendMode: 'SCREEN'            // Hace que brillen un poco
    });

    // 5. Reiniciar nivel tras un pequeño delay
    this.time.delayedCall(1000, () => {
        this.scene.restart();
    });
}

    update() {

        if (this.muerto) return;
    this.plataformas.children.each(plataforma => {
    plataforma.x -= 4;
    plataforma.body.updateFromGameObject();
    plataforma.refreshBody();

    if (plataforma.x < -100) {
        plataforma.destroy();
    }
    });
    // Movimiento de la textura del fondo (lento)
    this.fondo.tilePositionX += 2;

    // Aumentar distancia (puedes ajustar el 0.1 para que suba más rápido o lento)
    this.distancia += 0.2; 
    let distanciaRedondeada = Math.floor(this.distancia);
    this.textoDistancia.setText("Distancia: " + distanciaRedondeada + "m");

    // Si tienes un tileSprite para el suelo, muévelo más rápido
    // esto crea la ilusión de que el jugador corre sobre él
    //this.sueloEfecto.tilePositionX += 5; 

    this.sueloEfecto.tilePositionX += 5;
    // Limpieza: Eliminar obstáculos que ya pasaron al jugador
    this.spikes.children.each(spike => {
        if (spike.x < -50) {
            spike.destroy();
        }
    });
    }
}