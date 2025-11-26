export const log = console.log
export class el {
    static async importComponent(src, { type = "component", props = [] } = {}) {
        if (type === "component") {
            const result = [];

            // CSS
            const cssURL = `${src}/${src.slice(src.lastIndexOf("/") + 1)}.css`;
            try {
                const cssText = await fetch(cssURL).then(res => res.text());
                result.push(el.elem("style", cssText));
            } catch (err) {
                console.warn(`CSS not found: ${cssURL}`);
            }

            // EL
            const elURL = `${src}/${src.slice(src.lastIndexOf("/") + 1)}.el`;
            const elText = await fetch(elURL).then(res => res.text());
            result.push(el.elems(elText, props));

            return result;
        }
    }

    static doc = null;
    static initDoc(doc) {
        this.doc = doc;
    }
    static id(id = "") {
        return el.doc.getElementById(id);
    }
    static s(s = "", doc = null) {
        if (doc) {
            return doc.querySelector(s)
        }
        return el.doc.querySelector(s);
    }
    static qa(qa = "", doc = null) {
        if (doc) {
            return doc.querySelectorAll(qa)
        }
        return el.doc.querySelectorAll(qa);
    }
    static name(name = "") {
        return el.doc.getElementByName(name);
    }
    static elem(tag = "span", innerEl = "", parent = null, {
        classLists = [],
        attributes = {},
        events = {},
        properties = {},
        styles = ``
    } = {}) {
        // tag

        const SVG_TAGS = new Set([
            "svg","g","defs","symbol","use",
            "path","rect","circle","ellipse","line","polyline","polygon",
            "text","tspan","textPath",
            "linearGradient","radialGradient","stop","pattern",
            "clipPath","mask","filter",
            "feBlend","feColorMatrix","feComponentTransfer","feComposite",
            "feConvolveMatrix","feDiffuseLighting","feDisplacementMap",
            "feDropShadow","feFlood","feGaussianBlur","feImage","feMerge",
            "feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence",
            "marker","desc","title","metadata","switch","foreignObject"
        ]);
        const MATHML_TAGS = new Set([
            "math","mrow","mi","mn","mo","msup","msub","msubsup","mfrac",
            "msqrt","mroot","mfenced","mtable","mtr","mtd","mover","munder","munderover",
            "mmultiscripts","mpadded","mphantom","merror","menclose","annotation","semantics"
        ]);

        const elem = MATHML_TAGS.has(tag) ? el.doc.createElementNS("http://www.w3.org/1998/Math/MathML", tag) : (SVG_TAGS.has(tag) ? el.doc.createElementNS("http://www.w3.org/2000/svg", tag) : el.doc.createElement(tag));
        // innerEl
        if (typeof innerEl == "string") {
            elem.innerText = innerEl;
        } else elem.append(innerEl)
        //parent
        if (parent != null) parent.append(elem);
        // classLists
        classLists.forEach(cls => {
            elem.classList.add(cls);
        })
        // attributes
        ForEach(attributes, ({cur}) => {
            elem.setAttribute(cur.prop, cur.val);
        })
        // properties
        ForEach(properties, ({cur}) => {
            elem[cur.prop] = cur.val;
        })
        // events
        ForEach(events, ({cur}) => {
            elem.addEventListener(cur.prop, function(e) {
                e.element = elem;
                cur.val(e)
            });
        })
        // styles
        el.style(elem, styles);
        return elem;
    }
    static elems(HTML = "", variables = []) {
        let lines = HTML.split("\n");

        let tokenizer = new Tokenizer({
            Word: /\w[\w\d-]*/,
            Number: /(\d*[_]?)*\d{1,3}/,
            Operator: /[@#$.*&=%:]/,
            String: /\"[^\"]*\"?|\'[^\']*\'?/,
            Space: /\s*/,
            Indent: {
                futuerCount: 4,
                checker: /\s{4}/,
                start: /\s/
            },
            Error: /[^\w\d@#$.*=\"\'\{\}\s-}]/,
        });

        let tokenizedLines = [];
        lines.forEach(line => {
            if (line.slice().trimStart()[0] != "%") {
                tokenizedLines.push(tokenizer.tokenize(line));
            } else {
                tokenizedLines.push([...tokenizer.tokenize(line.slice(0, line.length - line.slice().trimStart().length + 1)), new Tokenizer.Token("String", line.slice(line.length - line.slice().trimStart().length + 1))])
            }
        })
        
        let astForElement = [];
        ForEach(tokenizedLines, ({cur}) => {
            if (cur.filter?.(token => token.type != "Indent")[0]?.value == "@") {
                astForElement.push(new el.elemsCodeASTProducer(cur).result);
            } else {
                let tabCount = -cur.reduce?.((pre, cur1) => {
                    if (cur1.type == "Indent" && (pre + Math.abs(pre) != 0)) {
                        pre += 1;
                        return pre;
                    } else {
                        pre = -1 * Math.abs(pre);
                        return pre;
                    }
                }, 1) - 1;
                ForEach(tabCount, () => {cur.shift()})
                if (cur[0]?.value == "%") {
                    cur.shift();
                    astForElement.push(
                        new el.elemsCodeASTProducer.Text(
                            cur.reduce?.((pre, cur) => {
                                pre += cur.value
                                return pre;
                            }, ""), 
                            tabCount 
                        )
                    );                    
                }

            }
        });

        let els = [];
        let ref = {};
        astForElement.forEach(element => {
            if (element.constructor.name == "Element") {
                let classLists = [];
                element.classLists.forEach(item => {
                    classLists.push(item.value)
                })
                let attributes = {};
                element.attributes.forEach(item => {
                    attributes[item.name] = item.value;
                })
                let properties = {};
                element.properties.forEach(item => {
                    properties[item.name] = variables[item.value.value - 1];
                })
                
                let events = {};
                element.events.forEach(item => {
                    events[item.name] = variables[item.value.value - 1];
                })
                
                ref[element.name] = el.elem(element.tagName, "", null, {
                    classLists,
                    attributes,
                    properties,
                    events
                });
                els.push({
                    element: ref[element.name],
                    tabCount: element.tabCount
                })
            } else if (element.constructor.name == "Text") {
                els.push({
                    element: element.text,
                    tabCount: element.tabCount
                })
            }
        });

        let rev = els.slice().reverse();

        let count = 0;
        rev.forEach(item => {
            count++
            for (let i = 0; i < rev.length - count; i++) {
                if (rev[count + i].tabCount + 1 == item.tabCount) {
                    if (rev[count + i].element.childNodes.length == 0) {
                        rev[count + i].element.append(item.element);
                    } else {
                        rev[count + i].element.insertBefore(item.element, rev[count + i].element.firstChild);
                    }

                    break;
                }
            }
        });
        return {
            element: els.filter(item => item.tabCount == 0)[0].element,
            reference: ref
        }
    }
    static elemsCodeASTProducer = class {
        constructor(tokens) {
            this.tokens = tokens.filter(val => val.type != "Space");
            this.count = 1;
            
            let tabCount = -this.tokens.reduce((pre, cur) => {
                if (cur.type == "Indent" && (pre + Math.abs(pre) != 0)) {
                    pre += 1;
                    return pre;
                } else {
                    pre = -1 * Math.abs(pre);
                    return pre;
                }
            }, 1) - 1;
            ForEach(tabCount, () => this.eat())
            this.tokens = this.tokens.filter(val => val.type != "Indent");

            this.expect(["@"], "value");
            let tagName = this.expect("Word", "type").value;

            // prop

            let classLists = []
            let attributes = []
            let events = []
            let properties = []
            let elementName;
            loop: while (this.tokens.length > 0) {
                if (this.is(["Word"], "type")) {
                    let attrName = this.expect(["Word"], "type");
                    this.expect(["="], "value");
                    let attrVal = this.expect(["Word", "String", "Number"], "type");


                    attributes.push(new el.elemsCodeASTProducer.Attribute(attrName.value, attrVal.type == "String" ? attrVal.value.slice(1, -1) : attrVal.value));
                    continue loop;
                }
                let operator = this.expect(["#", ".", "&", "*", "$"], "value").value;

                switch (operator) {
                    case "#": {
                        let idName = this.expect(["Word"], "type").value;

                        attributes.push(new el.elemsCodeASTProducer.Attribute("id", idName));
                        continue loop;
                    }
                    case ".": {
                        let className = this.expect(["Word"], "type").value;

                        classLists.push(new el.elemsCodeASTProducer.Attribute("class", className));
                        continue loop;
                    }
                    case "&": {
                        elementName = this.expect(["Word"], "type").value;
                        break loop;
                    }
                    case "*": {
                        let propName = this.expect(["Word"], "type");
                        this.expect(["="], "value");
                        let propVal = this.expect(["Word", "String", "Number"], "type");

                        properties.push(new el.elemsCodeASTProducer.Attribute(propName.value, propVal));
                        continue loop;
                    }
                    case "$": {
                        let eventName = this.expect(["Word"], "type");
                        this.expect(["="], "value");
                        let eventVal = this.expect(["Word", "String", "Number"], "type");

                        events.push(new el.elemsCodeASTProducer.Attribute(eventName.value, eventVal));
                        continue loop;
                    }
                }

            }

            this.result = new el.elemsCodeASTProducer.Element(tagName, {
                attributes, events, classLists, properties
            }, tabCount, elementName)

        }
        static Attribute = class {
            constructor(name, value) {
                this.name = name;
                this.value = value;
            }
        }
        static Element = class {
            constructor(tagName = "span", {
                classLists = [],
                attributes = {},
                events = {},
                properties = {},
            }, tabCount, elementName) {
                this.tagName = tagName;
                this.events = events;
                this.properties = properties;
                this.classLists = classLists;
                this.attributes = attributes;
                this.tabCount = tabCount;
                this.name = elementName;
            }
        }
        static Text = class {
            constructor(text, tabCount) {
                this.text = text;
                this.tabCount = tabCount;
            }
        }
        eatIf(val, typ) {
            if (val.includes(this.tokens[0][typ])) {
                this.count++
                return this.tokens.shift();
            }
        }
        is(val, typ) {
            return val.includes(this.tokens[0][typ]);s
        }
        expect(val, typ) {
            if (val.includes(this.tokens[0][typ])) {
                this.count++
                return this.tokens.shift();
            } else {
                console.log(this.tokens[0],"f", val)
                throw new Error(`Unexpected Syntax Error: Expected a {${typ}} of {${val}} but seen a Token with a value of {${this.tokens[0][typ]}}.. Token: ${this.count}`, this.tokens[0])
            }
        }
        eat() {
            this.count++
            return this.tokens.shift();
        }
    }
    static style(elem = null, styles = ``) {
        if (elem == null) return;
        let lines = styles.split("\n");
        lines = lines.reduce((pre, cur) => {
            let arr = pre;
            if (cur.trim() != "") {
                arr.push([...cur.trim().split(": ")]);
            }
            return arr;
        }, []);
        lines.forEach(style => {
            elem.style.setProperty(style[0], style[1].replaceAll(";", ""));
        })
    }
}

export function ForEach(LoopSet = [], LoopFunc = () => {}, defaultPre = null) {
    if (typeof LoopSet == "string") {
        let pre = defaultPre;

        let length = LoopSet.split("");
        let stopper = false;
        for (let i = 0; (i < length) & !stopper; i++) {
            pre = LoopFunc({
                pre,
                cur: LoopSet[i],
                count: i,
                Stop: () => {
                    stopper = true;
                },
                LoopNext(num = 1) {
                    i += num;
                }
            })
        }
        return pre;
    } else if (typeof LoopSet == "number") {
        let pre = defaultPre;

        let stopper = false;
        for(let i = 0; (i < LoopSet) & !stopper ; i++) {
            pre = LoopFunc({
                pre,
                cur: i,
                Stop() {
                    stopper = true;
                },
                LoopNext(num = 1) {
                    i += num;
                }
            })
        }
        return pre;
    } else {
        switch ((LoopSet).constructor.name) {
            case "Array": {
                let pre = defaultPre;
                
                let length = LoopSet.length;
                let stopper = false;
                for (let i = 0; (i < length) & !stopper; i++) {
                    pre = LoopFunc({
                        pre,
                        cur: LoopSet[i],
                        count: i,
                        Stop: () => {
                            stopper = true;
                        },
                        LoopNext(num = 1) {
                            i += num;
                        }
                    })
                }
            }
            case "Object": {
                let pre = defaultPre;

                let propArray = []
                for (const prop in LoopSet) {
                    propArray.push(prop);
                }

                let length = propArray.length;
                let stopper = false;
                for (let i = 0; (i < length) & !stopper; i++) {
                    pre = LoopFunc({
                        pre,
                        cur: {
                            prop: propArray[i],
                            val: LoopSet[propArray[i]]
                        },
                        count: i,
                        Stop: () => {
                            stopper = true;
                        },
                        LoopNext(num = 1) {
                            i += num;
                        }
                    })
                }
            }
        }
    }
}
export class Tokenizer {
    constructor(rules) {
        this.rules = rules;
    }
    tokenize(str) {
        let r = this.rules;

        str = str.trimEnd() + ".s";

        let tokens = []

        let count = 0;

        let curType = null;
        let curText = "";

        loop: while (str.length - 1 > count) {
            if (curType == null) {
                checkerLoop: for (const type in r) {
                    if (Tokenizer.check(str[count], r[type], count, str) == 1 || Tokenizer.check(str[count], r[type], count, str) == 2) {
                        curType = type;
                    }
                }
            } else {
                switch (Tokenizer.check(curText + str[count], r[curType], count, str)) {
                    case 0: {
                        tokens.push(new Tokenizer.Token(curType, curText));
                        curText = "";
                        curType = null;
                        break;
                    }
                    case 1: {
                        curText += str[count];
                        count++
                        break;
                    }
                    case 2: {
                        curText += str.slice(count, count + r[curType].futuerCount);
                        count += r[curType].futuerCount;
                        tokens.push(new Tokenizer.Token(curType, curText));
                        curText = "";
                        curType = null;
                        continue loop;
                    }
                }
            }
        }
        return tokens;
    }
    static Token = class {
        constructor(type, val) {
            this.type = type;
            this.value = val;
        }
    }
    static check(str, type, count, text) {
        if (type?.constructor.name == "RegExp") {
            return str.replace(type, "") == "" ? 1 : 0;
        } else {
            if (str.replace(type.start, "") == "") {
                let futuerText = ""
                ForEach(type.futuerCount, c => {
                    futuerText += text[count + c.cur];
                })
                return futuerText.replace(type.checker, "") == "" ? 2 : 0;
            }
        }
    }
}

export const Debugger = {
    status: false,
    debug(stat = false) {
        if (Debugger.status || stat) {
            debugger
        }
    },
    toggle() {
        Debugger.status = !Debugger.status;
        return Debugger.status
    }
}

export class SetRange {
    constructor(setDetails = []) {
        setDetails = setDetails.reduce((pre, cur) => {
            if (cur.range.length == 2 && typeof cur.range[0] == "number" && typeof cur.range[1] == "number" && cur.info.length == 2 && (cur.info[0] == 1 || cur.info[0] == 0) && (cur.info[1] == 1 || cur.info[1] == 0)) {
                cur.range = cur.range.sort((i, j) => i - j);
                pre.push(cur)
                return pre;
            } else {
                throw new Error("Invalid Set details has been given..!", cur);
            }
        }, []);
        this.normaliseRangeSets();
        this.set = setDetails;
    }
    normaliseRangeSets() {
        
    }
    static union(set1, set2) {
        return new SetRange([set1, set2]);
    }
    add(set) {
        this.set.push(set);
        this.normaliseRangeSets();
    }
    static intersection(set1, set2) {
        let res = new SetRange([]);
        set1.set.forEach(i => {
            set2.set.forEach(j => {
                if (SetRange.isThatBelongs(i, j.range[1]) && SetRange.isThatBelongs(j, i.range[0])) {
                    res.add({
                        range: [i.range[0], j.range[1]],
                        info: [i.info[0], j.info[1]]
                    })
                } else if (SetRange.isThatBelongs(i, j.range[0]) && SetRange.isThatBelongs(j, i.range[1])) {
                    res.add({
                        range: [j.range[0], i.range[1]],
                        info: [j.info[0], i.info[1]]
                    })
                } else if (SetRange.isThatBelongs(j, i.range[0]), SetRange.isThatBelongs(j, i.range[1])) {
                    res.add(i);
                } else if (SetRange.isThatBelongs(i, j.range[0]), SetRange.isThatBelongs(i, j.range[1])) {
                    res.add(j);
                }
            })
        })
        return res;
    }
    has(number) {
        return this.set.some(set => {
            if (set.info[0] == 1 && set.info[1] == 1) {
                return set.range[0] <= number && number <= set.range[1];
            } else if (set.info[0] == 1 && set.info[1] == 0) {
                return set.range[0] <= number && number < set.range[1];
            } else if (set.info[0] == 0 && set.info[1] == 1) {
                return set.range[0] < number && number <= set.range[1];
            } else {
                return set.range[0] < number && number < set.range[1];
            }
        })
    }
    static isThatBelongs(range = {}, number) {
        if (range.info[0] == 1 && range.info[1] == 1) {
            return range.range[0] <= number && number <= range.range[1];
        } else if (range.info[0] == 1 && range.info[1] == 0) {
            return range.range[0] <= number && number < range.range[1];
        } else if (range.info[0] == 0 && range.info[1] == 1) {
            return range.range[0] < number && number <= range.range[1];
        } else {
            return range.range[0] < number && number < range.range[1];
        }
    }
    shift(num) {
        this.set = this.set.reduce((pre, cur) => {
            let range = {
                range: [cur.range[0] + num, cur.range[1] + num],
                info: [cur.info[0], cur.info[1]]
            }
            pre.push(range);
            return pre;
        }, []);
    }
    offsettedBy(num) {
        let min = this.set[0].range[0];
        let max = this.set.at(-1).range[1];

        if (num < min) {
            return -1;
        } else if (num > max) {
            return 1;
        } else {
            return 0;
        }
    }
}
export function *IdMaker() {
    let num = 0;
    while (true) {
        yield num;
        num++
    }
}
export class Timer {
    #paused = false
    constructor() {
        this.constant = new Date()
        this.time = 0;
        this.update()
    }
    set paused(v) {
        this.#paused = v;
        this.update()
    }
    update() {
        if (this.#paused) return;
        this.time += new Date() - this.constant
        setTimeout(() => {
            this.update()
        },  1000)
    }
}
export function IntegerRange(ul = 0, ll = 1, step = 1) {
    const array = [];
    for (let i = ul; (ul < ll) ? i < ll : i > ll; i += step) {
        array.push(i);
    }
    return array;
}
export class Matrix {
    constructor(mat = []) {
        this.matrix = mat
    }
    get x() {
        return this.matrix[0].length;
    }
    get y() {
        return this.matrix.length;
    }
    rotate() {
        let m = new Array(this.y);
        for (const i in IntegerRange(0, this.y)) {
            m[i] = this.matrix.map(val => val[i]).reverse();
        }
        return new Matrix(m);
    }
    mirrorY() {
        return new Matrix(this.matrix.reduce((pre, cur) => {
            pre.push(cur.reverse());
            return pre;
        }, []));
    }
    mirrorX() {
        return new Matrix(this.matrix.reverse());
    }
    mirrorLR() {
        let m = new Array(this.y);
        for (const i in IntegerRange(0, this.y)) {
            m[i] = this.matrix.map(val => val[i]);
        }
        return new Matrix(m);
    }
    mirrorRL() {
        return this.mirrorY().mirrorLR().mirrorY();
    }
    static isEqual(m1, m2) {
        return m1.matrix.toString() === m2.matrix.toString();
    }
}
export class Random {
    static choice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
}
export class Status {
    #choices;
    #index;
    constructor(choises, index = 0) {
        this.#choices = choises;
        this.#index = index;
        this.status = choises[index];
    }
    toogle(value = null) {
        if (!value || this.#choices.indexOf(value) == -1) {
            this.#index += 1;
            if (this.#index = this.#choices.length) this.#index = 0;
            this.status = this.#choices[this.#index];
            return this.status;
        } else {
            this.#index = this.#choices.indexOf(value);
            this.status = this.#choices[this.#index];
            return this.status;
        }
    }
}