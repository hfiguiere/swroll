


// Results
//  s: success
//  a: advantage
//  T: triumph
//  f: failure
//  t: threat
//  D: despair
//  l: light side F
//  k: dark side F
//  <SPACE>: nothing

var BOOST_DIE = [ ' ', ' ', 's', 'sa', 'aa', 'a' ];
var SETBACK_DIE = [ ' ', ' ', 'f', 'f', 't', 't' ];
var ABILITY_DIE = [ ' ', 's', 's', 'ss', 'a', 'a', 'sa', 'aa' ];
var DIFFICULTY_DIE = [ ' ', 'f', 'ff', 't', 't', 't', 'tt', 'ft' ];
var PROFICIENCY_DIE = [ ' ', 's', 's', 'ss', 'ss', 'a', 'sa', 'sa',
                        'sa', 'aa', 'aa', 'T' ];
var CHALLENGE_DIE = [ ' ', 'f', 'f', 'ff', 'ff', 't', 't', 'ft',
                      'ft', 'tt', 'tt', 'D' ];
var FORCE_DIE = [ 'l', 'l', 'l', 'l', 'l', 'l', 'll', 'k',
                  'k', 'kk', 'kk', 'kk' ];

var DiceRoller = {

  // order for the dice.
  dice_order: [
    'boost', 'ability', 'proficiency',
    'setback', 'difficulty', 'challenge',
    'force'
  ],

  dice: {
    boost: {
      dice: BOOST_DIE,
      img: 'img/dice-boost.svg',
      label: 'Boost',
    },
    setback: {
      dice: SETBACK_DIE,
      img: 'img/dice-setback.svg',
      label: 'Setback',
    },
    ability: {
      dice: ABILITY_DIE,
      img: 'img/dice-ability.svg',
      label: 'Ability',
    },
    difficulty: {
      dice: DIFFICULTY_DIE,
      img: 'img/dice-difficulty.svg',
      label: 'Difficulty',
    },
    proficiency: {
      dice: PROFICIENCY_DIE,
      img: 'img/dice-proficiency.svg',
      label: 'Proficiency',
    },
    challenge: {
      dice: CHALLENGE_DIE,
      img: 'img/dice-challenge.svg',
      label: 'Challenge',
    },
    force: {
      dice: FORCE_DIE,
      img: 'img/dice-force.svg',
      label: 'Force',
    }
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

  // XXX localize
  result_labels: {
    s: 'Success',
    a: 'Advantage',
    T: 'Triumph',
    f: 'Failure',
    t: 'Threat',
    D: 'Despair',
    l: 'Light Side',
    k: 'Dark Side',
  },

  pool: {},

  Selectors: {
    dice: '#dice',
    pool: '#pool',
    result: '#result',
    rollbutton: '#rollbutton',
    clearbutton: '#clearbutton'
  },

  // output an image for the die symbol
  _addPrettyResult: function(node, symbol) {
    if (symbol == ' ') {
      var p = document.createElement('span');
      p.textContent = '[]';
      node.appendChild(p);
      return;
    }
    var src = this.result_img[symbol];
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.className = 'result-img';
      img.height = 20;
      img.alt = this.result_labels[symbol];
      node.appendChild(img);
    }
  },

  // output an image for the die.
  _addPrettyDie: function(node, die) {
    var src = this.dice[die].img;
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.className = 'die-img';
      img.alt = this.dice[die].label;
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
    this.pool = {};
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
        var span = document.createElement('span');
        span.textContent = '/';
        span.className = 'separator';
        element.appendChild(span);
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
    Object.keys(this.pool).forEach((die) => {
      var count = this.pool[die];
      for(var i = 0; i < count; i++) {
        result.push(this.rollDie(die));
      }
    });
    this.prettyResult(resultElement, result);
  },

  rollDie: function(dieName) {
    var die = this.dice[dieName].dice;
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

    this.dice_order.forEach((k) => {
      newElement = document.createElement('div');
      newElement.className = 'die';
      newElement.dataset.die = k;
      newElement.id = 'die-' + k;

      this._addPrettyDie(newElement, k);

      var p = document.createElement('span');
      newElement.appendChild(p);
      p.textContent = this.dice[k].label;
      var b = document.createElement('button');
      b.onclick = this.addToPool.bind(this, k)
      b.appendChild(document.createTextNode('+'));
      newElement.appendChild(b);

      element.appendChild(newElement);
    });
  },

  addToPool: function(die) {
    if (this.pool[die] === undefined || Number.isNaN(this.pool[die])) {
      this.pool[die] = 1;
    } else {
      this.pool[die]++;
    }
    this._addToPoolUI(die);
  },

  removeFromPool: function(div) {
    var die = div.dataset.die;
    if (die) {
      if (div.dataset.count <= 1) {
        var parent = div.parentNode;
        parent.removeChild(div);
      } else {
        div.dataset.count--;
        this._setPooledDieCount(div);
      }
      if (this.pool[die] > 0) {
        this.pool[die]--;
      } else {
        console.error('this.pool inconsistent for ', die, this.pool[die]);
      }
    } else {
      console.error('inconsistent data: unkown die');
    }
  },

  _setPooledDieCount: function(node) {
    node.firstChild.textContent = node.dataset.count + 'x';
  },

  _addToPoolUI: function(die) {
    var element = document.querySelector(this.Selectors.pool);

    var div = element.querySelector('div[data-die=' + die);
    if (div) {
      div.dataset.count++;
      this._setPooledDieCount(div);
    } else {
      div = document.createElement('div');
      div.className = 'die';
      div.dataset.die = die;
      div.dataset.count = this.pool[die];
      var p = document.createElement('span');
      div.appendChild(p);
      this._setPooledDieCount(div);

      this._addPrettyDie(div, die);

      p = document.createElement('span');
      div.appendChild(p);
      p.textContent = this.dice[die].label;
      var b = document.createElement('button');
      b.onclick = this.removeFromPool.bind(this, div)
      b.textContent = '-';
      div.appendChild(b);

      element.appendChild(div);
    }
  },
};

DiceRoller.init();

