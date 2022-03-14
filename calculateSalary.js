
//TAX values
const unemploymentEmployerPercent = 0.008;
const unemploymentEmployeePercent = 0.016;
const socialTaxPercent = 0.33;
const fundedPensionPercent = 0.02;
const incomeTaxNettoValue = 0.25;
const incomeTaxBruttoValue = 0.2;

var amountOfExpense = document.getElementById('amountOfExpenseInput');
var considerTaxFreeCheckbox = document.getElementById("considerTaxFreeCheckbox");
var employerUnemploymentCheckbox = document.getElementById("employerUnemploymentCheckbox");
var employeeUnemploymentCheckbox = document.getElementById("employeeUnemploymentCheckbox");
var fundedPensionCheckbox = document.getElementById("fundedPensionCheckbox");

var incomeTax = 0.00;
var taxFreeIncome = 0.00;
var fundedPension = 0.00;
var employerUnemployment = 0.00;
var employeeUnemployment = 0.00;
var socialTax = 0.00;
var employerExpense = 0.00;

amountOfExpense.oninput = calculationBasedOnInput;

//Radio typeOfExpense event handler
var typeOfExpense = document.expenseInputForm.typeOfExpense;
var prev = null;
for (let i = 0; i < typeOfExpense.length; i++) {
    typeOfExpense[i].addEventListener('change', function() {
        if (this !== prev) {
            prev = this;
        }
        calculationBasedOnInput();
    });
}

function calculationBasedOnInput(){     
    let valueSelected = document.querySelector('input[name="typeOfExpense"]:checked').value;
    switch(valueSelected) {
        case 'netto':
            calculateByNetto();
            break;
        case 'brutto':
            calculateByBrutto();
            break;
        case 'employer':
            calculateByEmployerExpense();
            break;
    }
}

function bruttoByNettoBinarySearch(netto){
    let tempBrutto = 0;
    let minBrutto = 0;    
    let maxBrutto = netto * 1.4;
    let nettoToCompare = 0;

    while (minBrutto <= maxBrutto) {        
        tempBrutto = minBrutto + (maxBrutto - minBrutto) / 2;

        determineTaxValues(tempBrutto);        
        nettoToCompare = tempBrutto - incomeTax - fundedPension - employeeUnemployment;
  
        if (parseFloat(nettoToCompare.toFixed(2)) == netto) {
            //console.log(minBrutto + " " + tempBrutto + " " + maxBrutto);
            break;
        }
        
        if (parseFloat(nettoToCompare.toFixed(2)) < netto) {
            minBrutto = (tempBrutto + 0.01);
        } else {
            maxBrutto = (tempBrutto - 0.01)
        }

    }
    return tempBrutto;
}

function calculateByNetto(){
    let netto = Number(amountOfExpense.value);
    let brutto = bruttoByNettoBinarySearch(netto);

    showCalculations(brutto, taxFreeIncome, socialTax, employerUnemployment, employeeUnemployment, 
        employerExpense, fundedPension, incomeTax, netto);
}

function calculateByBrutto(){
    let brutto = Number(amountOfExpense.value);

    determineTaxValues(brutto);
    netto = brutto - incomeTax - fundedPension - employeeUnemployment;

    showCalculations(brutto, taxFreeIncome, socialTax, employerUnemployment, employeeUnemployment, 
        employerExpense, fundedPension, incomeTax, netto);
}

function determineTaxValues(brutto){
    if (fundedPensionCheckbox.checked == true) {
        fundedPension = brutto * fundedPensionPercent;
    } else {
        fundedPension = 0;
    }
    
    if (employeeUnemploymentCheckbox.checked == true) {
        employeeUnemployment = brutto * unemploymentEmployeePercent;
    } else {
        employeeUnemployment = 0;
    }
    
    if (considerTaxFreeCheckbox.checked == true) {
        if (brutto <= 500) {
            incomeTax = 0;
        } 
        if (500 < brutto && brutto <= 1200) {
            taxFreeIncome = 500;
            incomeTax = (brutto - taxFreeIncome - fundedPension - employeeUnemployment) * incomeTaxBruttoValue;
            if (incomeTax < 0) {
                incomeTax = 0;
            }
        } 
        if (1200 < brutto && brutto < 2100) {
            taxFreeIncome = 500 - 0.55556 * (brutto - 1200);
            incomeTax = (brutto - taxFreeIncome - fundedPension - employeeUnemployment) * incomeTaxBruttoValue;
        } 
        if (2100 <= brutto) {
            taxFreeIncome = 0;
            incomeTax = (brutto - taxFreeIncome - fundedPension - employeeUnemployment) * incomeTaxBruttoValue;
            
        }
    } else {
        taxFreeIncome = 0;
        incomeTax = (brutto - taxFreeIncome - fundedPension - employeeUnemployment) * incomeTaxBruttoValue;

    }

    if (employerUnemploymentCheckbox.checked == true) {
        employerUnemployment = brutto * unemploymentEmployerPercent;
    } else {
        employerUnemployment = 0;
    }

    socialTax = brutto * socialTaxPercent;

    employerExpense = brutto + employerUnemployment + socialTax;
}

function showCalculations(brutto, taxFreeIncome, socialTax, unemploymentEmployer, unemploymentEmployee, employerExpense, fundedPension, incomeTax, netto) {
    if (brutto <= 500) {
        taxFreeIncome = netto;
    }
    document.getElementById("brutto").innerHTML = brutto.toFixed(2);
    document.getElementById("taxFreeIncome").innerHTML = taxFreeIncome.toFixed(2);
    document.getElementById("socialTax").innerHTML = socialTax.toFixed(2);
    document.getElementById("unemploymentEmployer").innerHTML = unemploymentEmployer.toFixed(2);
    document.getElementById("unemploymentEmployee").innerHTML = unemploymentEmployee.toFixed(2);
    document.getElementById("employerExpense").innerHTML = employerExpense.toFixed(2);
    document.getElementById("fundedPension").innerHTML = fundedPension.toFixed(2);
    document.getElementById("incomeTax").innerHTML = incomeTax.toFixed(2);
    document.getElementById("netto").innerHTML = netto.toFixed(2);   
}
