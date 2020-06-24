'use strict';

const start = document.getElementById('start');
const btnPlus = document.getElementsByTagName('button');
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
const cancel = document.getElementById('cancel');
let money; 
let input = document.querySelectorAll('input');
let periodAmount = document.querySelector('.period-amount');

let isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

let isText = function(a) {
    return (!isNaN(a));
};
 
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
       this.budget  = salaryAmount.value;
       

       this.getExpenses();
        
        this.getExpensesMonth();
        this.getIncome();
      
        this.getBudget();
        this.getAddExpenses();
        this.getAddIncome();
        
        this.getTargetMonth();
        
        this.showResult();
        
        this.getInfoDeposit();

        let inputDel = document.querySelectorAll('[type="text"]');
        inputDel.forEach(function(item) {
            item.disabled = true;
         
        });
       start.style.display = 'none';
       cancel.style.display = 'inline';
       incomePlus.disabled = true;
       expensesPlus.disabled = true; 



    },
    showResult: function(){
        
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = this.budgetDay;
        expensesMonthValue.value = this.expenseMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(',');
        targetMonthValue.value = Math.ceil(this.getTargetMonth());
        incomePeriodValue.value = this.calcPeriod();
        // изменение периода влечет за собой моментальный перерасчет (начинает работать после нажатия кнопки рассчитать)
        let changeRange = function(){
            incomePeriodValue.value = appData.calcPeriod();
        };
        periodSelect.addEventListener('input', changeRange);
        
    },
    addExpensesBlock: function() {
        
        
        let cloneExpensesItem = expensesItems[0].cloneNode(true);
        let clonInput = cloneExpensesItem.querySelectorAll('input');
        clonInput[0].value = '';
        clonInput[1].value = ''; // очищаем поле добавленного элемента

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
        let clonInputIncome = cloneIncomeItem.querySelectorAll('input');
        clonInputIncome[0].value = '';
        clonInputIncome[1].value = ''; // очищаем поле добавленного элемента

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
        
        return targetAmount.value/this.budgetMonth;
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
        for (let key in this.expenses) {
            sum += +this.expenses[key];
            }  
        this.expenseMonth = sum;    
        
           return sum
    },

    getBudget: function() {
        
        
        this.budgetMonth = (+this.budget  + +this.incomeMonth - this.getExpensesMonth());
        this.budgetDay = Math.floor(this.getExpensesMonth()/30);
        
    },

    getInfoDeposit: function() {
        
        if (this.deposit) {
            do {this.percentDeposot = prompt('Какой годовой процент?', '10'); } while (!isNumber(this.percentDeposot));
            do {this.moneyDeposit = prompt('какая сумма заложена?', '10000'); } while (!isNumber(this.moneyDeposit));
            
        }
    },

    calcPeriod: function() {
        
       return this.budgetMonth * periodSelect.value;
    },

    // stop: function() { //перенести в старт 
        
        
    //     },
    
    reset: function() {
       
        this.income = {};
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposot = 0;
        this.moneyDeposit = 0;
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expenseMonth = 0;
        this.incomeMonth = 0;
        incomePlus.disabled = false;
        expensesPlus.disabled = false;
        let input = document.querySelectorAll('input');

        input.forEach(function(item) {
            item.value = '';
            cancel.style.display = 'none';
            start.style.display = 'inline'; 
    });

        let inputDel = document.querySelectorAll('[type="text"]');
        inputDel.forEach(function(item) {
            item.disabled = false;
            
        });

        let incomeItemDel = document.querySelectorAll('.income-items');
        incomeItemDel.forEach(function(item, i){
            if (i !== 0) {
                
                item.remove();
            }
         

        });

        let  expensesItems = document.querySelectorAll('.expenses-items');
        expensesItems.forEach(function(item, i){
            
            if (i !== 0) {
                
                item.remove();
            };
        });

  

    periodSelect.value = '1';
    periodAmount.textContent = 1;
    
}

};


appData.start = appData.start.bind(appData);
appData.reset = appData.reset.bind(appData);  




start.addEventListener('click', appData.start);
cancel.addEventListener('click', appData.reset);















appData.getStatusIncome();

expensesPlus.addEventListener('click', appData.addExpensesBlock);
incomePlus.addEventListener('click', appData.addIncomeBlock);

// изменение значения под шкалой при передвижении бегунка
let addPeriodChange = function () {

periodAmount.textContent = periodSelect.value;
};
periodSelect.addEventListener('input', addPeriodChange)


// проверка на русский алфавит и символы 
function Init () {
    let placeholder = document.querySelectorAll('[placeholder="Наименование"]');
    placeholder.forEach(function(item, i){
    placeholder[i].addEventListener( 'keypress', checkName, false );
})
};

function checkName(evt) {
    var charCode = evt.charCode;
    if (charCode != 0) {

        let chek =  false;
        if(charCode < 1040)  {
            if (charCode > 31 && charCode <= 34 ) {
                    chek = true;
            } else if(charCode >= 39 && charCode <= 41) {
                chek = true;
            }else if(charCode >= 44 && charCode <= 46) {
                chek = true;
            }else if(charCode >= 58 && charCode <= 59) {
                chek = true;
            }

        } else {
            if (charCode >= 1040 && charCode <= 1103) {
                chek = true;
            }
        }

        if (!chek) {

            evt.preventDefault();
            alert(
            "Пожалуйста, используйте только буквы русского алфавита или знаки препинания"
            + "\n" + "charCode: " + charCode + "\n"
                );
            }
    }
};
Init();

//проверка на цифры полей суммы
function Init2 () {
    let placeholderSum = document.querySelectorAll('[placeholder="Сумма"]');
    placeholderSum.forEach(function(item, i){
        placeholderSum[i].addEventListener( 'keypress', checkName2, false );
})
};


function checkName2(evt) {
    var charCode = evt.charCode;
    if (charCode != 0) {
        let chek =  false;

        if(charCode >= 48 && charCode <= 57 )  {
                chek = true;
            };

        if (!chek) {

            evt.preventDefault();
            alert(
            "Пожалуйста, используйте только цифры"
                );
            }
    }
};
Init2();