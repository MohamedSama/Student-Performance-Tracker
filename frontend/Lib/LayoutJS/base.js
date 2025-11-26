import { Debugger, IdMaker, log } from "../Tool.js";

export default class LayoutBase extends HTMLElement {
    constructor(name) {
        super();
        this.name = name;
    }
    connectedCallback() {
        if (this.name != "backdrop" || !this.getAttribute("display")) {
            this.setAttribute("display", "true")
        }
        this.ltId = LayoutBase.id()
    }
    static #idRef = IdMaker();
    static id() {
        return LayoutBase.#idRef.next().value;
    }
    alignInnerElements() {
        if (this.getChildren(false).some(element => element.getAttribute("index") == null)) {
            this.setIndex()
        }
    }
    setIndex() {
        this.getChildren(false).forEach((value, index) => {
            value.setAttribute("index", index + 1)
        })
    }
    getChildren(isToNegletHidders = true) {
        if (isToNegletHidders) {
            return this.childNodes.entries().toArray().map(item => item[1]).filter(item => (item.nodeName != "#text" && item.getAttribute("display") == "true")).sort((a, b) => (parseInt(a.getAttribute("index") ?? "1") - (parseInt(b.getAttribute("index") ?? "0"))));
        }
        return this.childNodes.entries().toArray().map(item => item[1]).filter(item => (item.nodeName != "#text")).sort((a, b) => (parseInt(a.getAttribute("index") ?? "1") - (parseInt(b.getAttribute("index") ?? "0"))));
    }
    // setPositions() {
    //     switch (this.getAttribute("orient") ?? "right") {
    //         case "right": {
    //             let leftBuffer = 0;
    //             this.getChildren().forEach(child => {
    //                 child.style.left = Math.floor(leftBuffer) + "px";
    //                 child.pos = Math.floor(leftBuffer)
    //                 leftBuffer += child.offsetWidth;
    //             })
    //             break;
    //         }
    //         case "left": {
    //             let leftBuffer = 0;
    //             this.getChildren().reverse().forEach(child => {
    //                 child.style.left = Math.floor(leftBuffer) + "px";
    //                 child.pos = Math.floor(leftBuffer)
    //                 leftBuffer += child.offsetWidth;
    //             })
    //             break;
    //         }
    //         case "bottom": {
    //             let topBuffer = 0;
    //             this.getChildren().forEach(child => {
    //                 child.style.top = Math.floor(topBuffer) + "px";
    //                 child.pos = Math.floor(topBuffer)
    //                 topBuffer += child.offsetHeight;
    //             });
    //             break;
    //         }
    //         case "bottom": {
    //             let topBuffer = 0;
    //             this.getChildren().reverse().forEach(child => {
    //                 child.style.top = Math.floor(topBuffer) + "px";
    //                 child.pos = Math.floor(topBuffer)
    //                 topBuffer += child.offsetHeight;
    //             });
    //             break;
    //         }
    //     }
    // }
    // setSize() {
    //     if (this.orientType == "horizontal") {
    //         let commonWidth = (this.offsetWidth - this.getChildren().filter(child => child.getAttribute("size") != "auto").reduce((pre, cur) => {
    //             pre += cur.offsetWidth;
    //             return pre;
    //         }, 0)) / this.getChildren().filter(child => child.getAttribute("size") == "auto").length;

    //         this.getChildren().filter(child => child.getAttribute("size") == "auto").forEach(child => {
    //             child.style.width = Math.floor(commonWidth) + "px";
    //         })
    //     } else {
    //         let commonHeight = (this.offsetHeight - this.getChildren().filter(child => child.getAttribute("size") != "auto").reduce((pre, cur) => {
    //             pre += cur.offsetHeight;
    //             return pre;
    //         }, 0)) / this.getChildren().filter(child => child.getAttribute("size") == "auto").length;

    //         this.getChildren().filter(child => child.getAttribute("size") == "auto").forEach(child => {
    //             child.style.height = Math.floor(commonHeight) + "px";
    //         })
    //     }
    // }
    getHolderChilds(he = false) {
        return this.getChildren(he).filter(child => child.tagName == "HOLDER-LT");
    }
    get nextSib() {
        return this.parentElement.getChildren().filter(val => parseInt(val.getAttribute("index")) > parseInt(this.getAttribute("index")))[0];
    }
    get preSib() {
        return this.parentElement.getChildren().filter(val => parseInt(val.getAttribute("index")) < parseInt(this.getAttribute("index"))).at(-1);
    }
    get nextSibAll() {
        return this.parentElement.getChildren(false).filter(val => parseInt(val.getAttribute("index")) - 1 == parseInt(this.getAttribute("index")))[0];
    }
    get preSibAll() {
        return this.parentElement.getChildren(false).filter(val => parseInt(val.getAttribute("index")) + 1 == parseInt(this.getAttribute("index")))[0];
    }
    get orientType() {
        return ((this.getAttribute("orient") == "bottom" || this.getAttribute("orient") == "top") ? "vertical" : "horizontal");
    }
    get orient() {
        return this.getAttribute("orient");
    }
    get size() {
        const s = this.getAttribute("size");
        return ((s == "auto" || s == "ignore") ? s : parseInt(s));
    }
    set size(siz) {
        this.setAttribute("size", siz);
        return siz
    }
    get pos() {
        return parseInt(this.getAttribute("pos"));
    }
    set pos(po = 0) {
        this.getAttribute("pos", po);
    }
    get mm_size() {
        return this.getAttribute("mmsize").split("-").reduce((pre, cur) => {
            if (cur == "i") {
                pre.push(Infinity);
            } else {
                pre.push(parseInt(cur));
            }
            return pre;
        }, []);
    }
    get orientSize() {
        if (this.parentElement.orientType == "vertical") {
            return this.offsetHeight
        } else {
            return this.offsetWidth
        }
    }
    get orientSizeAlt() {
        if (this.parentElement.orientType != "vertical") {
            return this.clientHeight
        } else {
            return this.clientWidth
        }
    }
    set orientSize(si) {
        if (this.parentElement.orientType == "vertical") {
            this.style.height = si + 'px';
        } else {
            this.style.width = si + 'px';
        }
    }
    
    position(orient) {
        if (orient == "vertical") {
            return this.offsetTop
        } else {
            return this.offsetLeft
        }
    }
    getSize(orient) {
        if (orient == "vertical") {
            return this.offsetHeight
        } else {
            return this.offsetWidth
        }
    }
    set orientPos(pos) {
        if (this.parentElement.orientType == "vertical") {
            this.style.top = pos + 'px';
        } else {
            this.style.left = pos + 'px';
        }
    }
    get orientPos() {
        if (this.parentElement.orientType == "vertical") {
            return this.offsetTop
        } else {
            return this.offsetLeft
        }
    }
    toogleDisplay(isToResizeParentsChild = true) {
        if (this.getAttribute("display") == "true") {
            this.setAttribute("display", "false")
        } else {
            this.setAttribute("display", "true")
        }
        if (isToResizeParentsChild) this.parentElement.resize();
    }
    setDisplay(display) {
        this.setAttribute("display", display)
        this.parentElement.resize();
    } 
    getSizableChilds(he = false) {
        return this.getChildren(he).filter(child => child.tagName == "HOLDER-LT" || child.tagName == "CONTENT-LT");
    }
    
    resize(orient = null) {
        this.setSize(orient);
        this.setPositions();
    }
    setSize(o = null) {
        const orient = o == null ? this.orientType : o;

        const holder_contents = this.getSizableChilds(true)
        
        const fixedHolders = holder_contents.filter(child => child.size != "auto");
        const autoHolders = holder_contents.filter(child => child.size == "auto");
        const ignorants = this.getChildren(true).filter(child => child.size == "ignore");
        
        const t = this.getSize(this.orientType) - ignorants.reduce((p, c) => {
            return p + c.orientSize;
        }, 0);
        const fixedHoldersSize = fixedHolders.reduce((p, c) => {
            return p + c.size;
        }, 0);
        const autoHoldersMin = autoHolders.reduce((p, c) => {
            return p + c.min(orient);
        }, 0);
        const autoHoldersMax = autoHolders.reduce((p, c) => {
            return p + c.max(orient);
        }, 0);


        if (t - fixedHoldersSize <= autoHoldersMin) {
            autoHolders.forEach(a => {
                a.orientSize = a.mm_size[0];
                a.resize(o);
            })
            let diff = autoHoldersMin - t + fixedHoldersSize;
            fixedHolders.forEach(f => {
                let f_size = f.size;
                if (diff == 0) {
                    f.orientSize = f_size;
                    f.resize(o);
                    return;
                }
                let f_min = f.min(orient);
                if (diff >= (f_size - f_min)) {
                    f.orientSize = f_min;
                    f.resize(o);
                    diff -= (f_size - f_min)
                } else {
                    f.orientSize = f_size - diff;
                    log({f_min, f_size, diff})
                    f.resize(o);
                    diff = 0;
                }
            })
        } else if (t - fixedHoldersSize >= autoHoldersMax) {
            autoHolders.forEach(a => {
                a.orientSize = a.mm_size[1];
                a.resize(o);
            })
            let extra = t - autoHoldersMax - fixedHoldersSize;
            fixedHolders.forEach(f => {
                let f_size = f.size;
                if (extra == 0) {
                    f.orientSize = f_size;
                    f.resize(o);
                    return;
                }
                let f_max = f.max(orient);
                if (extra >= (f_max - f_size)) {
                    f.orientSize = f_max;
                    f.resize(o);
                    extra -= (f_max - f_size)
                } else {
                    f.orientSize = f_size - extra;
                    f.resize(o);
                    extra = 0;
                }
            })
        } else if (((t - fixedHoldersSize) > autoHoldersMin) || (t - fixedHoldersSize) < autoHoldersMax) {
            fixedHolders.forEach(f => {
                f.orientSize = f.size;
                f.resize(o);
            })
            const commonExtra = Math.floor((t - fixedHoldersSize - autoHoldersMin) / autoHolders.length);
            
            autoHolders.forEach(a => {
                a.orientSize = a.min(orient) + commonExtra;
                a.resize(o);
            })
        } else {
        }
    }
    setPositions() {
        const children = this.getChildren().sort((a, b) => parseInt(a.index) - parseInt(b.index));
    
        let positionBuffer = 0;
        for (let child of children) {
            child.orientPos = positionBuffer;
            positionBuffer += child.orientSize;
        }
    }
    static replace(child1, child2) {
        log(child1, child2)
        child1.classList.add("lt-transition")
        child2.classList.add("lt-transition")
        let temp = child1.getAttribute("index");
        child1.setAttribute("index", child2.getAttribute("index"));
        child2.setAttribute("index", temp);        
        child1.parentElement.resize()
        setTimeout(() => {
            child1.classList.remove("lt-transition")
            child2.classList.remove("lt-transition")
        }, 90);
    }
}