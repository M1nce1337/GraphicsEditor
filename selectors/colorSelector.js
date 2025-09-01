export class ColorSelector {
    constructor(state, {dispatch}) {
        this.input = elt('input', {
            type: 'color',
            value: state.color,
            onchange: () => {
                dispatch({color: this.input.value});
            }
        });
        this.dom = elt('label', null, ' 🎨 Цвет: ', this.input);
    }
    syncState(state) {
        this.input.value = state.color;
    }
}