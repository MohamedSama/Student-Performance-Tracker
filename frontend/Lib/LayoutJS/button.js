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
                for (const child of this.childNodes) {
                    if (child.nodeName == "#text") {
                        continue;
                    };
                    datas.push({
                        label: child.innerText,
                        value: child.getAttribute("value")
                    });
                    child.remove();
                };
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
            }
        }
    }
}