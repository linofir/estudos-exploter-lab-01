import "./css/index.css"
import IMask from "imask"
//Vite é um bandler. Consegue empacotar e organizar para tornar o ambiente mais eficiente e dinâmico
//Credit card layout
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") //.classe svg (primeiro nível g)
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

const colors = {
  visa: ["#436D99", "2D57F2"],
  mastercard: ["#C69347", "#DF6F29"],
  default: ["black", "grey"],
  elo: ["", ""],
}

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "2D57F2"],
    mastercard: ["#C69347", "#DF6F29"],
    default: ["black", "grey"],
    elo: ["#4AAAE0", "#CC240E"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//Masks
//const cardNumber = document.querySelector("form .input-wrapper input")// pelo css
//const securityCode = document.querySelector("#security-code")
const securityCode = document.getElementById("security-code")

const securityCodePattern = {
  mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.getElementById("expiration-date")

const expirationDatePattern = {
  mask: "mm{/}yy",
  lazy: true,
  blocks: {
    yy: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: 99,
    },
    mm: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expeditionDateMasked = IMask(expirationDate, expirationDatePattern)

//card verification

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex:
        /(^5[1-5]\d{0,2}\d{0,12})|(^22[2-9]\d\d{0,12})|(^2[3-7]\d{0,2}\d{0,12})/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const numper = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return numper.match(item.regex)
    })
    //console.log(foundMask)
    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
  alert("Cartão adicionado!")
}) //observa o elemento atribuido na constante,procura o click e executa a função

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value") //faz-se desas forma pois existem outras classes value

  ccHolder.innerText =
    cardHolder.value.length === 0 ? "Fulano da Silva" : cardHolder.value
  //caso o tamanho seja 0 adicionar a string caso não, cardHolder
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value")

  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expeditionDateMasked.on("accept", () => {
  updateExpeditionDate(expeditionDateMasked.value)
})

function updateExpeditionDate(date) {
  const ccExpedition = document.querySelector(".cc-extra .value")
  ccExpedition.innerText = date.length === 0 ? "02/32" : date
}
