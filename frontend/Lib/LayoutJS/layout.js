import { el } from "../Tool.js";
import LayoutBase from "./base.js";

export default class Layout extends LayoutBase {
    constructor() {
        super("layout");
        this.setAttribute("size", "auto")
        this.setIndex();
    }
    initLayout() {
        this.resize();
    }
}