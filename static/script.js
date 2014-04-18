(function() {
  var originals = [];
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

  var gcRun = function() {
    var gc = document.querySelectorAll('.gc');
    var i = 0, item;
    for (; i < gc.length; ++i) {
      item = gc[i];
      item.outerHTML = item.innerHTML;
    }
  };

  var saveOriginals = function() {
    var sources = document.querySelectorAll('article[data-href]:not([data-excerpt])');
    var i = 0, item;
    for (; i < sources.length; ++i) {
      item = sources[i];
      console.log('save original ' + item.dataset.href);
      originals.push({
        link: item.dataset.href,
        content: item.innerHTML
      });
    }
  };

  var sendDiff = function() {
    gcRun();
    originals.forEach(function(original) {
      var current = document.querySelector('article[data-href="' + original.link + '"]');
      if (current !== null) {
        if (current.innerHTML == original.content) {
          console.log(original.link + ': no changes');
        } else {
          var diff = JsDiff.createPatch(
            /@/.test(original.link) ?
              original.link.replace(/@[^\/]+/, '@' + current.dataset.sha) :
              '/@' + current.dataset.sha + original.link,
            original.content,
            current.innerHTML
          );

          var xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://whitealdus-kifkif.herokuapp.com/pub/diff');
          xhr.send(diff);
        }
      }
    });
  };

  domready(function() {
    saveOriginals();

    flip = document.querySelector('.flip');
    flip.addEventListener('click', flipper, null);
    flipper(localStorage.getItem('flip'));
    setTimeout(function() {
      document.documentElement.className += ' js';
    }, 1000);

    rangy.init();
    var applier = rangy.createCssClassApplier('errata', {
      elementProperties: {
        className: 'mousetrap',
        contentEditable: true
      },
      normalize: true
    });

    Mousetrap.bind('shift shift', function() {
      console.log('edit!');
      
      var sel = rangy.getSelection();
      setTimeout(function() {
        applier.applyToSelection();
        console.log(sel);
      }, 200);
    });

    Mousetrap.bind('ctrl+enter', function() {
      console.log('save!');
      document.documentElement.focus();
      
      var erratas = document.querySelectorAll('.errata');
      var i = 0, item;
      for (; i < erratas.length; ++i) {
        item = erratas[i];
        item.contentEditable = false;
        item.className = 'gc';
      }

      sendDiff();
    });
  });
}());
