import initLayout from "./Lib/LayoutJS/main.js";
import RangeLT from "./Lib/LayoutJS/range.js";
import { Debugger, el, IdMaker, log, Status } from "./Lib/Tool.js";

el.initDoc(document);
initLayout(window);

window.el = el;
window.Debugger = Debugger;

function resizer() {
    const body = el.s("body");
    body.style.height = window.innerHeight + "px";
    body.style.width = window.innerWidth + "px";
}
window.addEventListener("resize", resizer);
resizer();

el.s("layout-lt").initLayout();
el.s("layout-lt").resize("right");
el.s("layout-lt").resize("bottom");
el.id("bid-cont").toogleDisplay();
el.id("bid-cont-resizer").toogleDisplay();

el.s("#side-bar > .btn[name='dash']").addEventListener("click", () =>
    onSideBtnClick("dash")
);
el.s("#side-bar > .btn[name='track']").addEventListener("click", () =>
    onSideBtnClick("track")
);
el.s("#side-bar > .btn[name='chat']").addEventListener("click", () =>
    onSideBtnClick("chat")
);
el.s("#side-bar > .btn[name='document']").addEventListener("click", () =>
    onSideBtnClick("document")
);

const bidStatus = new Status(["dash", "track", "chat", "document", false], 3);

function onSideBtnClick(name) {
    if (bidStatus.status == name) {
        bidStatus.toogle(false);
        el.id("bid-cont").toogleDisplay();
        el.id("bid-cont-resizer").toogleDisplay();
    } else {
        bidStatus.toogle(name);
        el.id("content-container").setAttribute("name", name);
        el.id("bid-cont").setDisplay("true");
        el.id("bid-cont-resizer").setDisplay("true");
    }
    setBidWindows(bidStatus.status);
}
function setBidWindows(name) {
    if (!name) return;
    for (const hold of el.qa("holder-lt#bid-cont > holder-lt")) {
        hold.setAttribute("display", "false");
    }
    el.s(`#bid-cont > holder-lt[name='${name}'`).setAttribute("display", "true");
    el.id("bid-cont").resize();
}
const newGroupID = IdMaker();
el.id("new-grade-btn").addEventListener("click", () => {
    el.importComponent("./frontend/El-elements/s-group-tab", {
        type: "component",
        props: ["Group " + (newGroupID.next().value + 1)],
    }).then((res) => {
        const cont = el.elem("div");
        const [style, { element, reference }] = res;
        reference.nameCont.addEventListener("dblclick", () => {
            reference.nameCont.style.display = "none";
            reference.inp.value = reference.nameCont.innerText;
            reference.inp.style.display = "grid";
            reference.inp.focus();
        });
        reference.nameCont.addEventListener('click', () => {
            
        });
        reference.inp.addEventListener("blur", blur);
        reference.inp.addEventListener("keydown", (e) => {
            if (e.key == "Enter") blur();
        });
        function blur() {
            const val = reference.inp.value;
            reference.name.innerHTML = val == "" ? "Group" : val;
            reference.nameCont.style.display = "grid";
            reference.inp.style.display = "none";
        }
        reference.delGroup.addEventListener("click", () => {
            cont.remove();
        });
        reference.foldBtn.addEventListener("click", () => {
            if (reference.gradeCont.style.display == "none") {
                reference.gradeCont.style.display = "grid";
                reference.foldBtn.childNodes[0].style.transform = "rotate(0deg)";
            } else {
                reference.gradeCont.style.display = "none";
                reference.foldBtn.childNodes[0].style.transform = "rotate(90deg)";
            }
        });
        const id2 = IdMaker();
        reference.addsub.addEventListener("click", () => {
            el.importComponent("./frontend/El-elements/subject-tab", {
                type: "component",
                props: ["Subject " + (id2.next().value + 1)],
            }).then((res2) => {
                const cont2 = el.elem("div");
                cont2.append(res2[0], res2[1].element);
                reference.gradeCont.append(cont2);

                res2[1].reference.nameCont.addEventListener("dblclick", () => {
                    res2[1].reference.nameCont.style.display = "none";
                    res2[1].reference.inp.value = res2[1].reference.nameCont.innerText;
                    res2[1].reference.inp.style.display = "grid";
                    res2[1].reference.inp.focus();
                });
                res2[1].reference.inp.addEventListener("blur", blur2);
                res2[1].reference.inp.addEventListener("keydown", (e) => {
                    if (e.key == "Enter") blur2();
                });
                res2[1].reference.gradeCont.parentElement.parentElement.addSub = res2[1].reference.addsub;
                res2[1].reference.gradeCont.parentElement.parentElement.gradeCont = res2[1].reference.gradeCont;
                res2[1].reference.gradeCont.parentElement.parentElement.gradeCont.copy = org => {
                    setTimeout(() => {
                        const repl = res2[1].reference.gradeCont.parentElement.parentElement.gradeCont;
                        const ln = repl.childNodes.length;
                        for (let i = 0; i < ln; i++) {
                            const r = repl.childNodes[i];
                            const o = org.childNodes[i];
                            el.s("div.first > #name-txt", r).innerText = el.s("div.first > #name-txt", o).innerText;
                            el.s("div.second > #name-txt", r).innerText = el.s("div.second > #name-txt", o).innerText;
                        }
                    }, 50);
                };
                function blur2() {
                    const val = res2[1].reference.inp.value;
                    res2[1].reference.name.innerHTML = val == "" ? "Subject" : val;
                    res2[1].reference.nameCont.style.display = "grid";
                    res2[1].reference.inp.style.display = "none";
                }
                res2[1].reference.delGroup.addEventListener("click", () => {
                    cont2.remove();
                });
                res2[1].reference.foldBtn.addEventListener("click", () => {
                    if (res2[1].reference.gradeCont.style.display == "none") {
                        res2[1].reference.gradeCont.style.display = "grid";
                        res2[1].reference.foldBtn.childNodes[0].style.transform = "rotate(0deg)";
                    } else {
                        res2[1].reference.gradeCont.style.display = "none";
                        res2[1].reference.foldBtn.childNodes[0].style.transform = "rotate(90deg)";
                    }
                });
                res2[1].reference.nameCont.addEventListener("click", () => {
                    const data = [];
                    const labels = [];
                    for (const child of el.qa("#name-place.second", res2[1].reference.gradeCont)) {
                        const [_1, _2] = child.innerText.split("/");
                        data.push((parseFloat(_1) / parseFloat(!_2 ? 100 : _2)) * 100);
                    }
                    for (const child of el.qa("#name-place.first", res2[1].reference.gradeCont)) {
                        labels.push(child.innerText);
                    }
                    myChart.config._config.data.datasets[0].data = data.slice();
                    myChart.config._config.data.labels = labels.slice();
                    myChart.update();
                })
                res2[1].reference.dup.addEventListener("click", () => {
                    reference.addsub.dispatchEvent(new Event("click"));
                    res2[1].reference.dup.setAttribute("disabled", "true");
                    setTimeout(() => {
                        const len = res2[1].reference.gradeCont.childNodes.length;
                        for (let i of new Array(len).fill(0)) {
                            reference.gradeCont.lastChild.addSub.dispatchEvent(new Event("click"));
                        }
                        reference.gradeCont.lastChild.gradeCont.copy(res2[1].reference.gradeCont);
                        res2[1].reference.dup.removeAttribute("disabled");
                    }, 500);
                })
                const id_101 = IdMaker();
                res2[1].reference.addsub.addEventListener("click", () => {
                    el.importComponent("./frontend/El-elements/mark-tab", { type: 'component', props: [
                        "Mark " + (id_101.next().value + 1)
                    ]}).then(c => {
                        const mark = el.elem("div");
                        mark.append(c[0], c[1].element);
                        res2[1].reference.gradeCont.append(mark);
                        c[1].reference.nameCont.addEventListener("dblclick", () => {
                            c[1].reference.nameCont.style.display = "none";
                            c[1].reference.inp.value = c[1].reference.nameCont.innerText;
                            c[1].reference.inp.style.display = "grid";
                            c[1].reference.inp.focus();
                        });
                        c[1].reference.inp.addEventListener("blur", blur3);
                        c[1].reference.inp.addEventListener("keydown", (e) => {
                            if (e.key == "Enter") blur3();
                        });
                        function blur3() {
                            const val = c[1].reference.inp.value;
                            c[1].reference.name.innerHTML = val == "" ? "Subject" : val;
                            c[1].reference.nameCont.style.display = "grid";
                            c[1].reference.inp.style.display = "none";
                        }
                        c[1].reference.delGroup.addEventListener("click", () => {
                            mark.remove();
                        });
                        c[1].reference.name2.addEventListener("dblclick", () => {
                            c[1].reference.nameCont2.style.display = "none";
                            c[1].reference.inp2.value = c[1].reference.nameCont2.innerText
                            c[1].reference.inp2.style.display = "grid";
                            c[1].reference.inp2.focus();
                        });
                        c[1].reference.inp2.addEventListener("blur", blur4);
                        c[1].reference.inp2.addEventListener("keydown", (e) => {
                            if (e.key == "Enter") blur4();
                        });
                        function blur4() {
                            const val = c[1].reference.inp2.value;
                            c[1].reference.name2.innerHTML = val == "" ? "Subject" : val;
                            c[1].reference.nameCont2.style.display = "grid";
                            c[1].reference.inp2.style.display = "none";
                        }
                    })
                })
            });
        });
        cont.append(style, element);
        el.id("subjects-list").append(cont);
    });
});
window.myChart = new Chart(el.id("canva").getContext('2d'), {
    type: 'line',
    data: {
        labels: ['Test 1', 'Test 2', 'Test 3', 'Test 4'], // example labels
        datasets: [{
            label: 'Scores',
            data: [70, 75, 80, 85], // sample data
            borderColor: '#0078d4',
            backgroundColor: '#0078d4',
            pointBackgroundColor: '#0078d4',
            pointBorderColor: '#fff',
            borderWidth: 2,
            tension: 0.3 // smooth curve
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    color: 'white' // X-axis label color
                },
                grid: {
                    color: '#3c0b66'
                }
            },
            y: {
                ticks: {
                    color: 'white' // Y-axis label color
                },
                grid: {
                    color: '#3c0b66'
                },
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Legend text
                }
            },
            tooltip: {
                titleColor: 'white',
                bodyColor: 'white'
            }
        }
    }
});
// log(myChart)
async function getPrediction(studentData) {
    try {
        const response = await fetch("http://localhost:8000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(studentData)
        });

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const result = await response.json();
        return result; // { predicted_avg: 82.4, suggestion: "Improve math basics..." }

    } catch (err) {
        console.error("Prediction Error:", err);
        return null;
    }
}
el.id("predict-btn").addEventListener("click", () => {
    
})