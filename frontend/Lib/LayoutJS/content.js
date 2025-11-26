import { log } from "../Tool.js";
import LayoutBase from "./base.js";

export default class Content extends LayoutBase {
    constructor() {
        super();
        if (this.getAttribute("mmSize") == null) this.setAttribute("mmSize", "100-i")
        if (this.getAttribute("size") == null) this.setAttribute("size", "auto");
        if (this.getAttribute("pos") == null) this.setAttribute("pos", "auto");
    }
    min() {
        return this.mm_size[0];
    }
    max() {
        return this.mm_size[1];
    }
    innerMin() {
        return 0;
    }
    innerMax() {
        return 0;
    }
    
}