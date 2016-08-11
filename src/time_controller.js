import Chapters from './chapters'
import MathUtil from './util/math'

export default class TimeController {
    constructor(config, element, square) {
        this.square = square;
        this.config = config;
        this.element = element;
        
        this.rotateVelocity = 0;
        this.currentRotation = 0;
    }
    init() {
        console.log("Initializing Time Controller", this.element)
        this.times = Chapters.map((chapter) => {return chapter.hour}).sort((a,b) => {return a-b});
        this.angles = this.times.map((time) => {return time * 15});
        console.log("Chapter times", this.times, this.angles);
        document.addEventListener("mousemove", (e) => {this.handleMouseMove(e)})
    }

    update(dt) {
        if (this.rotateVelocity != 0) {
            this.square.mesh.rotateY(this.rotateVelocity * Math.PI /180 * dt * 20);
            let rotationY = this.square.mesh.rotation.y;
            if (rotationY < 0) {
                rotationY = 2 * Math.PI + rotationY;
            }
            this.currentRotation = rotationY * 180 / Math.PI;
            console.log(this.currentRotation);
        }
    }

    handleMouseMove(e) {
        //console.log("Time move! ", e.pageX + "/" + this.element.offsetWidth);
        if (e.pageX > this.element.offsetWidth * 2 / 3) {
            this.rotateVelocity = (e.pageX - this.element.offsetWidth * 2 /3) / (this.element.offsetWidth / 3);
            console.log("Time velocity: " + this.rotateVelocity);
        } else if (e.pageX < this.element.offsetWidth / 3) {
            this.rotateVelocity = (this.element.offsetWidth / 3 - e.pageX) / (this.element.offsetWidth / 3) * -1;
            console.log("Time velocity: " + this.rotateVelocity);
        } else {
            if (this.rotateVelocity != 0) {
                // We stopped
                let closestTime = MathUtil.closestValue(this.angles, this.currentRotation);
                console.log("Closest hour: ", closestTime);
            }
            this.rotateVelocity = 0;
        }
    } 
}
