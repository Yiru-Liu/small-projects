const SVG_WIDTH = 512;
const SVG_HEIGHT = 512;
const SVG_RADIUS = Math.min(SVG_WIDTH / 2, SVG_HEIGHT / 2);
const LARGEU = SVG_RADIUS / 16;
const SMALLU = LARGEU / 16;
let NEG_COLOR, POS_COLOR;
if (window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches) {
    NEG_COLOR = "black";
    POS_COLOR = "white";
}
else {
    NEG_COLOR = "white";
    POS_COLOR = "black";
}
let svgElt;
let mainElt;
function refreshSvg() {
    svgElt.innerHTML += "";
}
function initializeSvg() {
    mainElt.style.backgroundColor = NEG_COLOR;
    svgElt.setAttribute("viewBox", `${-SVG_WIDTH / 2} ${-SVG_HEIGHT / 2} ${SVG_WIDTH} ${SVG_HEIGHT}`);
}
function intializeClock() {
    // const outerCircle = document.createElement("circle");
    // outerCircle.setAttribute("r", SVG_RADIUS as any);
    // outerCircle.setAttribute("fill", POS_COLOR);
    // const innerCircle = document.createElement("circle");
    // innerCircle.setAttribute("r", SVG_RADIUS * 15.5 / 16 as any);
    // innerCircle.setAttribute("fill", NEG_COLOR);
    const tickMarks = [];
    for (let i = 0; i < 60; i++) {
        const mark = document.createElement("line");
        mark.setAttribute("stroke", POS_COLOR);
        if (i % 5) {
            mark.setAttribute("y1", -11.5 * LARGEU);
            mark.setAttribute("y2", -13 * LARGEU);
            mark.setAttribute("stroke-width", SMALLU);
        }
        else {
            mark.setAttribute("y1", -10.5 * LARGEU);
            mark.setAttribute("y2", -13 * LARGEU);
            mark.setAttribute("stroke-width", 3 * SMALLU);
        }
        mark.setAttribute("transform", `rotate(${6 * i})`);
        tickMarks.push(mark);
    }
    const hourLabels = [];
    for (let i = 1; i <= 12; i++) {
        const l = document.createElement("text");
        l.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
        l.setAttribute("text-anchor", "middle");
        l.setAttribute("dominant-baseline", "central");
        l.setAttribute("fill", POS_COLOR);
        l.setAttribute("font-family", "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
        l.setAttribute("font-size", 2 * LARGEU);
        l.setAttribute("style", "font-variant-numeric: tabular-nums");
        l.setAttribute("y", (-8.625 * Math.cos(i * Math.PI / 6) * LARGEU).toFixed(12));
        l.setAttribute("x", (8.625 * Math.sin(i * Math.PI / 6) * LARGEU).toFixed(12));
        hourLabels.push(l);
    }
    const minuteLabels = [];
    for (let i = 0; i < 60; i++) {
        const l = document.createElement("text");
        l.appendChild(document.createTextNode(i.toString().padStart(2, "0")));
        l.setAttribute("text-anchor", "middle");
        l.setAttribute("dominant-baseline", "central");
        l.setAttribute("fill", POS_COLOR);
        l.setAttribute("font-family", "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");
        l.setAttribute("font-size", 0.75 * LARGEU);
        l.setAttribute("style", "font-variant-numeric: tabular-nums");
        if (!(i % 5)) {
            l.setAttribute("font-weight", "bold");
        }
        l.setAttribute("y", (-14 * Math.cos(i * Math.PI / 30) * LARGEU).toFixed(12));
        l.setAttribute("x", (14 * Math.sin(i * Math.PI / 30) * LARGEU).toFixed(12));
        minuteLabels.push(l);
    }
    const hourHand = document.createElement("line");
    hourHand.id = "hour-hand";
    hourHand.setAttribute("stroke", POS_COLOR);
    hourHand.setAttribute("y2", -5 * LARGEU);
    hourHand.setAttribute("stroke-width", 10 * SMALLU);
    const minuteHand = document.createElement("line");
    minuteHand.id = "minute-hand";
    minuteHand.setAttribute("stroke", POS_COLOR);
    minuteHand.setAttribute("y2", -12 * LARGEU);
    minuteHand.setAttribute("stroke-width", 5 * SMALLU);
    const secondHand = document.createElement("line");
    secondHand.id = "second-hand";
    secondHand.setAttribute("stroke", POS_COLOR);
    secondHand.setAttribute("y2", -13 * LARGEU);
    secondHand.setAttribute("stroke-width", 2 * SMALLU);
    const centerPin = document.createElement("circle");
    centerPin.setAttribute("r", 6);
    centerPin.setAttribute("stroke", POS_COLOR);
    centerPin.setAttribute("stroke-width", 2 * SMALLU);
    centerPin.setAttribute("fill", NEG_COLOR);
    svgElt.append(...tickMarks, ...hourLabels, ...minuteLabels, hourHand, minuteHand, secondHand, centerPin);
    refreshSvg();
}
function updateSecondHand(time) {
    const secondHand = document.getElementById("second-hand");
    const angle = (time % 60_000) * 360 / 60_000;
    secondHand.setAttribute("transform", `rotate(${angle})`);
}
function updateMinuteHand(time) {
    const minuteHand = document.getElementById("minute-hand");
    const angle = (time % 3600_000) * 360 / 3600_000;
    minuteHand.setAttribute("transform", `rotate(${angle})`);
}
function updateHourHand(time) {
    const hourHand = document.getElementById("hour-hand");
    const angle = (time % 43_200_000) * 360 / 43_200_000;
    hourHand.setAttribute("transform", `rotate(${angle})`);
}
function updateClock() {
    const current = new Date();
    const time = current.getTime() - current.getTimezoneOffset() * 60_000;
    updateSecondHand(time);
    updateMinuteHand(time);
    updateHourHand(time);
    window.requestAnimationFrame(updateClock);
}
document.addEventListener("DOMContentLoaded", () => {
    svgElt = document.getElementById("main-svg");
    mainElt = document.getElementsByTagName("main")[0];
    initializeSvg();
    intializeClock();
    updateClock();
});
