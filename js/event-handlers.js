/**
 * Created by MIC on 2015/10/11.
 */

window.addEventListener("resize", changeCanvasSize);

function changeCanvasSize() {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight - 20;
}

//requestEnterFullScreen(canvas);
changeCanvasSize();

canvas.addEventListener("dblclick", function () {
    requestExitFullScreen();
});

/**
 * @param {HTMLElement} elem
 */
function requestEnterFullScreen(elem) {
    if (window.chrome) {
        elem.webkitRequestFullScreen();
    }
}

function requestExitFullScreen() {
    if (window.chrome) {
        document.webkitCancelFullScreen();
    }
}
