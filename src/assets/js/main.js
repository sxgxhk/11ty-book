import '../sass/book.scss';

import Alpine from 'alpinejs'
import mediumZoom from 'medium-zoom';
import search from './search';


window.Alpine = Alpine

Alpine.start()

//init kg-gallery-image
var gallery = document.querySelectorAll(".kg-gallery-image img");
gallery.forEach(function(e) {
    var l = e.closest(".kg-gallery-image")
      , a = e.attributes.width.value / e.attributes.height.value;
    l.style.flex = a + " 1 0%"
});

const images = document.querySelectorAll('.markdown img');
  mediumZoom(images, {
    background: 'rgba(0,0,0,0.75)',
    container: '.medium-zoom-overlay'
});


search()