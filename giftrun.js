SKY_COLOR = '#b4b4ff';  // Cor do céu
NUM_SNOWFLAKES = 10;  // Número de flocos de neve

image_names = ['reindeer1',
               'reindeer2',
               'rudolph1',
               'rudolph2',
               'santa1',
               'santa2',
               'santa3',
               'chimney',
               'gift',
               'splat',
               'star',
               'smoke1',
               'smoke2',
               'poof',
               'snowflake'];

sound_names = ['plingeling',
               'poof',
               'whistle',
               'splat'];

images = {};
sounds = {};

move_left = false;
move_right = false;
move_up = false;
move_down = false;
move_drop = false;

play_sounds = true;
play_music = false;

// Classe de vetor 2D (muito básica)
// Usada para posições e movimento.
function Vec2(x, y) {
    this.x = x;
    this.y = y;

    this.add = function(other) {
        this.x += other.x;
        this.y += other.y;
    };

    this.copy = function() {
        return new Vec2(this.x, this.y);
    };
}

function vec(x, y) {
    return new Vec2(x, y);
}

// Chama a função para cada elemento no array
// e remove-o se a função retornar verdadeiro.
// A lista é iterada na ordem inversa.
function removeif(arr, func) {
    for(var i = arr.length - 1; i >= 0; i--) {
        if(func(arr[i])) {
            arr.splice(i, 1);
        }
    }
}

// Chama a função para cada item na lista
function iter(arr, func) {
    for(var i = 0; i < arr.length; i++) {
        func(arr[i]);
    }
}

function randint(high) {
    return Math.floor(Math.random() * high);
}

function randrange(low, high) {
    return low + Math.floor(Math.random() * high);
}

function Sprite(pos, motion, image) {
    this.pos = pos;
    this.motion = motion;
    this.image = image;

    this.move = function(speed) {
        this.pos.x += speed;
        this.pos.add(this.motion);
    };

    this.draw = function() {
        ctx.drawImage(images[this.image], this.pos.x, this.pos.y);
    };
}

function House(pos, motion, image) {
    this.superClass = Sprite;
    this.superClass(pos, motion, image);
    this.smoking = (randint(4) == 0);  // 1 em 4 casas solta fumaça
}

// Rena ou Papai Noel
function Character(pos, motion, image) {
    this.superClass = Sprite;
    this.superClass(pos, motion, image);

    this.move = function(speed) {
        // Personagens não se movem dessa forma
    };
}

function Santa(pos, motion, image) {
    this.superClass = Sprite;
    this.superClass(pos, motion, image);
}

function Gift(pos, motion, image) {
    this.superClass = Sprite;
    this.superClass(pos, motion, image);

    this.move = function(speed) {
        this.motion.y += 0.5;
        this.pos.x += speed;
        this.pos.add(this.motion);
    };
}

function load_data(onload) {
    var remaining = image_names.length + sound_names.length;
    var onload = function() {
        remaining -= 1;
        if(remaining == 0) {
            onload();
        }
    };

    for(i in image_names) {
        var name = image_names[i];
        var img = new Image();
        img.onload = onload;
        img.src = "images/" + name + ".png";
        images[name] = img;
    }

    for(i in sound_names) {
        var name = sound_names[i];
        var snd = new Audio();
        snd.onload = onload;
        snd.src = "sounds/" + name + ".wav";
        snd.load();
        sounds[name] = snd;
    }
}

whistle_sound = null;

function play_sound(name) {
    if(play_sounds) {
        // Parar o som do apito se estiver tocando
        if(whistle_sound) {
            whistle_sound.pause();
            delete whistle_sound;
            whistle_sound = null;
        }

        if(sounds[name]) {
            var url = sounds[name].src;
            var a = new Audio(url);
            a.load();
            a.play();

            if(name == 'whistle') {
                whistle_sound = a;
            }
        }
    }
}

frame = 1;
deer = 0;

rudolph = new Character(vec(146, 180), vec(0, 0), 'rudolph1');
reindeer = new Character(vec(246, 180), vec(0, 0), 'reindeer1');
santa = new Character(vec(336, 170), vec(0, 0), 'santa1');

houses = [];
snowflakes = [];
gifts = [];
things = [];  // Fumaça, poofs, estrelas e presentes espatifados

next_house_in = 0;

function Timer() {
    this.now = 0;
    this.todo = [];

    this.timekey = function(n) {
        return "at" + n;
    };

    this.after = function(ticks, func) {
        var key = this.timekey(this.now + ticks);
        if(!this.todo[key]) {
            this.todo[key] = [];
        }
        this.todo[key].push(func);
    };

    this.tick = function() {
        this.now += 1;
        var key = this.timekey(this.now);

        if(this.todo[key]) {
            for(var i in this.todo[key]) {
                this.todo[key][i]();
            }
            delete this.todo[key];
        }
    };
}

timer = new Timer();

function animate() {
    setTimeout("animate()", 33);

    timer.tick();

    ctx.fillStyle = SKY_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    var motion = vec(0, 0);
    var x = rudolph.pos.x;
    var y = rudolph.pos.y;

    if(move_left && x > 10) {
        motion.x -= 10;
    }

    if(move_right && x < (WIDTH - 340)) {
        motion.x += 10;
    }

    if(move_up && y > 10) {
        motion.y -= 10;
    }

    if(move_down && y < (HEIGHT - 110)) {
        motion.y += 10;
    }

    var speed;
    // Cálculo mágico para obter velocidade da posição de Rudolph na tela
    speed = (320 - rudolph.pos.x + 50) / 30 - 2;
    if(speed < 0) {
        speed = 0;
    }
    speed = Math.round(speed);

    while(snowflakes.length < NUM_SNOWFLAKES) {
        var sfpos = vec(0, 0);

        if(randint(2)) {
            // Começa ao longo da borda superior
            sfpos.x = randint(WIDTH);
            sfpos.y = -10;
        } else {
            // Começa ao longo da borda esquerda
            sfpos.x = -10;
            sfpos.y = randint(HEIGHT);
        }

        snowflakes.push(new Sprite(sfpos, vec(0, randrange(1, 5)), 'snowflake'));
    }

    if(move_drop && santa.image == 'santa1') {
        play_sound('whistle');
        gifts.push(new Gift(vec(santa.pos.x + 35, santa.pos.y + 30), vec(-speed, 0), 'gift'));
        santa.image = 'santa2';
        timer.after(20, function() { santa.image = 'santa3'; });
        timer.after(30, function() { santa.image = 'santa1'; });
    }

    for(var i = 0; i < houses.length; i++) {
        houses[i].move(speed);
    }
    for(var i = 0; i < gifts.length; i++) {
        gifts[i].move(speed);
    }
    for(var i = 0; i < things.length; i++) {
        things[i].move(speed);
    }
    for(var i = 0; i < snowflakes.length; i++) {
        snowflakes[i].move(speed);
    }

    var outside = function(obj) {
        // Verdadeiro se o obj estiver fora da tela
        return obj.pos.x + obj.image.width < 0 || obj.pos.x >= WIDTH ||
               obj.pos.y + obj.image.height < 0 || obj.pos.y >= HEIGHT;
    };

    removeif(things, outside);
    removeif(snowflakes, outside);
    removeif(houses,
             function(obj) {
                 return obj.pos.x >= WIDTH;
             });

    next_house_in -= speed;
    if(next_house_in <= 0) {
        var house = new House(vec(-images['chimney'].width, 440), vec(0, 0), 'chimney');
        houses.push(house);

        next_house_in = randrange(200, 400);
    }

    removeif(gifts,
             function(gift) {
                 if(gift.pos.y > HEIGHT || gift.pos.x > WIDTH) {
                     return true;
                 }

                 var remove = false;

                 // Colisão?
                 for(var i = 0; i < houses.length; i++) {
                     var house = houses[i];

                     // Testar o canto superior/esquerdo contra uma caixa
                     var x1 = house.pos.x + 25;
                     var x2 = x1 + 35;
                     var y1 = house.pos.y - 20;
                     var y2 = y1 + 50;

                     if(gift.pos.x >= x1 &&
                        gift.pos.x <= x2 &&
                        gift.pos.y >= y1 &&
                        gift.pos.y <= y2 &&
                        true) {

                         var image;
                         if(house.smoking) {
                             play_sound('poof');
                             image = 'poof';
                         } else {
                             play_sound('plingeling');
                             image = 'star';
                         }
                         things.push(new Sprite(vec(house.pos.x + 35, house.pos.y - 10), vec(0, -6), image));
                         return true;
                     }
                 }

                 // Presente espatifado
                 for(var i = 0; i < houses.length; i++) {
                     var house = houses[i];
                     if(gift.pos.y >= HEIGHT - 35
                        && gift.pos.x + 10 >= house.pos.x
                        && (gift.pos.x - 10 + images['gift'].width) <= (house.pos.x + images['chimney'].width)
                        ) {
                         play_sound('splat');
                         things.push(new Sprite(gift.pos, vec(0, 0), 'splat'));
                         return true;
                     }
                 }

                 return false;
             });

    rudolph.pos.add(motion);
    timer.after(3, function() { reindeer.pos.add(motion); });
    timer.after(6, function() { santa.pos.add(motion); });

    if(deer > 20) {
        if(frame == 1) {
            frame = 2;
        } else {
            frame = 1;
        }
        deer = 0;
    }
    deer += 1;

    //
    // Desenho
    //

    rudolph.image = 'rudolph' + frame;
    reindeer.image = 'reindeer' + frame;

    for(var i = 0; i < snowflakes.length; i++) {
        snowflakes[i].draw();
    }
    for(var i = 0; i < houses.length; i++) {
        var house = houses[i];
        houses[i].draw();

        if(house.smoking) {
            ctx.drawImage(images['smoke' + frame], house.pos.x + 42, house.pos.y - 36);
        }
    }

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(rudolph.pos.x + 30, rudolph.pos.y + 40);
    ctx.lineTo(reindeer.pos.x + 30, reindeer.pos.y + 40);
    ctx.lineTo(santa.pos.x + 2, santa.pos.y + 62);
    ctx.stroke();

    rudolph.draw();
    reindeer.draw();
    santa.draw();

    for(var i = 0; i < gifts.length; i++) {
        gifts[i].draw();
    }
    for(var i = 0; i < things.length; i++) {
        things[i].draw();
    }
}