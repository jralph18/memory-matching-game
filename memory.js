// MemoryGame class to handle dynamic elements of game
class MemoryGame {
    // construct memory game by creating a deck and adding one card w/ each image to deck
  constructor(deckSize, images) {
    this.deck = new Deck();
    // add two of each card from images to the deck
    for (let i = 0; i < deckSize / 2; i++) {
        this.deck.addCard(new Card(i, images[i]));
        this.deck.addCard(new Card(i, images[i]));
    }
    this.start();
  }

  // assign a card in the deck to each div and add event listeners for clicks
  draw() {
    const cards = document.querySelectorAll(".memory-card");
    let backs = document.getElementsByClassName("back-face");
    for (let i = 0; i < cards.length; i++) {
      let card = this.deck.getCardByIndex(i);
      card.setElement(cards[i]);
      backs[i].src = this.deck.getCardByIndex(i).image;
    }
    let that = this;
    this.deck.cards.forEach((card) =>
      card.element.addEventListener("click", function (e) {
        that.evalClick(this);
      })
    );
  }
  
  // set/reset start conditions for memory game
  start() {
    this.deck.shuffle();
    this.draw();
    this.matched = [];
    this.clicked = [];
    this.updateTurns(true);
  }
  // flip over any face up cards and reset the game with the start() function
  reset() {
    let that = this;
    this.matched.forEach((card) => {card.flip()});
    this.clicked.forEach((card) => {card.flip()});
    this.matched = [];
    this.clicked = [];
    setTimeout(function () {that.start();}, 500);
  }
  // evaluate the card clicked by user
  evalClick(that) {
    let newCard = this.deck.getCardById(that.id);
    
    // Ignore extra clicks
    if (newCard.faceUp || this.clicked.length === 2) return;
    this.clicked.push(newCard);
    newCard.flip();

    // once two cards have been clicked, check for match/win conditions
    if (this.clicked.length === 2) {
      this.updateTurns();
      if (this.clicked[0].value != this.clicked[1].value) {
        let that = this;
        setTimeout(function () {
          that.clicked[0].flip();
          that.clicked[1].flip();
          that.clicked = [];
        }, 700);
      } else {
        this.clicked.forEach((card) => {this.matched.push(card);});
        this.checkWin();
        this.clicked = [];
      }
    }
  }

  // update turn counter
  updateTurns(reset = false) {
    const turnScore = document.querySelector("#turns");
    if (reset) this.turns = 0;
    else this.turns++;
    turnScore.textContent = this.turns;
  }

  // check if all cards are matched
  checkWin() {
      let that = this;
    if (this.matched.length === this.deck.len()) {
      setTimeout(function () {
        alert(`You won in ${that.turns} turns!`);
      }, 700);
    }
  }
}

// Deck class for MemoryGame
class Deck {
  constructor() {
    this.cards = [];
  }
  shuffle() {
    this.cards.sort(() => Math.random() - 0.5);
  }
  addCard(card) {
    this.cards.push(card);
  }
  getCardByIndex(index) {
    return this.cards[index];
  }
  getCardById(id) {
    return this.cards.filter((card) => card.element.id === id)[0];
  }
  len() {
    return this.cards.length;
  }
}

// Card class for MemoryGame
class Card {
  constructor(value, image) {
    this.image = image;
    this.value = value;
    this.faceUp = false;
    this.element = null;
  }
  flip() {
    this.faceUp = !this.faceUp;
    this.element.classList.toggle("flip");
  }
  // Set html element for click handling
  setElement(element) {
    this.element = element;
  }
}
const imageArr = [
  "images/Kiss.png",
  "images/Stars.png",
  "images/Eyes.png",
  "images/YUM.png",
  "images/Monkey.png",
  "images/Unicorn.png",
  "images/Wink.png",
  "images/LOL.png",
];
const deckSize = 16;
const game = new MemoryGame(deckSize, imageArr);