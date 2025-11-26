import { Debugger, el, log, SetRange } from "../Tool.js";
import LayoutBase from "./base.js";

export default class Resizer extends LayoutBase {
    constructor() {
        super();

        this.line = el.elem("divider-lt");
        this.append(this.line);

        let thisEl = this;
        
        this.setAttribute("size", "ignore")

        function MouseUpFunc() {
            const preSib = thisEl.preSib;
            const nextSib = thisEl.nextSib;

            // preSib.size = preSib.orientSize;
            // nextSib.size = nextSib.orientSize;
            
            const type1 = preSib.size == "auto" ? "string" : "number"; 
            const type2 = nextSib.size == "auto" ? "string" : "number"; 
            
            if (type1 == "string" && type2 == "string") {
                preSib.size = preSib.orientSize;
            } else if (type1 == "string" && type2 == "number") {
                nextSib.size = nextSib.orientSize;
            } else if (type1 == "number" && type2 == "string") {
                preSib.size = preSib.orientSize;
            } else {
                preSib.size = preSib.orientSize;
                nextSib.size = nextSib.orientSize;
            }

            thisEl.ownerDocument.defaultView.removeEventListener("mouseup", MouseUpFunc)
            thisEl.ownerDocument.defaultView.removeEventListener("mousemove", MouseMouseFunc);


        }
        function MouseMouseFunc(e) {
            e.preventDefault()
            if (thisEl.parentElement.orientType == "horizontal") {
                thisEl.setAdjecentHolderSize(e.movementX);
            } else {
                thisEl.setAdjecentHolderSize(e.movementY);
            }
        }

        this.addEventListener("mousedown", () => {
            
            thisEl.buffer = {
                m: 0,                
                preSib: thisEl.preSib.orientSize,
                nextSib: thisEl.nextSib.orientSize,
                resizerPos: thisEl.orientPos,
                nextPos: thisEl.nextSib.orientPos,
                add(m) {
                    thisEl.buffer.m += m;
                }
            }
            
            thisEl.ownerDocument.defaultView.addEventListener("mousemove", MouseMouseFunc)
            thisEl.ownerDocument.defaultView.addEventListener("mouseup", MouseUpFunc)
        });
        
        
    }
    
    setAdjecentHolderSize(movement) {Debugger.debug()
        const preSib = this.preSib;
        const nextSib = this.nextSib;
        
        this.buffer.add(movement);
        
        const buff_buff = Resizer.correctionizeBuffM(this, this.buffer, movement);
        // log(buff_buff, set)

        if (buff_buff == 0) return;

        preSib.orientSize = (this.buffer.preSib + buff_buff);
        nextSib.orientSize = (this.buffer.nextSib - buff_buff);
        this.orientPos = (this.buffer.resizerPos + buff_buff);
        nextSib.orientPos = (this.buffer.nextPos + buff_buff);

        preSib.resize();
        nextSib.resize();
    }

    static correctionizeBuffM(resizerEl, buffer, movement) {
        const preSib = resizerEl.preSib;
        const nextSib = resizerEl.nextSib;
        const orient = preSib.parentElement.orientType;
        let left_set = new SetRange([{
            range: [preSib.min(orient) - buffer.preSib, preSib.max(orient) - buffer.preSib],
            info: [1, 1]
        }]);
        let right_set = new SetRange([{
            range: [buffer.nextSib - nextSib.max(orient), buffer.nextSib - nextSib.min(orient)],
            info: [1, 1]
        }]);
        
        let result = SetRange.intersection(left_set, right_set);
        // console.table(result)

        if (result.has(buffer.m)) {
            return buffer.m
        } else {
            const offseted = result.offsettedBy(buffer.m)
            if (offseted > 0) {
                return result.set.at(-1).range[1];
            } else if (offseted < 0) {
                return result.set[0].range[0];
            } else {
                Debugger.debug(true)
            }
        }
    }
}