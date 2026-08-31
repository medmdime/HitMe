/* ============================================================
   SplitBar — le device n°1 du format science-reel.
   Une barre qui monte, se découpe en segments étiquetés, en
   isole un, le sort, le fait grossir. 16 des 18 inserts de
   cette vidéo sont ce composant avec des props différentes.

   Contrat HyperFrames :
   - aucune transition CSS, tout passe par GSAP (le rendu doit
     être seekable frame par frame) ;
   - aucune source de non-déterminisme (pas de Date.now, pas de
     Math.random, pas de fetch) ;
   - les étiquettes vivent dans un CALQUE À PART, jamais dans le
     segment : un texte qui déborde de son bloc coloré fait
     échouer `hyperframes check` au poste Layout, et la géométrie
     calculée est de toute façon plus fiable qu'un `bottom: 100%`
     quand la hauteur du segment est animée ;
   - chaque méthode ÉCRIT dans une timeline fournie à une
     position donnée et renvoie la position de fin, pour que les
     appels se chaînent sans compter les secondes à la main.

   API
   ---
   const bar = SplitBar.mount(el, {
     layout: 'stack' | 'group',
     segments: [{ key, label, value, pct, color }],
     width, height, gap, labelGap
   })

   bar.grow(tl, at, opts)              -> fin   les segments montent de 0 à leur taille
   bar.split(tl, at, opts)             -> fin   les segments s'écartent
   bar.focus(tl, at, key, opts)        -> fin   isole un segment, atténue les autres
   bar.clearFocus(tl, at, opts)        -> fin
   bar.labels(tl, at, keys, opts)      -> fin   fait apparaître des étiquettes
   bar.mark(tl, at, key, kind, opts)   -> fin   croix ou coche sur un segment
   bar.resize(tl, at, key, pct, opts)  -> fin   change une part, les autres se réajustent
   bar.extract(tl, at, key, opts)      -> fin   sort un segment sur le côté
   bar.bracket(tl, at, keys, l, opts)  -> fin   accolade sur un groupe

   Chaque segment expose bar.nodes[key] = { seg, fill, label, mark }.
   ============================================================ */

(function (global) {
  "use strict";

  var EASE_IN = "power3.out";
  var EASE_MOVE = "power2.inOut";

  function el(tag, cls, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (parent) parent.appendChild(n);
    return n;
  }

  function svgMark(kind, color) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "sb-mark " + kind);
    if (color) svg.style.setProperty("--mark", color);
    svg.setAttribute("viewBox", "0 0 100 100");
    var p = document.createElementNS(ns, "path");
    p.setAttribute("d", kind === "x" ? "M22 22 L78 78 M78 22 L22 78" : "M20 54 L42 76 L80 26");
    svg.appendChild(p);
    return svg;
  }

  function SplitBar(root, opts) {
    this.root = root;
    this.layout = opts.layout || "stack";
    this.gap = opts.gap == null ? 16 : opts.gap;
    this.labelGap = opts.labelGap == null ? 60 : opts.labelGap;
    this.height = opts.height || 960;
    this.width = opts.width || 240;
    this.segments = opts.segments.map(function (s) {
      return Object.assign({}, s);
    });
    this.nodes = {};
    this._build();
  }

  SplitBar.prototype._h = function (s) {
    return (s.pct / 100) * this.height;
  };

  SplitBar.prototype._build = function () {
    var self = this;
    var root = this.root;
    root.classList.add("sb", "sb-" + this.layout);
    root.style.height = this.height + "px";
    root.style.width = this.layout === "stack" ? this.width + "px" : "auto";

    if (this.layout === "stack") {
      root.style.flexDirection = "column-reverse";
      root.style.justifyContent = "flex-start";
      root.style.alignItems = "center";
      root.style.gap = "0px";
    } else {
      root.style.flexDirection = "row";
      root.style.alignItems = "flex-end";
      root.style.gap = this.gap + "px";
    }

    // Calque des étiquettes : hors du flux, hors des blocs colorés.
    // Il déborde volontairement de la barre — d'où data-layout-allow-overflow,
    // sans quoi `check` le signale comme un calcul de coordonnées raté.
    var layer = el("div", "sb-label-layer", root);
    layer.setAttribute("data-layout-allow-overflow", "");
    if (this.layout === "stack") {
      layer.style.left = "-90px";               // place pour l'accolade
      layer.style.width = this.width + this.labelGap + 560 + "px";
      layer.style.height = "100%";
    } else {
      var n = this.segments.length;
      layer.style.left = "0px";
      // Ancré en HAUT : avec le `bottom: 0` du kit, agrandir la hauteur
      // faisait remonter le calque au-dessus des barres et les étiquettes
      // se retrouvaient derrière les aplats.
      layer.style.top = "0px";
      layer.style.bottom = "auto";
      layer.style.width = n * this.width + (n - 1) * this.gap + "px";
      layer.style.height = this.height + 210 + "px";
    }
    this.layer = layer;

    this.segments.forEach(function (s, i) {
      var seg = el("div", "sb-seg", root);
      seg.dataset.key = s.key;
      seg.style.setProperty("--seg", s.color);
      seg.style.width = self.layout === "stack" ? "100%" : self.width + "px";
      seg.dataset.targetH = String(self._h(s));
      seg.style.height = "0px";

      var fill = el("div", "sb-seg-fill", seg);

      var label = el("div", "sb-seg-label", layer);
      label.dataset.key = s.key;
      label.style.opacity = "0";
      label.innerHTML =
        '<span class="sb-seg-name">' +
        s.label +
        "</span>" +
        (s.value ? '<span class="sb-seg-value">' + s.value + "</span>" : "");

      self.nodes[s.key] = { seg: seg, fill: fill, label: label, mark: null };
    });

    this._placeLabels();
  };

  /**
   * Positionne les étiquettes par calcul, pas par flux.
   * En pile : à droite, centrée sur le milieu du segment, y compris quand
   * le segment ne fait que 5 % de la barre. En groupe : sous la colonne,
   * à une hauteur fixe, pour qu'elles ne bougent pas quand la barre monte.
   */
  SplitBar.prototype._placeLabels = function () {
    var self = this;
    if (this.layout === "stack") {
      var offset = 0;
      this.segments.forEach(function (s, i) {
        var h = self._h(s);
        var center = offset + h / 2 + (s.labelDy || 0);
        var label = self.nodes[s.key].label;
        label.style.left = 90 + self.width + self.labelGap + "px";
        label.style.bottom = center + "px";
        label.style.transform = "translateY(50%)";
        label.style.textAlign = "left";
        offset += h + self.gap;
      });
    } else {
      this.segments.forEach(function (s, i) {
        var label = self.nodes[s.key].label;
        label.style.left = i * (self.width + self.gap) + "px";
        label.style.width = self.width + "px";
        label.style.top = self.height + 26 + "px";
        label.style.textAlign = "center";
      });
    }
  };

  SplitBar.prototype._n = function (key) {
    return this.nodes[key];
  };

  /** Les segments montent de 0 à leur taille. */
  SplitBar.prototype.grow = function (tl, at, o) {
    o = o || {};
    var d = o.duration == null ? 0.7 : o.duration;
    var stagger = o.stagger == null ? 0.12 : o.stagger;
    var self = this;
    this.segments.forEach(function (s, i) {
      tl.to(
        self._n(s.key).seg,
        { height: Number(self._n(s.key).seg.dataset.targetH), duration: d, ease: EASE_IN },
        at + i * stagger
      );
    });
    return at + d + (this.segments.length - 1) * stagger;
  };

  /** Les segments s'écartent : la barre pleine devient une barre découpée. */
  SplitBar.prototype.split = function (tl, at, o) {
    o = o || {};
    var d = o.duration == null ? 0.55 : o.duration;
    var gap = o.gap == null ? this.gap : o.gap;
    var self = this;
    this.segments.forEach(function (s, i) {
      if (i === 0) return; // le segment du bas ne bouge pas
      tl.to(self._n(s.key).seg, { marginBottom: gap, duration: d, ease: EASE_MOVE }, at);
    });
    return at + d;
  };

  /** Isole un segment : plein contraste, les autres s'atténuent. */
  SplitBar.prototype.focus = function (tl, at, key, o) {
    o = o || {};
    var d = o.duration == null ? 0.35 : o.duration;
    var dim = o.dim == null ? 0.22 : o.dim;
    var self = this;
    this.segments.forEach(function (s) {
      tl.to(self._n(s.key).seg, { opacity: s.key === key ? 1 : dim, duration: d, ease: EASE_MOVE }, at);
    });
    return at + d;
  };

  SplitBar.prototype.clearFocus = function (tl, at, o) {
    o = o || {};
    var d = o.duration == null ? 0.35 : o.duration;
    var self = this;
    this.segments.forEach(function (s) {
      tl.to(self._n(s.key).seg, { opacity: 1, duration: d, ease: EASE_MOVE }, at);
    });
    return at + d;
  };

  /** Fait apparaître les étiquettes des clés données, l'une après l'autre. */
  SplitBar.prototype.labels = function (tl, at, keys, o) {
    o = o || {};
    var d = o.duration == null ? 0.3 : o.duration;
    var stagger = o.stagger == null ? 0.18 : o.stagger;
    var dx = o.from == null ? 26 : o.from;
    var self = this;
    keys.forEach(function (k, i) {
      tl.fromTo(
        self._n(k).label,
        { opacity: 0, x: dx },
        { opacity: 1, x: 0, duration: d, ease: EASE_IN },
        at + i * stagger
      );
    });
    return at + d + (keys.length - 1) * stagger;
  };

  /** Pose une croix ou une coche au centre d'un segment. */
  SplitBar.prototype.mark = function (tl, at, key, kind, o) {
    o = o || {};
    var d = o.duration == null ? 0.3 : o.duration;
    var n = this._n(key);
    var mark = svgMark(kind, o.color);
    n.seg.appendChild(mark);
    n.mark = mark;
    tl.fromTo(
      mark,
      { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: d, ease: "back.out(2.2)" },
      at
    );
    return at + d;
  };

  /** Change la part d'un segment ; les autres se réajustent pour tenir. */
  SplitBar.prototype.resize = function (tl, at, key, pct, o) {
    o = o || {};
    var d = o.duration == null ? 0.8 : o.duration;
    var self = this;
    var target = this.segments.filter(function (s) {
      return s.key === key;
    })[0];
    if (!target) return at;

    var delta = pct - target.pct;
    var others = this.segments.filter(function (s) {
      return s.key !== key;
    });
    var otherTotal = others.reduce(function (a, s) {
      return a + s.pct;
    }, 0);

    target.pct = pct;
    tl.to(this._n(key).seg, { height: self._h(target), duration: d, ease: EASE_IN }, at);
    others.forEach(function (s) {
      if (otherTotal <= 0) return;
      s.pct = Math.max(0, s.pct - (delta * s.pct) / otherTotal);
      tl.to(self._n(s.key).seg, { height: self._h(s), duration: d, ease: EASE_IN }, at);
    });
    tl.call(function () {
      self._placeLabels();
    }, null, at + d);
    return at + d;
  };

  /** Sort un segment de la barre, sur le côté. Déplace son étiquette avec lui. */
  SplitBar.prototype.extract = function (tl, at, key, o) {
    o = o || {};
    var d = o.duration == null ? 0.6 : o.duration;
    var x = o.x == null ? 40 : o.x;
    var y = o.y == null ? 0 : o.y;
    var sc = o.scale == null ? 1 : o.scale;
    tl.to(this._n(key).seg, { x: x, y: y, scale: sc, duration: d, ease: EASE_MOVE }, at);
    if (o.moveLabel !== false) {
      tl.to(this._n(key).label, { x: x, y: y, duration: d, ease: EASE_MOVE }, at);
    }
    return at + d;
  };

  /** Accolade verticale à gauche d'un groupe de segments contigus. */
  SplitBar.prototype.bracket = function (tl, at, keys, label, o) {
    o = o || {};
    var d = o.duration == null ? 0.45 : o.duration;
    var self = this;

    // Géométrie calculée dans le repère de la barre : les hauteurs sont
    // connues d'avance, donc rien ne dépend d'un layout mesuré à chaud.
    var bottom = null;
    var top = null;
    var offset = 0;
    this.segments.forEach(function (s) {
      var h = self._h(s);
      if (keys.indexOf(s.key) !== -1) {
        if (bottom === null) bottom = offset;
        top = offset + h;
      }
      offset += h + self.gap;
    });
    if (bottom === null) return at;

    var wrap = el("div", "sb-bracket", this.layer);
    wrap.style.left = "32px";
    wrap.style.bottom = bottom + "px";
    wrap.style.height = top - bottom + "px";

    var lab = el("div", "sb-bracket-label", wrap);
    lab.textContent = label;

    tl.fromTo(
      wrap,
      { opacity: 0, scaleY: 0.4 },
      { opacity: 1, scaleY: 1, duration: d, ease: EASE_IN, transformOrigin: "50% 50%" },
      at
    );
    this.bracketEl = wrap;
    return at + d;
  };

  SplitBar.mount = function (target, opts) {
    var node = typeof target === "string" ? document.querySelector(target) : target;
    if (!node) throw new Error("SplitBar: cible introuvable — " + target);
    return new SplitBar(node, opts);
  };

  global.SplitBar = SplitBar;
})(window);
