/**
 * Created by MIC on 2015/10/11.
 */

/**
 * @type {Number}
 */
const MAX_SPEED = 1;
/**
 * @type {Number}
 */
const MIN_SPEED = 0;
/**
 * @type {Number}
 */
const MAX_LIFE = 30;
/**
 * @type {Number}
 */
const MIN_LIFE = 20;

/**
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} [a]
 * @constructor
 */
function Color(r, g, b, a) {
    if (a === undefined) {
        a = 1;
    }
    this.r = r | 0;
    this.g = g | 0;
    this.b = b | 0;
    this.a = a | 0;
}

/**
 * @returns {String}
 */
Color.prototype.toCss = function () {
    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")";
};

/**
 * @returns {Color}
 */
Color.prototype.clone = function () {
    return new Color(this.r, this.g, this.b, this.a);
};

/**
 * @type {Color}
 */
Color.RED = new Color(255, 0, 0);
/**
 * @type {Color}
 */
Color.GREEN = new Color(0, 255, 0);
/**
 * @type {Color}
 */
Color.BLUE = new Color(0, 0, 255);
/**
 * @type {Color}
 */
Color.BLACK = new Color(0, 0, 0);
/**
 * @type {Color}
 */
Color.WHITE = new Color(255, 255, 255);
/**
 * @type {Color}
 */
Color.TRANSPARENT = new Color(0, 0, 0, 0);

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} id
 * @constructor
 */
function Star(x, y, id) {
    this.init(x, y, id);
}

/**
 * @type {Number}
 */
Star.BORN_RADIUS = 10;

/**
 * @param {Number} x
 * @param {Number} y
 * @param {Number} id
 */
Star.prototype.init = function (x, y, id) {
    /**
     * @type {Number}
     */
    this.radius = Star.BORN_RADIUS;
    /**
     * @type {Number}
     */
    this.x = x;
    /**
     * @type {Number}
     */
    this.y = y;
    /**
     * @type {Color}
     */
    this.color = new Color(255, 255, 255); // white
    /**
     * @type {Number}
     */
    this.speedX = (Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED) * (nextBoolean() ? 1 : -1);
    /**
     * @type {Number}
     */
    this.speedY = (Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED ) * (nextBoolean() ? 1 : -1);
    /**
     * @type {Boolean}
     */
    this.willBeRemoved = false;
    /**
     * @type {Number}
     */
    this.starsAround = 0;
    /**
     * @type {Number}
     */
    this.originalLifePoint = (Math.random() * (MAX_LIFE - MIN_LIFE) + MIN_LIFE) | 0;
    /**
     * @type {Number}
     */
    this.currentLifePoint = this.originalLifePoint;
    /**
     * @type {Number}
     */
    this.id = id;
    /**
     * @type {Number[]}
     */
    this.contacted = [];

    /**
     * @returns {Boolean}
     */
    function nextBoolean() {
        return Math.random() >= 0.5;
    }
};

/**
 * @param {Star} other
 * @returns {Number}
 */
Star.prototype.distanceTo = function (other) {
    return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
};

/**
 * @returns {Star}
 */
Star.prototype.clone = function () {
    var star = new Star(this.x, this.y, this.id);
    star.radius = this.radius;
    star.color = this.color.clone();
    star.speedX = this.speedX;
    star.speedY = this.speedY;
    star.willBeRemoved = this.willBeRemoved;
    star.starsAround = this.starsAround;
    star.currentLifePoint = this.currentLifePoint;
    star.originalLifePoint = this.originalLifePoint;
    star.contacted = this.contacted.slice();
    return star;
};

/**
 * @param {HTMLCanvasElement} canvas
 * @returns {Boolean}
 */
Star.prototype.outOfBounds = function (canvas) {
    return this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height;
};

/**
 * @param {Number} id
 * @returns {Boolean}
 */
Star.prototype.contactedWith = function (id) {
    return this.contacted.indexOf(id) >= 0;
};

/**
 * @param {Number} id
 */
Star.prototype.addKnownStar = function (id) {
    this.contacted.push(id);
};
