'use strict'

const start = document.getElementById('start');
const btnPlus = document.getElementsByTagName('button')
const incomePlus = btnPlus[0];
const expensesPlus = btnPlus[1];
const depositCheck = document.querySelector('#deposit-check');
const additionalIncomeItem = document.querySelectorAll('.additional_income-item');
const budgetMonthValue = document.getElementsByClassName('budget_month-value')[0];
const budgetDayValue = document.getElementsByClassName('budget_day-value')[0];
const expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0];
const additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0];
const additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0];
const incomePeriodValue = document.getElementsByClassName('income_period-value')[0];
const targetMonthValue = document.getElementsByClassName('target_month-value')[0];
const salaryAmount = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
const incomeAmount = document.querySelector('.income-amount');
const expensesTitle = document.querySelector('.expenses-title');
let expensesItems = document.querySelectorAll('.expenses-items');
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');
let incomeItem = document.querySelectorAll('.income-items');
let money; 

let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
let isText = function(a) {
    return (!isNaN(a));
}

// проверка на введенные данные в месячный доход и блокировка кнопки пока поле пустое или не соответствует
let disabled = function() {
    
    if (salaryAmount.value.trim() !== '' && isNumber(salaryAmount.value.trim())) {
        start.disabled = false;
    } else {start.disabled = true;}
};
start.disabled = true;
salaryAmount.addEventListener('input', disabled); // конец проверки

let appData = {
    income: {},
    addIncome: [],
    expenses: {},
    addExpenses: [],
    deposit: false,
    percentDeposot: 0,
    moneyDeposit: 0,
    budget: 0,
    budgetDay: 0,
    budgetMonth: 0,
    expenseMonth:0,
    incomeMonth: 0,

    start: function() {

        
        appData.budget  = salaryAmount.value;

        appData.getExpenses();
        
        appData.getExpensesMonth();
        appData.getIncome();
      
        appData.getBudget();
        appData.getAddExpenses();
        appData.getAddIncome();
        
        appData.getTargetMonth();
        
        appData.showResult();
        
        //appData.getInfoDeposit();
    },
    showResult: function(){
        budgetMonthValue.value = appData.budgetMonth;
        budgetDayValue.value = appData.budgetDay;
        expensesMonthValue.value = appData.expenseMonth;
        additionalExpensesValue.value = appData.addExpenses.join(', ');
        additionalIncomeValue.value = appData.addIncome.join(',');
        targetMonthValue.value = Math.ceil(appData.getTargetMonth());
        incomePeriodValue.value = appData.calcPeriod();
        // изменение периода влечет за собой моментальный перерасчет (начинает работать после нажатия кнопки рассчитать)
        let changeRange = function(){
            incomePeriodValue.value = appData.calcPeriod();
        };
        periodSelect.addEventListener('input', changeRange);
        
    },
    addExpensesBlock: function() {
        
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        expensesItems = document.querySelectorAll('.expenses-items');
        if(expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }


    },
  
    getExpenses: function () {
        expensesItems.forEach(function(item){
            let itemExpenses = item.querySelector('.expenses-title').value;
            let cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses !== '' && cashExpenses !== '') {
                appData.expenses[itemExpenses] = cashExpenses;
            }

        })
    },


    getAddExpenses: function() {
        let addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach(function(item){
            item = item.trim();
            if(item !== ''){
                appData.addExpenses.push(item);
            }
            
        }) 
    },
    addIncomeBlock: function() {
        
        let cloneIncomeItem = incomeItem[0].cloneNode(true);
        incomeItem[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
        incomeItem = document.querySelectorAll('.income-items');
        if(incomeItem.length === 3) {
            incomePlus.style.display = 'none';
        }


    },
    getIncome: function(){
        incomeItem.forEach(function(item){
            let itemIncome = item.querySelector('.income-title').value;
            let cashIncome = +item.querySelector('.income-amount').value;
            
            if(itemIncome !== '' && cashIncome !== '') {
                appData.income[itemIncome] = cashIncome;
            };
            console.log(cashIncome);
        });
        

             for(let key in appData.income){
                appData.incomeMonth += appData.income[key]
            };
        
    },
    

    getAddIncome: function () {
        additionalIncomeItem.forEach(function(item){
            let itemValue = item.value.trim();
            if(itemValue !== '') {
                appData.addIncome.push(itemValue);
            };
        })

    },
    
    getTargetMonth: function() {
        return targetAmount.value/appData.budgetMonth;
    },

    getStatusIncome: function() {
        if (appData.budgetDay >= 1200 ) {
            console.log('У вас высокий уровень дохода')
        } else if (appData.budgetDay >= 600 && appData.budgetDay < 1200) {
            console.log('У вас средний уровень дохода')
        } else if (appData.budgetDay < 600 && appData.budgetDay >= 0) {
            console.log('К сожалению у вас уровень дохода ниже среднего')
            } else { console.log('Что то пошло не так')
            }
    },

     getExpensesMonth: function() {
         let sum = 0;
        for (let key in appData.expenses) {
            sum += +appData.expenses[key];
            }  
        appData.expenseMonth = sum;    
        
           return sum
    },

    getBudget: function() {
        
        appData.budgetMonth = (+appData.budget  + +appData.incomeMonth - appData.getExpensesMonth());
        appData.budgetDay = Math.floor(appData.getExpensesMonth()/30);
        console.log(appData.budget, appData.incomeMonth, appData.budgetMonth)
    },

    getInfoDeposit: function() {
        if (appData.deposit) {
            do {appData.percentDeposot = prompt('Какой годовой процент?', '10'); } while (!isNumber(appData.percentDeposot));
            do {appData.moneyDeposit = prompt('какая сумма заложена?', '10000'); } while (!isNumber(appData.moneyDeposit));
            
        }
    },
    calcPeriod: function() {
       return appData.budgetMonth * periodSelect.value;
    }
};

start.addEventListener('click', appData.start);



appData.getStatusIncome();

expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);

// изменение значения под шкалой при передвижении бегунка
let addPeriodChange = function () {
let periodAmount = document.querySelector('.period-amount');
periodAmount.textContent = periodSelect.value;
};
periodSelect.addEventListener('input', addPeriodChange)



