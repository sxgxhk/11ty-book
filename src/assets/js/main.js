import "../sass/book.scss";

import Alpine from "alpinejs";
import mediumZoom from "medium-zoom";
import search from "./search";
import Artalk from "./ArtalkLite";
import quicklink from "quicklink/dist/quicklink.umd";

window.Alpine = Alpine;
Alpine.data('theme', () => ({
    themeName:localStorage.name,
    changeTheme:changeTheme,
    setName: function(){
        this.themeName = localStorage.name
    }
}))
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
    navigator.serviceWorker.register(location.origin + "/sw.js", {
        scope: location.origin,
    });
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

function changeTheme(theme,name) {
    if(theme == 'auto') {
        document.documentElement.setAttribute("class","");
    }else{
        // 切换主题并存储到localStorage
        document.documentElement.setAttribute("class", theme);
    }
    localStorage.theme = theme;
    localStorage.setItem('name',name);
}
