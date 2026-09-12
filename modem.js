// Home-page effects: the first photograph loads as if over a 56k
// modem (blocky preview, then a sharp top-down scan), and the
// visitor counter renders as a red-on-black 7-segment display.
(function () {
  var BLOCK_PAUSE = 450;      // ms the blocky preview lingers
  var MIN_MS = 1400;          // scan duration bounds
  var MAX_MS = 4200;

  function reveal(img) {
    var w = img.width || parseInt(img.getAttribute("width"), 10);
    var h = img.height ||
            Math.round(w * img.naturalHeight / img.naturalWidth);
    if (!w || !h) return;
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    img.parentNode.replaceChild(canvas, img);
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#999999";
    ctx.fillRect(0, 0, w, h);

    // Blocky first pass, as if only a few kilobytes have arrived.
    var tiny = document.createElement("canvas");
    var tw = Math.max(1, Math.round(w / 16));
    var th = Math.max(1, Math.round(h / 16));
    tiny.width = tw;
    tiny.height = th;
    tiny.getContext("2d").drawImage(img, 0, 0, tw, th);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tiny, 0, 0, tw, th, 0, 0, w, h);
    ctx.imageSmoothingEnabled = true;

    var duration = Math.min(MAX_MS, Math.max(MIN_MS, (w * h) / 220));
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var f = Math.min(1, (t - start - BLOCK_PAUSE) / duration);
      if (f > 0) {
        var rows = Math.max(1, Math.round(h * f));
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight * f,
                      0, 0, w, rows);
      }
      if (f < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // Which segments light up for each digit: a=top, b=top-right,
  // c=bottom-right, d=bottom, e=bottom-left, f=top-left, g=middle.
  var SEGMENTS = {
    "0": "abcdef", "1": "bc",     "2": "abged",  "3": "abgcd",
    "4": "fgbc",   "5": "afgcd",  "6": "afgecd", "7": "abc",
    "8": "abcdefg", "9": "abcdfg"
  };

  // Each visitor gets their own count, kept in localStorage and
  // starting at 1994 — the counter equivalent of setting your first
  // watch to the right-looking time.
  function visitorNumber() {
    var n;
    try {
      n = parseInt(localStorage.getItem("visitor-count"), 10);
      n = isNaN(n) ? 1994 : n + 1;
      localStorage.setItem("visitor-count", String(n));
    } catch (e) {
      n = 1994;
    }
    var s = String(n);
    while (s.length < 6) s = "0" + s;
    return s;
  }

  function drawCounter() {
    var canvas = document.getElementById("visitor-counter");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var count = visitorNumber();
    var t = 3, dw = 16, dh = 26, gap = 6, pad = 6;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var half = (dh - 3 * t) / 2;
    for (var i = 0; i < count.length; i++) {
      var x = pad + i * (dw + gap), y = pad;
      var lit = SEGMENTS[count.charAt(i)] || "";
      var seg = {
        a: [x + t, y, dw - 2 * t, t],
        b: [x + dw - t, y + t, t, half],
        c: [x + dw - t, y + 2 * t + half, t, half],
        d: [x + t, y + dh - t, dw - 2 * t, t],
        e: [x, y + 2 * t + half, t, half],
        f: [x, y + t, t, half],
        g: [x + t, y + t + half, dw - 2 * t, t]
      };
      for (var name in seg) {
        ctx.fillStyle = lit.indexOf(name) >= 0 ? "#ff2200" : "#2f0000";
        var r = seg[name];
        ctx.fillRect(r[0], r[1], r[2], r[3]);
      }
    }
  }

  drawCounter();

  var img = document.images[0];
  if (img) {
    if (img.complete && img.naturalWidth) reveal(img);
    else img.onload = function () { reveal(img); };
  }
})();
