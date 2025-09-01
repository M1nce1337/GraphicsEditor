import {Picture} from "./state.js";
import {LoadButton} from "./buttons/loadButton.js";
import {SaveButton} from "./buttons/saveButton.js";
import * as undo from "./buttons/undoButton.js";
import {ToolSelector} from "./selectors/toolSelector.js";
import {ColorSelector} from "./selectors/colorSelector.js";
import {draw, fill, pick, rectangle} from "./drawingTools.js";
import {PixelEditor} from "./pixelEditor.js";

const startState = {
    tool: 'draw',
    color: '#000000',
    picture: Picture.empty(60, 30, '#f0f0f0'),
    done: [],
    doneAt: 0
};
const baseTools = {draw, fill, rectangle, pick};
const baseControls = [ToolSelector, ColorSelector, SaveButton, LoadButton, undo.UndoButton];

export function startPixelEditor({state = startState, tools = baseTools, controls = baseControls}) {
    let app = new PixelEditor(state, {
        tools,
        controls,
        dispatch(action) {
            state = undo.historyUpdateState(state, action);
            app.syncState(state);
        }
    });
    return app.dom;
}
