


// Results
//  s: success
//  a: advantage
//  T: triumph
//  f: failure
//  t: threat
//  D: despair
//  l: light side F
//  k: dark side F

var BOOST_DIE = [ '', '', 's', 'sa', 'aa', 'a' ];
var SETBACK_DIE = [ '', '', 'f', 'f', 't', 't' ];
var ABILITY_DIE = [ '', 's', 's', 'ss', 'a', 'a', 'sa', 'aa' ];
var DIFFICULTY_DIE = [ '', 'f', 'ff', 't', 't', 't', 'tt', 'ft' ];
var PROFICIENCY_DIE = [ '', 's', 's', 'ss', 'ss', 'a', 'sa', 'sa',
                        'sa', 'aa', 'aa', 'T' ];
var CHALLENGE_DIE = [ '', 'f', 'f', 'ff', 'ff', 't', 't', 'ft',
                      'ft', 'tt', 'tt', 'D' ];
var FORCE_DIE = [ 'l', 'l', 'l', 'l', 'l', 'l', 'll', 'k',
                  'k', 'kk', 'kk', 'kk' ];

var DiceRoller = {

  dice: {
    boost: BOOST_DIE,
    setback: SETBACK_DIE,
    ability: ABILITY_DIE,
    difficulty: DIFFICULTY_DIE,
    proficiency: PROFICIENCY_DIE,
    challenge: CHALLENGE_DIE,
    force: FORCE_DIE
  },

  dice_img: {
    boost:       'img/dice-boost.svg',
    setback:     'img/dice-setback.svg',
    ability:     'img/dice-ability.svg',
    difficulty:  'img/dice-difficulty.svg',
    proficiency: 'img/dice-proficiency.svg',
    challenge:   'img/dice-challenge.svg',
    force:       'img/dice-force.svg'
  },

  result_img: {
    s: 'img/result-s.svg',
    a: 'img/result-a.svg',
    T: 'img/result-T.svg',
    f: 'img/result-f.svg',
    t: 'img/result-t.svg',
    D: 'img/result-D.svg',
    l: 'img/result-l.svg',
    k: 'img/result-k.svg',
  },

  pool: [],

  Selectors: {
    dice: '#dice',
    pool: '#pool',
    result: '#result',
    rollbutton: '#rollbutton',
    clearbutton: '#clearbutton'
  },

  // output an image for the die symbol
  _addPrettyResult: function(node, symbol) {
    var src = this.result_img[symbol];
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.height = 20;
      node.appendChild(img);
    }
  },

  // output an image for the die.
  _addPrettyDie: function(node, die) {
    var src = this.dice_img[die];
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.height = 30;
      node.appendChild(img);
    }
  },

  init: function() {
    this.setupDice();
    this.setupUI();
  },

  clearDicePool: function() {
    var resultElement = document.querySelector(this.Selectors.result);
    resultElement.innerHTML = '';
    console.log('before', this.pool.length);
    this.pool = [];
    console.log('after', this.pool.length);
    var poolElement = document.querySelector(this.Selectors.pool);
    while(poolElement.firstChild) {
      poolElement.removeChild(poolElement.firstChild);
    }
  },

  prettyResult: function(element, result) {
    // clear result
    while(element.firstChild) {
      element.removeChild(element.firstChild);
    }
    var first = true;
    result.forEach((e) => {
      if(!first) {
        element.appendChild(document.createTextNode('/'));
      }
      for(var i = 0; i < e.length; i++) {
        this._addPrettyResult(element, e.charAt(i));
      }
      first = false;
    });
  },

  rollDicePool: function() {
    var resultElement = document.querySelector(this.Selectors.result);
    var result = [];
    this.pool.forEach((die) => {
      result.push(this.rollDie(die));
    });
    this.prettyResult(resultElement, result);
  },

  rollDie: function(dieName) {
    var die = this.dice[dieName];
    // XXX shall we use window.crypto.getRandomValues() ?
    var idx = Math.floor(Math.random() * die.length);
    return die[idx];
  },

  setupUI: function() {
    var button = document.querySelector(this.Selectors.rollbutton);
    button.onclick = this.rollDicePool.bind(this);
    button = document.querySelector(this.Selectors.clearbutton);
    button.onclick = this.clearDicePool.bind(this);
  },

  setupDice: function() {
    var element = document.querySelector(this.Selectors.dice);
    var newElement;

    Object.keys(this.dice).forEach((k) => {
      newElement = document.createElement('div');
      newElement.dataset.die = k;
      newElement.id = 'die-' + k;

      this._addPrettyDie(newElement, k);

      var p = document.createElement('span');
      newElement.appendChild(p);
      p.appendChild(document.createTextNode(k));
      var b = document.createElement('button');
      b.onclick = this.addToPool.bind(this, k)
      b.appendChild(document.createTextNode('+'));
      newElement.appendChild(b);

      element.appendChild(newElement);
    });
  },

  addToPool: function(die) {
    this.pool.push(die);
    this.addToPoolUI(die);
  },

  removeFromPool: function(die, div) {
    var parent = div.parentNode;
    parent.removeChild(div);
    var idx = this.pool.indexOf(die);
    this.pool.splice(idx, 1);
  },

  addToPoolUI: function(die) {
    var element = document.querySelector(this.Selectors.pool);
    var newElement;

    var div = document.createElement('div');
    div.dataset.die = die;

    this._addPrettyDie(div, die);

    var p = document.createElement('span');
    div.appendChild(p);
    p.appendChild(document.createTextNode(die));
    var b = document.createElement('button');
    b.onclick = this.removeFromPool.bind(this, die, div)
    b.appendChild(document.createTextNode('-'));
    div.appendChild(b);

    element.appendChild(div);
  },
};

DiceRoller.init();

