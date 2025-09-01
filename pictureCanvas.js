const scale = 10;

export class PictureCanvas {
    constructor(picture, pointerDown) {
        this.dom = elt("canvas", {
            onmousedown: event => this.mouse(event, pointerDown),
            ontouchstart: event => this.touch(event, pointerDown)
        });
        this.syncState(picture);
    }
    syncState(picture) {
        if (this.picture === picture) {
            return;
        }
        this.picture = picture;
        drawPicture(this.picture, this.dom, scale);
    }
}

export function drawPicture(picture, canvas, scale) {
    const ctx = canvas.getContext('2d');
    canvas.width = picture.width * scale;
    canvas.height = picture.height * scale;

    for (let y = 0; y < picture.height; y++) {
        for (let x = 0; x < picture.width; x++) {
            ctx.fillStyle = picture.pixel(x, y);
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}

PictureCanvas.prototype.mouse = function(downEvent, onDown) {
    if (downEvent.button !== 0) {
        return;
    }
    let position = pointerPosition(downEvent, this.dom);
    let onMove = onDown(position);

    if (!onMove) {
        return;
    }

    let move = (moveEvent) => {
        if (moveEvent.buttons === 0) {
            this.dom.removeEventListener('mousemove', move);
        }
        else {
            let newPosition = pointerPosition(moveEvent, this.dom);
            if (newPosition.x === position.x && newPosition.y === position.y) {
                return;
            }
            position = newPosition;
            onMove(newPosition);
        }
    };
    this.dom.addEventListener('mousemove', move);
}

PictureCanvas.prototype.touch = function(startEvent, onDown) {
    let position = pointerPosition(startEvent.touches[0], this.dom);
    let onMove = onDown(position);
    startEvent.preventDefault();

    if (!onMove) {
        return;
    }

    let move = (moveEvent) => {
        let newPosition = pointerPosition(moveEvent.touches[0], this.dom);

        if (newPosition.x === position.x && newPosition.y === position.y) {
            return;
        }
        position = newPosition;
        onMove(newPosition);
    };
    let end = () => {
        this.dom.removeEventListener('touchmove', move);
        this.dom.removeEventListener('touchend', end);
    };
    this.dom.addEventListener('touchmove', move);
    this.dom.addEventListener('touchend', end);
}

function pointerPosition(position, domNode) {
    let rect = domNode.getBoundingClientRect();
    return {x: Math.floor((position.x - rect.left) / scale),
            y: Math.floor((position.y - rect.top) / scale)}
}
