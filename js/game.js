/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var game = new Phaser.Game(
        800, 800, Phaser.AUTO, 'gameDiv',
        {preload: preload, create: create, update: update}
);

var vecReference = new Phaser.Point(0, 0);
var ahead, ahead2;
var jugador, jugador2, enemies, cadaveres, text, ciclos = 0, rivales = 10, rivalesM = 0, radio = 50;
var limInf = 1, limSup= 4;
var nodes = new Array(limSup + 1);
var mujer = new Array(5);
var musiquinia = true;
var sonido;
var vida;
// Loop for each major number (each row in the table)
mujer[1] = new Phaser.Point(0, 400);
mujer[2] = new Phaser.Point(0,600);
mujer[3] = new Phaser.Point(200, 600);
mujer[4] = new Phaser.Point(200, 400);
// Create the columns in the table
nodes[1] = new Phaser.Point(50, 50);
nodes[2] = new Phaser.Point(750, 50);
nodes[4] = new Phaser.Point(50, 750);
nodes[3] = new Phaser.Point(750, 750);

//nodes[5] = new Phaser.Point(400, 600);
//nodes[6] = new Phaser.Point(500, 500);
//nodes[7] = new Phaser.Point(600, 400);
//nodes[8] = new Phaser.Point(500, 300);
//nodes[9] = new Phaser.Point(700, 350);
//nodes[10] = new Phaser.Point(750, 50);
//for (var i = 1; i < 11; i++) {
//    nodes[i] = new Phaser.Point(Math.random()*800, Math.random()*800);
//}
// Fill the row with the results of the multiplication




function preload() {
    
    game.load.spritesheet('tiles', 'assets/images/tiles.png', 16, 16);
    game.load.spritesheet('characters', 'assets/images/characters.png', 16, 16);
    game.load.audio('damas', 'assets/musica/fasito.mp3');
    this.load.spritesheet('dead', 'assets/images/dead.png', 16, 16);
    game.load.bitmapFont('carrier_command', 'font/carrier_command.png', 'font/carrier_command.xml');

}

function rotar(enemy) {

    // Left
    if (enemy.body.velocity.x < 0 && enemy.body.velocity.x <= -Math.abs(enemy.body.velocity.y)) {
        enemy.animations.play('left');

        // Right
    } else if (enemy.body.velocity.x > 0 && enemy.body.velocity.x >= Math.abs(enemy.body.velocity.y)) {
        enemy.animations.play('right');

        // Up
    } else if (enemy.body.velocity.y < 0 && enemy.body.velocity.y <= -Math.abs(enemy.body.velocity.x)) {
        enemy.animations.play('up');

        // Down
    } else {
        enemy.animations.play('down');
    }
}

function create() {
    game.stage.backgroundColor = '#fff';
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var tamMundo = 800;
    game.world.setBounds(0, 0, tamMundo, tamMundo);
    //carga sprite de fondo
    background = this.game.add.tileSprite(0, 0, this.game.world.width / 2, this.game.world.height / 2, 'tiles', 1);
    background.scale.setTo(2);
    vida = game.add.bitmapText(10,10,'carrier_command',"",10);

// scoreText=game.add.bitmapText(16, 16, 'fuente', 'score: 0', 15);
    vida.fixedToCamera=true;
    vida.inputEnabled=true;
//    scoreText.input.enableDrag();


    //genera el jugador
    generarJugador();
    generarMujer();
    //genero enemigos
    generarNPC(rivales);
    //prueba
 //   generarMov();
    //genero el arreglo de muertos
    cadaveres = this.game.add.group();

    cursors = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
        //spell: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };
    music = {plai: this.game.input.keyboard.addKey(Phaser.Keyboard.O),
    stopp: this.game.input.keyboard.addKey(Phaser.Keyboard.P)};
    sonido = game.add.audio('damas');
    sonido.play();
    
}

function update() {
    ciclos++;
  
    vidarestante();
    daleMusi();
    moverJugador();
    moverMujer();
    moverEnemigos();
    if (rivalesM === rivales) {
        game.time.events.add(1000, ganador(), this);
    }
    colisiones();

}

function vidarestante(){
    //vida  = game.add.bitmapText(10, 10, 'carrier_command', "", 10);
    vida.text = "Vida Actual: "+jugador.vitality;
    
    //vida.inputEnabled = true;
}
function daleMusi(){
    if (music.plai.isDown && !musiquinia) {
        musiquinia=true;
        sonido.resume();
    } else if (music.stopp.isDown && musiquinia){
        sonido.pause();
        musiquinia=false;
    }
}
function colisiones() {
    game.physics.arcade.collide(enemies, jugador, enemigosAtacando, null, this);
    game.physics.arcade.collide(jugador2,jugador, pareja, null, this);
}

function enemigosAtacando(jugador, enemy) {
    jugador.vitality = jugador.vitality - 5;
    enemy.deadTime = enemy.deadTime + 5;
    if (jugador.vitality <= 0) {
        jugador.alive = false;
    }
}

function pareja(jugador, jugador2){
    
}

function moverMujer(){
    if(jugador.alive){
    var objetivo = jugador.position;
    var tipo =distance(jugador2.position, objetivo)>150;
    if(tipo){
        pathMujer(jugador2);
        objetivo = mujer[jugador2.contador];
    }
        var vectorDesired;
  //     vectorDesired = calcularDesiredVelocity(enemy, objetivo);
    if(tipo){
        vectorDesired = calcularDesiredVelocity(jugador2, objetivo);
    }else{
        vectorDesired = fleeDesiredVelocity(jugador2, objetivo);
    }
 //       ahead = calcularHead(enemy, vectorDesired);
 //       var pepe = collisionAvoidance(enemy);
 //       vectorDesired = new Phaser.Point(pepe.x, pepe.y);
        //Obtengo el vector de fuerza
        var vectorSteeringForce;
        vectorSteeringForce = calcularSteeringForce(jugador2, vectorDesired);

        //aplico el vector de fuerza al vehiculo

        aplicarVectorDeFuerza(jugador2, vectorSteeringForce);

        rotar(jugador2);
    
    }else{
        matarEntidad(jugador2);
    }
}

function moverEnemigos() {

    enemies.forEachAlive(function seek(enemy) {
        var objetivo = jugador.position;
        
            enemy.deadTime--;
            if (enemy.deadTime == 0) {
                rivalesM = rivalesM + 1;
                //matarEntidad(enemy);
                enemy.alive = false;
            }
            if (!enemy.bandera) {
                 
//            pathFollowingIdaVuelta(enemy);
           pathFollowing(enemy);
//            console.log(' console enemigo cont ' + enemy.contador)
            objetivo = nodes[enemy.contador];
        }
        var vectorDesired;
        vectorDesired = calcularDesiredVelocity(enemy, objetivo);
 //       vectorDesired = fleeDesiredVelocity(enemy, objetivo);
 //       ahead = calcularHead(enemy, vectorDesired);
 //       var pepe = collisionAvoidance(enemy);
 //       vectorDesired = new Phaser.Point(pepe.x, pepe.y);
        //Obtengo el vector de fuerza
        var vectorSteeringForce;
        vectorSteeringForce = calcularSteeringForce(enemy, vectorDesired);

        //aplico el vector de fuerza al vehiculo

        aplicarVectorDeFuerza(enemy, vectorSteeringForce);

        rotar(enemy);


    }, this);
    this.enemies.forEachDead(function (enemy) {
        matarEntidad(enemy);
    }, this);

}

function calcularDesiredVelocity(enemy, objetivo) {
    // Calculo el vector deseado = normalizado(POSICION TARGET - POSICION VEHICULO) * maximaVelocidad

    var vectorDesired;
  //  console.log('objetivo en la mira '+ objetivo + ' pos rival ' + enemy.position);
    vectorDesired = ((Phaser.Point.subtract(objetivo, enemy.position)).normalize()).multiply(enemy.speed, enemy.speed);

    return vectorDesired;
}
function fleeDesiredVelocity(enemy, objetivo) {
    // Calculo el vector deseado = normalizado(POSICION TARGET - POSICION VEHICULO) * maximaVelocidad

    var vectorDesired;
  //  console.log('objetivo en la mira '+ objetivo + ' pos rival ' + enemy.position);
    vectorDesired = ((Phaser.Point.subtract(enemy.position, objetivo)).normalize()).multiply(enemy.speed, enemy.speed);

    return vectorDesired;
}

function calcularHead(enemy, vectorDesired){
    return Phaser.Point.add(enemy.position,vectorDesired)*100;
}
function calcularSteeringForce(enemy, vectorDesired) {

    //Calculo el vector de fueza = vector deseado - velocidad actual del vehiculo
//steering = steering / mass la masa como se calucula???

    var vectorSteeringForce;
    vectorSteeringForce = Phaser.Point.subtract(vectorDesired, enemy.body.velocity);

//limito la magnitud del vector, es decir la fuerza que se le va a aplicar
    if (vectorSteeringForce.getMagnitudeSq() > enemy.MAX_STEER_SQ) {
        vectorSteeringForce.setMagnitude(enemy.MAX_STEER);
    }
    return vectorSteeringForce;
}
function aplicarVectorDeFuerza(enemy, vectorSteeringForce) {

    //Calculo la nueva velocidad y posicion del vehiculo sumando la posicion con el vector de fuerza
    enemy.body.velocity.add(vectorSteeringForce.x, vectorSteeringForce.y);

    //si la velocidad nueva es mayor a la maxima velocidad determinada, se deja la maxima.
    if (enemy.body.velocity.getMagnitudeSq() > enemy.MAX_SPEED_SQ) {
        enemy.body.velocity.setMagnitude(enemy.MAX_SPEED);
    }
}

function moverJugador() {


    // Up-Left
    if (jugador.alive) {

        if (cursors.up.isDown && cursors.left.isDown) {
            jugador.body.velocity.x = -jugador.speed;
            jugador.body.velocity.y = -jugador.speed;
            jugador.animations.play('left');

            // Up-Right
        } else if (cursors.up.isDown && cursors.right.isDown) {
            jugador.body.velocity.x = jugador.speed;
            jugador.body.velocity.y = -jugador.speed;
            jugador.animations.play('right');

            // Down-Left
        } else if (cursors.down.isDown && cursors.left.isDown) {
            jugador.body.velocity.x = -jugador.speed;
            jugador.body.velocity.y = jugador.speed;
            jugador.animations.play('left');

            // Down-Right
        } else if (cursors.down.isDown && cursors.right.isDown) {
            jugador.body.velocity.x = jugador.speed;
            jugador.body.velocity.y = jugador.speed;
            jugador.animations.play('right');

            // Up
        } else if (cursors.up.isDown) {
            jugador.body.velocity.x = 0;
            jugador.body.velocity.y = -jugador.speed;
            jugador.animations.play('up');

            // Down
        } else if (cursors.down.isDown) {
            jugador.body.velocity.x = 0;
            jugador.body.velocity.y = jugador.speed;
            jugador.animations.play('down');

            // Left
        } else if (cursors.left.isDown) {
            jugador.body.velocity.x = -jugador.speed;
            jugador.body.velocity.y = 0;
            jugador.animations.play('left');

            // Right
        } else if (cursors.right.isDown) {
            jugador.body.velocity.x = jugador.speed;
            jugador.body.velocity.y = 0;
            jugador.animations.play('right');

            // Still
        }else{
            jugador.body.velocity.x = 0;
            jugador.body.velocity.y = 0;
            jugador.animations.stop();
        }
    } else {
        matarEntidad(this.jugador);
        game.time.events.add(1000, this.gameOver, this);
        

//            jugador.animations.stop();
//            jugador.body.velocity.x = 0;
//            jugador.body.velocity.y = 0;
    }
}

function generarJugador() {

    //crear jugador
    jugador = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'characters');
    //actualizo los sprites 3,4 y 5 cada 10 FPS y les aumento la escala para que se adapten al grid.
    jugador.animations.add('down', [3, 4, 5], 10, true);
    jugador.animations.add('left', [15, 16, 17], 10, true);
    jugador.animations.add('right', [27, 28, 29], 10, true);
    jugador.animations.add('up', [39, 40, 41], 10, true);
    jugador.animations.play('down');
    jugador.scale.setTo(2);
    //le cargo la fisica al jugador
    this.game.physics.arcade.enable(jugador);
    //defino parametros propios del jugador
    jugador.body.collideWorldBounds = true;
    jugador.alive = true;
    jugador.name = 'Dr. JQ';
    jugador.level = 1;
    jugador.health = 200;
    jugador.vitality = 200;
    jugador.strength = 25;
    jugador.speed = 100;
    jugador.invincibilityFrames = 500;
    jugador.invincibilityTime = 0;
    jugador.corpseSprite = 1;

    jugador.body.immovable = true;

    return jugador;
}

function generarNPC(cantidad) {
    enemies = this.game.add.group();
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i = 0; i < cantidad; i++) {
        this.generarEnemigo();
    }
    
}

function generarEnemigo() {

    enemy = this.enemies.create(this.game.world.randomX, this.game.world.randomY, 'characters');
    var rnd = Math.random();
    if (rnd >= 0 && rnd < .3)
        enemy = this.generarEsqueleto(enemy);
    else if (rnd >= .3 && rnd < .5)
        enemy = this.generarMurcielago(enemy);
          else if (rnd >= .5 && rnd < .7) enemy = this.generarFantasma(enemy);
             else if (rnd >= .7 && rnd < 1) enemy = this.generarAraña(enemy);
    console.log('Se genero un ' + enemy.name);
//        enemy.body.immovable = true;
    return enemy;
}



function generarEsqueleto(enemy) {
    enemy.animations.add('down', [9, 10, 11], 10, true);
    enemy.animations.add('left', [21, 22, 23], 10, true);
    enemy.animations.add('right', [33, 34, 35], 10, true);
    enemy.animations.add('up', [45, 46, 47], 10, true);
    return setStats(enemy, 'Esqueleto', 100, 70, 20, 5, 6, Math.floor((Math.random() * 1500)));
}

function generarMurcielago(enemy) {
    enemy.animations.add('down', [51, 52, 53], 10, true);
    enemy.animations.add('left', [63, 64, 65], 10, true);
    enemy.animations.add('right', [75, 76, 77], 10, true);
    enemy.animations.add('up', [87, 88, 89], 10, true);
    return setStats(enemy, 'Bat', 20, 100, 10, 2, 8, Math.floor((Math.random() * 1500)));
}

function generarFantasma(enemy) {
    enemy.animations.add('down', [54, 55, 56], 10, true);
    enemy.animations.add('left', [66, 67, 68], 10, true);
    enemy.animations.add('right', [78, 79, 80], 10, true);
    enemy.animations.add('up', [90, 91, 92], 10, true);
    return setStats(enemy, 'Ghost', 150, 60, 30, 7, 9, Math.floor((Math.random() * 1500)));
}

 function generarAraña(enemy) {
 enemy.animations.add('down', [57, 58, 59], 10, true);
 enemy.animations.add('left', [69, 70, 71], 10, true);
 enemy.animations.add('right', [81, 82, 83], 10, true);
 enemy.animations.add('up', [93, 94, 95], 10, true);
 return setStats(enemy, 'Spider', 50, 120, 12, 4, 10, Math.floor((Math.random() * 7000)));
 }
 
function generarMujer(enemy){
    jugador2 = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'characters');
    jugador2.animations.add('down', [6, 7, 8], 10, true);
    jugador2.animations.add('left', [18, 19, 20], 10, true);
    jugador2.animations.add('right', [30, 31, 32], 10, true);
    jugador2.animations.add('up', [42, 43, 44], 10, true);
    jugador2.animations.play('down');


    jugador2.scale.setTo(2);
    this.game.physics.arcade.enable(jugador2);
    jugador2.body.collideWorldBounds = true;
    jugador2.alive = true;
    jugador2.name = 'Mariana';
    jugador2.level = 1;
    jugador2.contador=1;
    jugador2.health = 200;
    jugador2.vitality = 200;
    jugador2.strength = 25;
    jugador2.speed = 50;
    jugador2.invincibilityFrames = 500;
    jugador2.invincibilityTime = 0;
    jugador2.corpseSprite = 5;

    jugador2.body.immovable = false;

    return jugador2;
}

function setStats(entity, name, health, speed, strength, reward, corpseSprite, deadTime) {

    entity.animations.play('down');
    entity.scale.setTo(2);


    entity.body.collideWorldBounds = true;
    entity.body.velocity.x = 0;
    entity.body.velocity.y = 0;
    entity.alive = true;
    entity.direccion = 1;
    entity.name = name;
    entity.deadTime = deadTime;
    entity.contador = limInf;
    entity.level = this.jugador.level;
    entity.health = health + (entity.level * 2);
    entity.speed = speed + Math.floor(entity.level * 1.5);
    entity.strength = strength + Math.floor(entity.level * 1.5);
    entity.reward = reward + Math.floor(entity.level * 1.5);
    var rnd = Math.random();
    if(rnd <0.5){
    entity.bandera= true;    
    }else{
    entity.bandera= false;
    }
    entity.invincibilityFrames = 300;
    entity.invincibilityTime = 0;

    entity.corpseSprite = corpseSprite;

    return entity;
}

function matarEntidad(entidad) {
    var corpse = cadaveres.create(entidad.x, entidad.y, 'dead');
    corpse.scale.setTo(2);
    corpse.animations.add('idle', [entidad.corpseSprite], 0, true);
    corpse.animations.play('idle');
    entidad.destroy();
    //  enemies.destroy();
}

function gameOver() {

    text = game.add.bitmapText(75, 400, 'carrier_command', ' Game Over', 50);
    enemies.destroy();
    //jugador2.destroy();
    text.inputEnabled = true;
}

function ganador() {
    text = game.add.bitmapText(75, 400, 'carrier_command', "You Win", 50);
    text.inputEnabled = true;
}

function pathFollowing(entity) {
    var target = nodes[entity.contador];
    if (distance(entity.position, target) <= radio) {
        entity.contador++;
        if (entity.contador > limSup) {
            entity.contador = limInf;
        }
    }
}
function pathMujer(entity) {
    var target = mujer[entity.contador];
    if (distance(entity.position, target) <= radio) {
        entity.contador++;
        if (entity.contador > 4) {
            entity.contador = 1;
        }
    }
}
function pathFollowingIdaVuelta(entity) {
    var target = nodes[entity.contador];
    if (distance(entity.position, target) <= radio) {
        entity.contador += entity.direccion ;
        if (entity.contador > limSup || entity.contador < limInf) {
            entity.direccion *= -1;
            entity.contador += entity.direccion;
        }
    }
}
function distance(a, b) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) + (a.y - b.y));
}

 function collisionAvoidance(entity)  {
    ahead2 = ahead/2;
 
    var mostThreatening = findMostThreateningObstacle();
    var avoidance = new Phaser.Point(50,350);;
 
    if (mostThreatening != null) {
        avoidance.x = ahead.x - mostThreatening.center.x;
        avoidance.y = ahead.y - mostThreatening.center.y;
 
        avoidance.normalize();
        avoidance.multiply(5,5);
    } else {
        avoidance.multiply(0,0); // nullify the avoidance force
    }
 
    return avoidance;
}
 
function findMostThreateningObstacle() {
    var mostThreatening = null;
 
 //   for (var i = 0; i < Game.instance.obstacles.length; i++) {
 //       var obstacle  = Game.instance.obstacles[i];
        var obstacle = new Phaser.Point(50,350);
        var collision = lineIntersectsCircle(ahead, ahead2, obstacle);
 
        // "position" is the character's current position
        if (collision && (mostThreatening == null || distance(entity.position, obstacle) < distance(entity.position, mostThreatening))) {
            mostThreatening = obstacle;
        }
  //  }
    return mostThreatening;
}

function lineIntersectsCircle(ahead , ahead2, obstacle ) {
    // the property "center" of the obstacle is a Vector3D.
    return distance(obstacle, ahead) <= 50 || distance(obstacle, ahead2) <= 50;
}