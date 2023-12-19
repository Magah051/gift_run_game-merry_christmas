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