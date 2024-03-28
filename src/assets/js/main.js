import "../sass/book.scss";

import Alpine from "alpinejs";
import mediumZoom from "medium-zoom";
import search from "./search";
import Artalk from "./ArtalkLite";
import quicklink from "quicklink/dist/quicklink.umd";

window.Alpine = Alpine;
Alpine.start();
//init kg-gallery-image

var gallery = document.querySelectorAll(".kg-gallery-image img");
gallery.forEach(function (e) {
    var l = e.closest(".kg-gallery-image"),
        a = e.attributes.width.value / e.attributes.height.value;
    l.style.flex = a + " 1 0%";
});

const images = document.querySelectorAll(".markdown img");
mediumZoom(images, {
    background: "rgba(0,0,0,0.75)",
    container: ".medium-zoom-overlay",
});

search();

if (navigator.serviceWorker) {
    navigator.serviceWorker.register("sw.js", { scope: "/" });
}

if (
    commentinfo.type == "artalk" &&
    document.getElementById("comments") != null
) {
    const artalk = Artalk.init({
        el: commentinfo.el, // 绑定元素的 Selector
        server: commentinfo.server, // 后端地址
        site: commentinfo.name, // 你的站点名
    });
    artalk.on("list-loaded", () => {
        artalk.setDarkMode(
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? true
                : false
        );
    });
}

window.addEventListener("load", () => {
    quicklink.listen();
});
