/**
 * Created by MIC on 2015/10/11.
 */

var refreshFrequency = 10;
var lastUpdateTime = 0;

initStars();

function animate() {
    var currentTime = Date.now();
    if (currentTime - lastUpdateTime > (1000 / refreshFrequency)) {
        evolveStars();
        drawStars();
        lastUpdateTime = currentTime;
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
