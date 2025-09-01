const around = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
    {dx: 0, dy: -1}, {dx: 0, dy: 1},];

function draw(pos, state, dispatch) {
    function drawPixel({x,y}, state) {
        let drawn = {x, y, color: state.color};
        dispatch({picture: state.picture.draw([drawn])});
    }
    drawPixel(pos, state);
    return drawPixel;
}

function rectangle(start, state, dispatch) {
    function drawRectangle(pos) {
        let xStart = Math.min(pos.x, start.x);
        let yStart = Math.min(pos.y, start.y);
        let xEnd = Math.max(pos.x, start.x);
        let yEnd = Math.max(pos.y, start.y);
        let drawn = [];

        for(let y = yStart; y <= yEnd; y++) {
            for(let x = xStart; x <= xEnd; x++) {
                drawn.push({x, y, color: state.color});
            }
        }
        dispatch({picture: state.picture.draw([drawn])});
    }
    drawRectangle(start);
    return drawRectangle;
}

function fill({x,y}, state, dispatch) {
    let targetColor = state.picture.pixel(x,y);
    let drawn = [{x, y, color: state.color}];

    for (let done = 0; done < drawn.length; done++) {
        for (let {dx, dy} of around) {
            let x = drawn[done].x + dx, y = drawn[done].y + dy;

            if (x >= 0 && x < state.picture.width &&
            y >= 0 && y < state.picture.height &&
            state.picture.pixel(x,y) === targetColor && !drawn.some(p => p.x === x && p.y === y)) {
                drawn.push({x, y, color: state.color});
            }
        }
    }
    dispatch({picture: state.picture.draw(drawn)});
}