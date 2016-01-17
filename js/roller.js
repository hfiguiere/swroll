


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

  pool: [],

  Selectors: {
    dice: '#dice',
    pool: '#pool',
    result: '#result',
    rollbutton: '#rollbutton'
  },

  init: function() {
    this.setupDice();
    this.setupUI();
  },

  rollDicePool: function(pool) {
    var resultElement = document.querySelector(this.Selectors.result);
    var result = [];
    pool.forEach((die) => {
      result.push(this.rollDie(die));
    });
    resultElement.innerHTML = JSON.stringify(result);
  },

  rollDie: function(dieName) {
    var die = this.dice[dieName];
    // XXX shall we use window.crypto.getRandomValues() ?
    var idx = Math.floor(Math.random() * die.length);
    return die[idx];
  },

  setupUI: function() {
    var button = document.querySelector(this.Selectors.rollbutton);
    button.onclick = this.rollDicePool.bind(this, this.pool);
  },

  setupDice: function() {
    var element = document.querySelector(this.Selectors.dice);
    var newElement;

    Object.keys(this.dice).forEach((k) => {
      newElement = document.createElement('div');
      newElement.dataset.die = k;
      newElement.id = 'die-' + k;
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

