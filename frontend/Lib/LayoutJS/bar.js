import { log } from "../Tool.js";
import LayoutBase from "./base.js";

export default class Bar extends LayoutBase {
    constructor() {
        super();
        this.setAttribute("size", "ignore");
        if (this.getAttribute("type") == "header") {

            const thisEl = this;
            function mouseUp(e) {
                thisEl.parentElement.parentElement.getSizableChilds?.().forEach(child => {
                    if (thisEl.parentElement.ltId == child.ltId) return;
                    child.removeEventListener("mouseenter", mouseEnter);
                    child.removeEventListener("mouseleave", mouseLeave);
                    child.removeEventListener('mouseup', mouseUp);
                    thisEl.ownerDocument.defaultView.removeEventListener('mouseup', mouseUpWin);
                    child.classList.remove("lt-backdrop");
                    child.classList.remove("lt-backdrop-active");
                });


                LayoutBase.replace(thisEl.parentElement.parentElement.curDown, e.target)
            }
            function mouseUpWin() {
                thisEl.parentElement.parentElement.getSizableChilds?.().forEach(child => {
                    if (thisEl.parentElement.ltId == child.ltId) return;
                    child.removeEventListener("mouseenter", mouseEnter);
                    child.removeEventListener("mouseleave", mouseLeave);
                    child.removeEventListener('mouseup', mouseUp);
                    thisEl.ownerDocument.defaultView.removeEventListener('mouseup', mouseUpWin);
                    child.classList.remove("lt-backdrop");
                    child.classList.remove("lt-backdrop-active");
                })
            }
            function mouseEnter(e) {
                e.target.classList.add("lt-backdrop-active")
            }
            function mouseLeave(e) {
                e.target.classList.remove("lt-backdrop-active")
            }
            
            this.addEventListener("mousedown", e => {
                if (this.ltId != e.target.ltId) return;
                this.parentElement.parentElement.curDown = this.parentElement;
                this.parentElement.parentElement.getSizableChilds?.().forEach(child => {
                    if (this.parentElement.ltId == child.ltId) return;
                    child.addEventListener("mouseenter", mouseEnter);
                    child.addEventListener("mouseleave", mouseLeave);
                    child.addEventListener('mouseup', mouseUp);
                    this.ownerDocument.defaultView.addEventListener('mouseup', mouseUpWin);
                    child.classList.add("lt-backdrop");
                })
                
            })
        }
    }
}