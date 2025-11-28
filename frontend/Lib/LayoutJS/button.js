import { el, log } from "../Tool.js";
import LayoutBase from "./base.js";

export default class ButtonLT extends LayoutBase {
    #value;
    get value() {
        return this.#value;
    }
    set value(v) {
        this.#value = v
    }
    constructor() {
        super("btn");
    }
    initCallBack() {
        this.connectedCallback?.()
    }
    connectedCallback() {
        this.setAttribute("type", this.getAttribute("type") ?? "button");
        const type = this.getAttribute("type");
        
        const buffer = this.children[0]
        const defaultOpt = {
            label: buffer?.innerText ?? null,
            value: buffer?.getAttribute("value") ?? null
        };
        this.value = defaultOpt.value;

        switch (type) {
            case "button":
                this.classList.add("button-lt")
                break;
            case "selector-1":{
                const optionObject = [];
                this.tabIndex = this.ltId;
                
                for (const child of this.childNodes) {
                    if (child.nodeName == "#text") continue;
                    optionObject.push({
                        label: child.innerText,
                        value: child.getAttribute("value")
                    });
                    child.remove();
                };
                
                const btn = el.elem("div", "", this, {
                    classLists: [ "button-lt" ]
                });
                el.elem("text", (this.getAttribute("label") ?? "") + ": ", btn, {
                    classLists: [ "label" ]
                })
                el.elem("span", "", btn, {
                    classLists: [ "space" ]
                })
                const valueText = el.elem("text", defaultOpt.label, btn, {
                    classLists: [ "value" ]
                })
                const div = el.elem("div", "", this, {
                    classLists: [ "option-cont" ]
                });

                for (const opt of optionObject) {
                    const btnEl = el.elem("button", opt.label, div, {
                        classLists: [ "button1" ],
                        properties: {
                            value: opt.value
                        },
                        events: {
                            click: () => {
                                if (this.value == btnEl.value) return;
                                valueText.innerText = btnEl.innerText;
                                this.value = btnEl.value; 
                                this.dispatchEvent(new Event("change"))
                            }
                        }
                    });
                }
                break;
            }
            case "selector-2": {
                const datas = [];
                this.tabIndex = this.ltId;
                let x = [];
                for (const child of this.childNodes) {
                    if (child.nodeName == "#text") {
                        continue;
                    };
                    datas.push({
                        label: child.innerText,
                        value: child.getAttribute("value")
                    });
                    x.push(child);
                    log(x);
                };
                x.forEach(c => c.remove())
                for (const data of datas) {
                    const btn = el.elem("button", data.label, this, {
                        classLists: [ "button2" ],
                        properties: {
                            value: data.value
                        },
                        events: {
                            click: () => {
                                if (this.value == btn.value) {
                                    btn.classList.add("active");
                                }
                                this.value = btn.value;
                                for (const child of this.childNodes) {
                                    if (child.nodeName == "#text") continue
                                    child.classList.remove("active");
                                }
                                btn.classList.add("active");
                                this.dispatchEvent(new Event("change"))
                            }
                        }
                    });
                }
                log(this)
                setTimeout(e => {
                    this.lastElementChild.classList.add("active");
                }, 0)
                break;
            }
            case "toogler": {
                this.value = false
                this.setAttribute("state", this.getAttribute("state") ?? "false");
                const theRound = el.elem("span", "", this, {
                    classLists: [ "round" ]
                });
                this.addEventListener('click', () => {
                    if (this.getAttribute("state") == "true") {
                        theRound.style.setProperty("left", `var(--off)`)
                        this.setAttribute("state", "false");
                        this.value = false;
                    } else {
                        theRound.style.setProperty("left", `var(--on)`)
                        this.setAttribute("state", "true");
                        this.value = true;
                    }
                    this.dispatchEvent(new Event("change"))
                })
                this.switch = function(state) {
                    if (!state) {
                        theRound.style.setProperty("left", `var(--off)`)
                        this.setAttribute("state", "false");
                        this.value = false;
                    } else {
                        theRound.style.setProperty("left", `var(--on)`)
                        this.setAttribute("state", "true");
                        this.value = true;
                    }
                }
            };
            case "range": {
                this.value = false;
                this.min = parseFloat(this.getAttribute("min") ?? 0);
                this.max = parseFloat(this.getAttribute("max") ?? 100);
                const {element, reference} = el.elems(`@div#con
    @button#left-move.move &left
        @svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
            @path fill="var(--white-1)" d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"
    @div#effort-inner-cont
        @input#inp type="number" min=2 max=3 type="number" &inp
        @span#txt *innerHTML=1 &resTxt
    @button#right-move.move &right
        @svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"
            @path fill="var(--white-1)" d="M439.1 297.4C451.6 309.9 451.6 330.2 439.1 342.7L279.1 502.7C266.6 515.2 246.3 515.2 233.8 502.7C221.3 490.2 221.3 469.9 233.8 457.4L371.2 320L233.9 182.6C221.4 170.1 221.4 149.8 233.9 137.3C246.4 124.8 266.7 124.8 279.2 137.3L439.2 297.3z"
`, [this.getAttribute("value") ?? this.min + "", this.min, this.max]);
                const r = reference;

                r.left.addEventListener("click", () => {
                    const c = parseFloat(r.resTxt.innerText);
                    if (this.min > c - 1) {
                        return;
                    } else {
                        r.resTxt.innerText = c - 1;
                    }
                });
                r.right.addEventListener("click", () => {
                    const c = parseFloat(r.resTxt.innerText);
                    if (this.max < c + 1) {
                        return;
                    } else {
                        r.resTxt.innerText = c + 1;
                    }
                });
                r.resTxt.addEventListener("dblclick", () => {
                    
                })
                this.append(element);
                this.setValue = function(value) {
                    r.resTxt.innerText = value;
                }
                this.getValue = function() {
                    return r.resTxt.innerText;
                }
            }
        }
    }
}