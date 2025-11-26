import Bar from "./bar.js";
import ButtonLT from "./button.js";
import Content from "./content.js";
import Divider from "./divider.js";
import Holder from "./holder.js";
import Layout from "./layout.js";
import RangeLT from "./range.js";
import Resizer from "./resizer.js";

export const layout = Layout;
export default function initLayout(win) {
    win.customElements.define("layout-lt", Layout);
    win.customElements.define("holder-lt", Holder);
    win.customElements.define("content-lt", Content);
    win.customElements.define("resizer-lt", Resizer);
    win.customElements.define("bar-lt", Bar);
    win.customElements.define("button-lt", ButtonLT)
    win.customElements.define("divider-lt", Divider);
    win.customElements.define("range-lt", RangeLT);
}