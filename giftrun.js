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