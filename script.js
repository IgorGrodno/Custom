const engineCapality = document.getElementById("engineCapality");

const engineTypeEV = document.getElementById("engineTypeChoice1");
const engineTypeFuel = document.getElementById("engineTypeChoice2");

const engineCapalityValue = document.getElementById("engineCapalityValue");
const priceValue = document.getElementById("priceValue");

const result = document.getElementById("result");

const vehicaleAge = document.getElementById("vehicaleAge");

let euroDollarRatio = 1.13;
let dollarBYNRatio = 2.57;
let scrapCollectionBYNYang = 545;
let scrapCollectionBYNNormal = 816;
let declarantBYN = 126;
let timedWarehouseBYN = 300;
let customerBYN = 120;

let yangCustomPrices = [
    { min: 1, max: 8500, coefficient: 2.5, procent: 54 },
    { min: 8501, max: 16700, coefficient: 3.5, procent: 48 },
    { min: 16701, max: 42300, coefficient: 5.5, procent: 48 },
    { min: 42301, max: 84500, coefficient: 7.5, procent: 48 },
    { min: 84501, max: 169000, coefficient: 15, procent: 48 },
    { min: 169000, max: 1000000, coefficient: 20, procent: 48 }
];
let normalCustomPrices = [
    { min: 1, max: 1000, coefficient: 1.5 },
    { min: 1001, max: 1500, coefficient: 1.7 },
    { min: 1501, max: 1800, coefficient: 2.5 },
    { min: 1801, max: 2300, coefficient: 2.7 },
    { min: 2301, max: 3000, coefficient: 3 },
    { min: 3001, max: 1000000, coefficient: 3.6 }
];
let oldCustomPrices = [
    { min: 1, max: 1000, coefficient: 3 },
    { min: 1001, max: 1500, coefficient: 3.2 },
    { min: 1501, max: 1800, coefficient: 3.5 },
    { min: 1801, max: 2300, coefficient: 4.8 },
    { min: 2301, max: 3000, coefficient: 5 },
    { min: 3001, max: 1000000, coefficient: 5.7 }
];



function ShowHiddeEngineCapality() {
    if (engineTypeEV.checked == true) {
        engineCapality.classList.add("hiden");
    }
    if (engineTypeFuel.checked == true) {
        engineCapality.classList.remove("hiden");
    }
}



function AdditionallyPayesInUSD(age) {
    let additionallyPayes = customerBYN + timedWarehouseBYN + declarantBYN;
    if (age < 3) {
        additionallyPayes = additionallyPayes + scrapCollectionBYNYang;
    }
    else {
        additionallyPayes = additionallyPayes + scrapCollectionBYNNormal;
    }
    return additionallyPayes / dollarBYNRatio;
}



function EVCustom(price) {
    let customPrice = price * 0.15;
    return customPrice;
}



function YangFuelCustomPrice(price, engineCapality, сustomPrices) {
    let coefficient;
    let procent;


    for (let i = 0; i < сustomPrices.length; i++) {
        if ((price >= сustomPrices[i].min * euroDollarRatio) && (price <= сustomPrices[i].max * euroDollarRatio)) {
            coefficient = сustomPrices[i].coefficient;
            procent = сustomPrices[i].procent;
            break;
        }
    }

    let engineCapalityCustom = engineCapality * coefficient;
    let priceCustom = price * procent / 100;

    if (engineCapalityCustom > priceCustom) {
        return engineCapalityCustom * euroDollarRatio;
    }
    else {
        return priceCustom;
    }
}



function NormalFuelCustomPrice(engineCapality, customPrices) {
    let coefficient;

    for (let i = 0; i < customPrices.length; i++) {
        if ((engineCapality >= customPrices[i].min) && (engineCapality <= customPrices[i].max)) {
            coefficient = customPrices[i].coefficient;
        }
    }

    let result = coefficient * engineCapality;

    return result * euroDollarRatio;
}



function CustomCalculate() {

    let result = [];
    let customPrice;
    let scrapPay;

    if (vehicaleAge.value < 3) {
        scrapPay = scrapCollectionBYNYang;
    }
    else {
        scrapPay = scrapCollectionBYNNormal;
    }

    if (engineTypeEV.checked == true) {
        customPrice = EVCustom(priceValue.value);
    }
    else {
        if (vehicaleAge.value < 3) {
            customPrice = YangFuelCustomPrice(priceValue.value, engineCapalityValue.value, yangCustomPrices);
        }
        if ((vehicaleAge.value >= 3) && (vehicaleAge.value < 5)) {
            customPrice = NormalFuelCustomPrice(engineCapalityValue.value, normalCustomPrices);
        }
        if (vehicaleAge.value >= 5) {
            customPrice = NormalFuelCustomPrice(engineCapalityValue.value, oldCustomPrices);
        }
    }

    result.push({ text: "таможня полная, со всеми платежами в $ ", price: Math.ceil(customPrice + AdditionallyPayesInUSD(vehicaleAge.value)) });
    result.push({ text: "таможня льготная, со всеми платежами в $ ", price: Math.ceil(customPrice / 2 + AdditionallyPayesInUSD(vehicaleAge.value)) });
    result.push({ text: "таможня льготная в BYN ", price: Math.ceil(customPrice * dollarBYNRatio) });
    result.push({ text: "таможня льготная в BYN ", price: Math.ceil(customPrice / 2 * dollarBYNRatio) });
    result.push({ text: "утильсбор ", price: scrapPay });
    result.push({ text: "услуги декларанта ", price: declarantBYN });
    result.push({ text: "услуги таможенного инспектора ", price: customerBYN });
    result.push({ text: "улуги склада временного хранения ", price: timedWarehouseBYN });
    result.push({ text: "итого в по льготе BYN ", price: Math.ceil(customPrice / 2 * dollarBYNRatio + scrapPay + declarantBYN + customerBYN + timedWarehouseBYN) });
    return result;
}


function ResultOutput(resultArr, target) {
    target.innerHTML = "";
    for (let i = 0; i < resultArr.length; i++) {
        target.innerHTML += "<div>" + resultArr[i].text + resultArr[i].price + "</div>";
    }
}


engineTypeEV.addEventListener("change", ShowHiddeEngineCapality);
engineTypeFuel.addEventListener("change", ShowHiddeEngineCapality);
engineTypeEV.addEventListener("change", (event) => { ResultOutput(CustomCalculate(), result) });
engineTypeFuel.addEventListener("change", (event) => { ResultOutput(CustomCalculate(), result) });
engineCapalityValue.addEventListener("change", (event) => { ResultOutput(CustomCalculate(), result) });
priceValue.addEventListener("change", (event) => { ResultOutput(CustomCalculate(), result) });
vehicaleAge.addEventListener("change", (event) => { ResultOutput(CustomCalculate(), result) });
document.addEventListener("DOMContentLoaded", (event) => {
    document.getElementById("dollarBYNRatio").innerHTML = "курс доллара: " + dollarBYNRatio;
    document.getElementById("euroDollarRatio").innerHTML = "конверсия Евро/Доллар: " + euroDollarRatio;
})