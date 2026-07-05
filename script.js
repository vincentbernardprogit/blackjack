var cardDeck
var unrevealedCard
var dealerScore = 0
var playerScore = 0
var dealerAceCount = 0
var playerAceCount = 0
var canHit = true
const limitPoint = 21
const initialPoint = 17
const initialCardCount = 2

window.onload = function() {
    buildCardDeck()
    shuffleCardDeck()
    start()
}

function buildCardDeck() {
    let cardRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]
    let cardSuits = ["D", "C", "H", "S"]
    cardDeck = []

    for (let cardSuit = 0; cardSuit < cardSuits.length; cardSuit++) {
        for (let cardRank = 0; cardRank < cardRanks.length; cardRank++) {
            cardDeck.push(cardRanks[cardRank] + "-" + cardSuits[cardSuit])
        }
    }
}

function shuffleCardDeck() {
    for (let card = 0; card < cardDeck.length; card++) {
        let followingCard = Math.floor(Math.random() * cardDeck.length)
        let currentCard = cardDeck[card]
        cardDeck[card] = cardDeck[followingCard]
        cardDeck[followingCard] = currentCard
    }
}

function start() {
    unrevealedCard = cardDeck.pop()
    dealerScore += setPoint(unrevealedCard)
    dealerAceCount += countAce(unrevealedCard)
    while (dealerScore < initialPoint) {
        let cardDrawn = document.createElement("img")
        let revealedCard = cardDeck.pop()
        cardDrawn.src = "./images/" + revealedCard + ".png"
        document.getElementById("dealer-cards").append(cardDrawn)
        dealerScore += setPoint(revealedCard)
        dealerAceCount += countAce(revealedCard)
    }

    for (let card = 0; card < initialCardCount; card++) {
        let cardDrawn = document.createElement("img")
        let revealedCard = cardDeck.pop()
        cardDrawn.src = "./images/" + revealedCard + ".png"
        document.getElementById("player-cards").append(cardDrawn)
        playerScore += setPoint(revealedCard)
        playerAceCount += countAce(revealedCard)
    }
    
    document.getElementById("hit-button").addEventListener("click", hit)
    document.getElementById("stay-button").addEventListener("click", stay)
}

function hit() {
    if (!canHit) return

    let cardDrawn = document.createElement("img")
    let revealedCard = cardDeck.pop()
    cardDrawn.src = "./images/" + revealedCard + ".png"
    document.getElementById("player-cards").append(cardDrawn)
    playerScore += setPoint(revealedCard)
    playerAceCount += countAce(revealedCard)

    if (setAceReductionPoint(playerScore, playerAceCount) > limitPoint) canHit = false
}

function stay() {
    dealerScore = setAceReductionPoint(dealerScore, dealerAceCount)
    playerScore = setAceReductionPoint(playerScore, playerAceCount)

    canHit = false
    document.getElementById("unrevealed-card").src = "./images/" + unrevealedCard + ".png"

    let message = ""
    if (playerScore > limitPoint) message = "You Lose!"
    else if (dealerScore > limitPoint) message = "You win!"
    else if (playerScore == dealerScore) message = "Tie!"
    else if (playerScore > dealerScore) message = "You Win!"
    else if (playerScore < dealerScore) message = "You Lose!"

    document.getElementById("dealer-score").innerText = dealerScore
    document.getElementById("player-score").innerText = playerScore
    document.getElementById("result").innerText = message
}

function setPoint(card) {
    let cardSplit = card.split("-")
    let point = cardSplit[0]

    if (isNaN(point)) {
        if (point == "A") return 11
        return 10
    }
    return parseInt(point)
}

function countAce(card) {
    if (card[0] == "A") return 1
    return 0
}

function setAceReductionPoint(playerScore, playerAceCount) {
    while (playerScore > limitPoint && playerAceCount > 0) {
        playerScore -= 10
        playerAceCount -= 1
    }
    return playerScore
}