import LayoutBase from "./base.js";

export default class Divider extends LayoutBase {
    constructor() {
        super();
        this.setAttribute("size", "ignore");
    }
}