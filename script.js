const engineCapality = document.getElementById("engineCapality");

const engineTypeEV = document.getElementById("engineTypeChoice1");
const engineTypeFuel = document.getElementById("engineTypeChoice2");

const engineCapalityValue = document.getElementById("engineCapalityValue");
const priceValue = document.getElementById("priceValue");

const result = document.getElementById("result");

const vehicaleAge = document.getElementById("vehicaleAge");

const customPriceOutput = document.getElementById("customPrice");
const customHalfPriceOutput = document.getElementById("customHalfPrice");


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
    let additionallyPayes = 0;
    if (age < 3) {
        additionallyPayes = scrapCollectionBYNYang + customerBYN + timedWarehouseBYN + declarantBYN;
    }
    else {
        additionallyPayes = scrapCollectionBYNNormal + customerBYN + timedWarehouseBYN + declarantBYN;
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
        if ((price >= сustomPrices[i].min) && (price <= сustomPrices[i].max)) {
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
        return priceCustom * euroDollarRatio;
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
    let customHalfPrice;

    if (engineTypeEV.checked == true) {
        customPrice = EVCustom(priceValue.value) + AdditionallyPayesInUSD(vehicaleAge.value);
        customHalfPrice = (EVCustom(priceValue.value) / 2) + (AdditionallyPayesInUSD(vehicaleAge.value));

    }
    else {
        if (vehicaleAge.value < 3) {
            customPrice = YangFuelCustomPrice(priceValue.value, engineCapalityValue.value, yangCustomPrices) + AdditionallyPayesInUSD(vehicaleAge.value);
            customHalfPrice = (YangFuelCustomPrice(priceValue.value, engineCapalityValue.value, yangCustomPrices) / 2) + AdditionallyPayesInUSD(vehicaleAge.value);
        }
        if ((vehicaleAge.value >= 3) && (vehicaleAge.value < 5)) {
            customPrice = NormalFuelCustomPrice(engineCapalityValue.value, normalCustomPrices) + AdditionallyPayesInUSD(vehicaleAge.value);
            customHalfPrice = (NormalFuelCustomPrice(engineCapalityValue.value, normalCustomPrices) / 2) + AdditionallyPayesInUSD(vehicaleAge.value);
        }
        if (vehicaleAge.value >= 5) {
            customPrice = NormalFuelCustomPrice(engineCapalityValue.value, oldCustomPrices) + AdditionallyPayesInUSD(vehicaleAge.value);
            customHalfPrice = (NormalFuelCustomPrice(engineCapalityValue.value, oldCustomPrices) / 2) + AdditionallyPayesInUSD(vehicaleAge.value);
        }
    }

    result.push({ text: "таможня полная, со всеми платежами", price: customPrice });
    result.push({ text: "таможня льготная, со всеми платежами", price: customHalfPrice });
    return result;
}


function ResultOutput(resultArr) {
    customPriceOutput.innerHTML = resultArr[0].text + " " + Math.ceil(resultArr[0].price);
    customHalfPriceOutput.innerHTML = resultArr[1].text + " " + Math.ceil(resultArr[1].price);
}


engineTypeEV.addEventListener("change", ShowHiddeEngineCapality);
engineTypeFuel.addEventListener("change", ShowHiddeEngineCapality);
engineTypeEV.addEventListener("change", (event) => { ResultOutput(CustomCalculate()) });
engineTypeFuel.addEventListener("change", (event) => { ResultOutput(CustomCalculate()) });
engineCapalityValue.addEventListener("change", (event) => { ResultOutput(CustomCalculate()) });
priceValue.addEventListener("change", (event) => { ResultOutput(CustomCalculate()) });
vehicaleAge.addEventListener("change", (event) => { ResultOutput(CustomCalculate()) });
