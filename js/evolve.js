/**
 * Created by MIC on 2015/10/11.
 */

/**
 * @type {Star[]}
 */
var stars = [];

/**
 * @type {Number}
 */
const STAR_COUNT = 600;

/**
 * @param {Star[]} stars
 * @returns {Star[]}
 */
function cloneStars(stars) {
    var a = [];
    for (var i = 0; i < stars.length; ++i) {
        a.push(stars[i] !== null ? stars[i].clone() : null);
    }
    return a;
}

/**
 * @param {Star} base
 * @returns {Number}
 */
function getAliveContactableStars(base) {
    /**
     * @type {Number}
     */
    var r = 0;
    if (base !== null) {
        for (var i = 0; i < base.contacted.length; ++i) {
            if (stars[base.contacted[i]] !== null) {
                ++r;
            }
        }
        return r;
    } else {
        return -1;
    }
}

function evolveStars() {
    /**
     * @type {Star[]}
     */
    var snapshot = cloneStars(stars);
    /**
     * @type {Star}
     */
    var star;
    /**
     * @type {Star}
     */
    var snapStar;
    /**
     * @type {Number}
     */
    var i;
    /**
     * @type {Number}
     */
    var j;
    /**
     * @type {Number}
     */
    var newConnections;
    for (i = 0; i < snapshot.length; ++i) {
        if (stars[i] == null) {
            continue;
        }
        snapStar = snapshot[i];
        star = stars[i];
        if (snapStar.outOfBounds(canvas)) {
            star.willBeRemoved = true;
        }
        if (star.willBeRemoved) {
            continue;
        }

        newConnections = 0;
        star.starsAround = 0;
        for (j = 0; j < snapshot.length; ++j) {
            if (canCommunicateWith(star, snapshot[j])) {
                ++star.starsAround;
                if (!star.contactedWith(snapshot[j].id) && getAliveContactableStars(star) < 25) {
                    star.addKnownStar(snapshot[j].id);
                    ++newConnections;
                }
            }
        }

        /** Life points... **/
        if (snapStar.starsAround > 10 && getAliveContactableStars(snapStar) < 10) {
            star.currentLifePoint -= 2;
        } else if (snapStar.starsAround < 3 && getAliveContactableStars(snapStar) < 10) {
            star.currentLifePoint -= 1;
        } else {
            if (newConnections > 0) {
                star.radius *= Math.pow(1.1, newConnections);
                star.speedX *= Math.pow(0.85, newConnections);
                star.speedY *= Math.pow(0.85, newConnections);
            }
        }
        // Stars disintegrate when time passing by
        star.currentLifePoint -= 0.04;
        if (star.currentLifePoint <= 5) {
            star.color.r = 255;
            star.color.g = 0;
            star.color.b = 0;
        } else {
            star.color.r = 255;
            star.color.g = 255;
            star.color.b = 255;
        }
        if (star.currentLifePoint <= 0) {
            star.willBeRemoved = true;
        }
        if (star.willBeRemoved) {
            continue;
        }
        star.color.a = star.currentLifePoint / star.originalLifePoint;
    }

    /** Clean up the array **/
    for (i = 0; i < stars.length;) {
        if (stars[i] !== null && stars[i].willBeRemoved) {
            stars[i] = null;
        } else {
            ++i;
        }
    }

    /** Move the stars **/
    for (i = 0; i < stars.length; ++i) {
        if (stars[i] !== null) {
            stars[i].x += stars[i].speedX;
            stars[i].y += stars[i].speedY;
        }
    }
}

function drawStars() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "green";
    context.lineWidth = 1;
    for (var i = 0; i < stars.length; ++i) {
        /**
         * @type {Star}
         */
        var star = stars[i];
        if (star !== null) {
            context.fillStyle = star.color.toCss();
            context.moveTo(star.x + star.radius, star.y);
            context.beginPath();
            context.arc(star.x, star.y, star.radius, 0, Math.PI * 2, true);
            context.fill();
            context.beginPath();
            for (var j = 0; j < star.contacted.length; ++j) {
                if (stars[star.contacted[j]] !== null) {
                    context.moveTo(star.x, star.y);
                    context.lineTo(stars[star.contacted[j]].x, stars[star.contacted[j]].y);
                }
            }
            context.stroke();
        }
    }
}

function initStars() {
    /**
     * @type {Number}
     */
    var x;
    /**
     * @type {Number}
     */
    var y;
    /**
     * @type {Star}
     */
    var star;
    for (var i = 0; i < STAR_COUNT; i++) {
        x = nextInt(0, canvas.width);
        y = nextInt(0, canvas.height);
        star = new Star(x, y, i);
        stars.push(star);
    }

    /**
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function nextInt(min, max) {
        return (Math.random() * (max - min) + min) | 0;
    }
}

/** Customizable **/

/**
 * @param {Star} starFrom
 * @param {Star} starTo
 * @returns {Boolean}
 */
function canCommunicateWith(starFrom, starTo) {
    if (starFrom === null || starTo === null) {
        return false;
    }
    if (starFrom.willBeRemoved || starTo.willBeRemoved) {
        return false;
    }
    /**
     * @type {Number}
     */
    var distance = starFrom.distanceTo(starTo);
    distance -= starFrom.radius + starTo.radius;
    distance -= (starFrom.radius + starTo.radius) * 0.4;
    return distance < 0;
}
