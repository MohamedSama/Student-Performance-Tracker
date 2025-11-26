import { el, log } from "../Tool.js";
import LayoutBase from "./base.js";

export default class RangeLT extends LayoutBase {
    constructor() {
        super("range-lt");
        this.attachShadow({mode:'open'});
        const shadow = this.shadowRoot;
        (async () => {
            const [style, { element, reference }] = await el.importComponent("./Lib/LayoutJS/range-one", {
                type: "component",
                props: [
                    () => {
                        reference.display.innerHTML -= parseFloat(this.getAttribute("step")) ?? 1;
                        this.value = parseFloat(reference.display.innerHTML);
                        this.normalise();
                    },
                    () => {
                        reference.display.innerHTML = parseInt(reference.display.innerHTML) + (parseFloat(this.getAttribute("step")) ?? 1);
                        this.value = parseFloat(reference.display.innerHTML);
                        this.normalise();
                    }
                ]
            })
            reference.inp.setAttribute("min", this.getAttribute("min"));
            reference.inp.setAttribute("max", this.getAttribute("max"));
            // log(Comp)
            shadow.append(style, element)
            shadow.append(style, element)
        })()
        // (([style, {element, reference}]) => {
        // });
    }
    normalise() {
        if (this.value > this.getAttribute("max")) {
            this.value = this.getAttribute("max")
            this.shadowRoot.querySelector("#display").innerHTML = this.value;
        } else if (this.value < this.getAttribute("min")) {
            this.value = this.getAttribute("min")
            this.shadowRoot.querySelector("#display").innerHTML = this.value;
        }
    }
}