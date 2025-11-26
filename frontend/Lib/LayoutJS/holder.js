import { Debugger, el, log } from "../Tool.js";
import LayoutBase from "./base.js";

export default class Holder extends LayoutBase {
    constructor() {
        super("holder");
        this.backdrops = [];
        if (this.getAttribute("mmSize") == null) this.setAttribute("mmSize", "100-i")
        if (this.getAttribute("size") == null) this.setAttribute("size", "auto");
        if (this.getAttribute("pos") == null) this.setAttribute("pos", "auto");

        this.setIndex();
    }
    min(orient) {
        return Math.max(this.mm_size[0], this.innerMin(orient));
    }
    max(orient) {
        return Math.max(this.mm_size[1], this.innerMax(orient));
    }

    innerMin(orient) {
        if (this.orientType != orient) {
            return this.getSizableChilds(true).reduce((p, c) => {
                p = Math.max(p, c.innerMin(orient));
                return p;
            }, 0)
        } else {
            const extra = this.getChildren().filter(child => child.size == "fixed" || child.size == "ignore").reduce((pre, cur) => {
                pre += cur.orientSize;
                return pre;
            }, 0)
            return this.getSizableChilds(true)?.reduce((p, c) => {
                p += c.min(orient);
                return p;
            }, 0) + extra;
        }
    }
    innerMax(orient) {
        if (this.orientType != orient) {
            return this.getSizableChilds(true).reduce((p, c) => {
                p = Math.max(p, c.innerMax(orient));
                return p;
            }, 0)
        } else {
            const extra = this.getChildren().filter(child => child.size == "fixed" || child.size == "ignore").reduce((pre, cur) => {
                pre += cur.orientSize;
                return pre;
            }, 0)
            return this.getSizableChilds(true).reduce((p, c) => {
                p += c.max(orient);
                return p;
            }, 0) + extra;
        }
    }
    addBackDrop() {
        this.backdrops.push(el.elem("backdrop-lt", "", this))
    }
    removeBackDrop() {
        this.backdrops.forEach(backdrop => backdrop.remove());
        this.backdrops = []
    }
}