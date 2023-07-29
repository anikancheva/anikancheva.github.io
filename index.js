document.querySelector('form').addEventListener('submit', validate);

function validate(e) {
    e.preventDefault();
    let [totalInputField, providedInputField] = document.getElementsByTagName('input');

    let priceRegex = new RegExp(/^(0\.[0-9]{1,2})$|^([1-9]+[0-9]*(,[0-9]{3})*)(\.[0-9]{1,2})?$/gm);
    let total = totalInputField.value;
    total = total.replaceAll(/\s+/g, '');
    let provided = providedInputField.value;
    provided = provided.replaceAll(/\s+/g, '');

    let validTotal = false;
    let validProvided = false;
    if (total == '' || !total.match(priceRegex)) {
        totalInputField.setAttribute('class', 'error');
    } else {
        totalInputField.removeAttribute('class');
        validTotal = true;
    }

    if (provided == '' || !provided.match(priceRegex)) {
        providedInputField.setAttribute('class', 'error');
    } else {
        providedInputField.removeAttribute('class');
        validProvided = true;
    }

    let errorMsg = document.getElementById('errMsg');
    if (!validTotal || !validProvided) {
        errorMsg.style.visibility = 'visible';
    } else {
        errorMsg.style.visibility = 'hidden';
    }

    if (validTotal && validProvided) {
        let result = getResult(total, provided);
        showResult(result);
    }
}

function getResult(total, provided) {
    total = total.replaceAll(',', '');
    provided = provided.replaceAll(',', '');

    let resultArray = {
        'change': 0,
        'bills': { '100': 0, '50': 0, '20': 0, '10': 0, '5': 0, '1': 0 },
        'coins': { '25': 0, '10': 0, '5': 0, '1': 0 }
    };

    let change = (provided - total).toFixed(2);
    resultArray['change'] = change;
    if (change <= 0) {
        return resultArray;
    }

    let parts = change.split('.');
    let dollars = parts[0];
    let cents = null;
    if (parts.length == 2) {
        let val = parts[1];
        if (val.length == 1) {
            cents = val.charAt(0) * 10;
        } else {
            if (val.charAt(0) == 0) {
                cents = val.charAt(1);
            } else {
                cents = val;
            }
        }
    }
    console.log(dollars +" " + cents)

    while (dollars > 0) {
        if (parseInt(dollars / 100) > 0) {
            resultArray["bills"]["100"] += parseInt(dollars / 100);
            dollars = parseInt(dollars % 100);
        } else if (parseInt(dollars / 50) > 0) {
            resultArray["bills"]["50"] += parseInt(dollars / 50);
            dollars = parseInt(dollars % 50);
        } else if (parseInt(dollars / 20) > 0) {
            resultArray["bills"]["20"] += parseInt(dollars / 20);
            dollars = parseInt(dollars % 20);
        } else if (parseInt(dollars / 10) > 0) {
            resultArray["bills"]["10"] += parseInt(dollars / 10);
            dollars = parseInt(dollars % 10);
        } else if (parseInt(dollars / 5) > 0) {
            resultArray["bills"]["5"] += parseInt(dollars / 5);
            dollars = parseInt(dollars % 5);
        } else {
            resultArray["bills"]["1"] += parseInt(dollars);
            break;
        }
    }

    if (cents != null) {
        while (cents > 0) {
            if (parseInt(cents / 25) > 0) {
                resultArray["coins"]["25"] += parseInt(cents / 25);
                cents = parseInt(cents % 25);
            } else if (parseInt(cents / 10) > 0) {
                resultArray["coins"]["10"] += parseInt(cents / 10);
                cents = parseInt(cents % 10);
            } else if (parseInt(cents / 5) > 0) {
                resultArray["coins"]["5"] += parseInt(cents / 5);
                cents = parseInt(cents % 5);
            } else {
                resultArray["coins"]["1"] += parseInt(cents);
                break;
            }
        }
    }

    return resultArray;
}

function showResult(data) {
    let change = data['change'];
    let bills = data['bills'];
    let coins = data['coins'];
    let changeP = document.getElementById('change');
    changeP.textContent = change;
    if (change > 0) {
        let tds = document.getElementsByTagName('td');
        let i = tds.length - 1;
        for (let val in coins) {
            tds[i--].textContent = coins[val];
        }
        for (let val in bills) {
            tds[i--].textContent = bills[val];
        }
        document.getElementById('denominations').removeAttribute('hidden');
    } else {
        document.getElementById('denominations').setAttribute('hidden', true);
    }
}