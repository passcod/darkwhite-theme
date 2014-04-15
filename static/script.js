/*! <-- Until jsDelivr updates it
 * domready (c) Dustin Diaz 2014 - License MIT
 */
!function(e,t){typeof module!="undefined"?module.exports=t():typeof define=="function"&&typeof define.amd=="object"?define(t):this[e]=t()}("domready",function(){var e=[],t,n=document,r="DOMContentLoaded",i=/^loaded|^i|^c/.test(n.readyState);return i||n.addEventListener(r,t=function(){n.removeEventListener(r,t),i=1;while(t=e.shift())t()}),function(t){i?t():e.push(t)}})

(function() {
  var flip, flipper = function(night) {
    var html = document.documentElement;
    if (/flipped/.test(html.className) || !night) {
      html.className = html.className.replace('flipped', '');
      flip.innerHTML = 'day';
      localStorage.setItem('flip', '');
    } else {
      html.className += ' flipped';
      flip.innerHTML = 'night';
      localStorage.setItem('flip', '✓');
    }
  };

  domready(function() {
    flip = document.querySelector('.flip');
    flip.addEventListener('click', flipper, null);
    flipper(localStorage.getItem('flip'));
    setTimeout(function() {
      document.documentElement.className += ' js';
    }, 1000);

    rangy.init();
    var applier = rangy.createCssClassApplier('errata', {
      normalize: true
    });

    Mousetrap.bind('f', function() {
      console.log('f!');
      applier.applyToSelection();
      console.log(document.querySelector('.errata'));
    });
  });
}());
