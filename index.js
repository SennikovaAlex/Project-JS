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
const additionalExpensesItem = document.querySelector('.additional_expenses-item');
const targetAmount = document.querySelector('.target-amount');
const periodSelect = document.querySelector('.period-select');
const cancel = document.getElementById('cancel');
const input = document.querySelectorAll('input');
const periodAmount = document.querySelector('.period-amount');
const depositBank = document.querySelector('.deposit-bank'); 
const depositAmount = document.querySelector('.deposit-amount');
const depositPercent = document.querySelector('.deposit-percent');

let expensesItems = document.querySelectorAll('.expenses-items');
let incomeItem = document.querySelectorAll('.income-items');
const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
  

// подключение ООП 

class AppData {
    constructor() {
        this.income = {};
        this.addIncome = [];
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expenseMonth = 0;
        this.incomeMonth = 0;  
    }

    start() {
        

        // const isText = (a) => (!isNaN(a));

        if (salaryAmount.value.trim() !== '' && isNumber(salaryAmount.value.trim())) {
            this.budget  = salaryAmount.value;
            this.getExpenses();
             
             this.getExpensesMonth();
             this.getIncome();
             this.getInfoDeposit();
             
           
             this.getBudget();
             this.getAddExpenses();
             this.getAddIncome();
             
             this.getTargetMonth();
             
             this.showResult();
             
             
        
             const inputDel = document.querySelectorAll('[type="text"]');
             inputDel.forEach((item) => {
                 item.disabled = true;
             });
        
            start.style.display = 'none';
            cancel.style.display = 'inline';
            incomePlus.disabled = true;
            expensesPlus.disabled = true; 
        } else {
            alert('заполните поле месячный доход');
        };
    }
     
    showResult(){
    
            budgetMonthValue.value = this.budgetMonth;
            budgetDayValue.value = this.budgetDay;
            expensesMonthValue.value = this.expenseMonth;
            additionalExpensesValue.value = this.addExpenses.join(', ');
            additionalIncomeValue.value = this.addIncome.join(',');
            targetMonthValue.value = Math.ceil(this.getTargetMonth());
            incomePeriodValue.value = this.calcPeriod();
            // изменение периода влечет за собой моментальный перерасчет (начинает работать после нажатия кнопки рассчитать)
            this.getStatusIncome();
    }

    changeRange() {
    
            incomePeriodValue.value = this.calcPeriod();
    }
        
    addExpensesBlock() {
            
            
        const cloneExpensesItem = expensesItems[0].cloneNode(true);
        const clonInput = cloneExpensesItem.querySelectorAll('input');
        clonInput[0].value = '';
        clonInput[1].value = ''; // очищаем поле добавленного элемента
    
        expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
        
        expensesItems = document.querySelectorAll('.expenses-items');
        
        if(expensesItems.length === 3) {
            expensesPlus.style.display = 'none';
        }
    }

    getExpenses() {

        expensesItems.forEach((item) => {
            
            const itemExpenses = item.querySelector('.expenses-title').value;
            const cashExpenses = item.querySelector('.expenses-amount').value;
            if(itemExpenses !== '' && cashExpenses !== '') {
                this.expenses[itemExpenses] = cashExpenses;
            }
    
        });
    }

    getAddExpenses() {
    
        const addExpenses = additionalExpensesItem.value.split(',');
    
        addExpenses.forEach((item) => {
            item = item.trim();
            if(item !== ''){
                this.addExpenses.push(item);
            } 
        });
        
    }

    addIncomeBlock() {
               
        const cloneIncomeItem = incomeItem[0].cloneNode(true);
        const clonInputIncome = cloneIncomeItem.querySelectorAll('input');
        clonInputIncome[0].value = '';
        clonInputIncome[1].value = ''; // очищаем поле добавленного элемента
    
        incomeItem[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
        incomeItem = document.querySelectorAll('.income-items');
        if(incomeItem.length === 3) {
            incomePlus.style.display = 'none';
        }
    }

    getIncome() {

        incomeItem.forEach((item) => {
            const itemIncome = item.querySelector('.income-title').value;
            const cashIncome = +item.querySelector('.income-amount').value;
            
            if(itemIncome !== '' && cashIncome !== '') {
                this.income[itemIncome] = cashIncome;
            }
            console.log(cashIncome);
        });
        
             for(let key in this.income){
                this.incomeMonth += this.income[key];
            }  
    }
    
    getAddIncome() {
    
        additionalIncomeItem.forEach((item) => {
            const itemValue = item.value.trim();
            if(itemValue !== '') {
                this.addIncome.push(itemValue);
            };
        })
    
    }

    getTargetMonth() {   
        return targetAmount.value/this.budgetMonth;
    }

    getStatusIncome() {
        
        if (this.budgetDay >= 1200 ) {
            console.log('У вас высокий уровень дохода')
        } else if (this.budgetDay >= 600 && this.budgetDay < 1200) {
            console.log('У вас средний уровень дохода')
        } else if (this.budgetDay < 600 && this.budgetDay >= 0) {
            console.log('К сожалению у вас уровень дохода ниже среднего')
            } else { console.log('Что то пошло не так')
            }
    }

    getExpensesMonth() {
        
        let sum = 0;
       for (let key in this.expenses) {
           sum += +this.expenses[key];
           }  
       this.expenseMonth = sum;    
       
          return sum
    };
    
    getBudget = function() {
            
        const monthDeposit = Math.ceil(this.moneyDeposit * (this.percentDeposit / 100));    
        this.budgetMonth = (+this.budget  + +this.incomeMonth - this.getExpensesMonth() + monthDeposit);
        this.budgetDay = Math.floor(this.getExpensesMonth()/30);   
    }

    getInfoDeposit() {
        if(this.deposit) {
            this.percentDeposit = depositPercent.value;
            this.moneyDeposit = depositAmount.value;
        }
        
    }
    
    calcPeriod() {
        
        return this.budgetMonth * periodSelect.value;
     }

     changePersent() {
         const valueSelect = this.value;
        if (valueSelect === 'other') {
           depositPercent.style.display = 'inline-block'; 

           depositPercent.addEventListener('input', () => {
               if(depositPercent.value < 0 || depositPercent.value > 100 || !isNumber(depositPercent.value.trim())) {
            
            alert('Введите число от 0 до 100');
            depositPercent.value = '';

        } else {
            depositPercent.value = depositPercent.value;
            start.disabled = false;
            
        };
        }
        );
           
        } else {
            depositPercent.value = valueSelect;
            depositPercent.style.display = 'none';
        }
        depositPercent.value = depositPercent.value;
     }

    depositHandler() {
        if(depositCheck.checked) {
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePersent);
        } else {
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            
            depositBank.value = '';
            depositAmount.value = '';
            depositPercent.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePersent);
        }
    }
    
    
    eventListeners() {
        this.start = this.start.bind(this);
        this.changeRange = this.changeRange.bind(this);
        this.reset = this.reset.bind(this); 
        
        salaryAmount.addEventListener('input', this.disabled);
      
        start.addEventListener('click', this.start);
        cancel.addEventListener('click', this.reset);
        periodSelect.addEventListener('input', this.changeRange);
        
        expensesPlus.addEventListener('click', this.addExpensesBlock);
        expensesPlus.addEventListener('click', this.checkInput);
        incomePlus.addEventListener('click', this.addIncomeBlock);
        incomePlus.addEventListener('click', this.checkInput);
        
        // изменение значения под шкалой при передвижении бегунка
        const addPeriodChange = () => {
        
            periodAmount.textContent = periodSelect.value;
        };
        periodSelect.addEventListener('input', addPeriodChange);  
        depositCheck.addEventListener('change', this.depositHandler.bind(this));
        this.checkInput();
        

     }

     checkInput() {
         let allInputs = document.querySelectorAll('input');
         allInputs.forEach((item) => {
            if(item.placeholder == 'Наименование' || item.placeholder == 'Название') {
                item.addEventListener('keypress', (evt) => {
                    if((evt.charCode > 1039 && evt.charCode < 1104) ||
                        evt.charCode == 32 || evt.charCode == 44 || evt.charCode == 46 || evt.charCode == 45 || evt.charCode == 59 || evt.charCode == 58 ) {
                        
                    } else {
                        evt.preventDefault();
                    };
                });
            } else if(item.placeholder == 'Сумма') {
                item.addEventListener('keypress', (evt) => { 
                    if((evt.charCode > 47 && evt.charCode < 58) || evt.charCode == 46) {
                        
                    } else {
                        evt.preventDefault();
                    };
                });
                 
            };
        });
    }

     reset() {
       
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
        const input = document.querySelectorAll('input');
        
        incomePlus.style.display = 'inline';
        expensesPlus.style.display = 'inline';

        input.forEach((item) => {
            item.value = '';
            cancel.style.display = 'none';
            start.style.display = 'inline'; 
    });
        
    
        const inputDel = document.querySelectorAll('[type="text"]');
        inputDel.forEach((item) => {
            item.disabled = false;       
        });
    
        const incomeItemDel = document.querySelectorAll('.income-items');
        incomeItemDel.forEach((item, i) => {
            if (i !== 0) {   
                item.remove();
            }
        });
    
        const  expensesItems = document.querySelectorAll('.expenses-items');
        expensesItems.forEach((item, i) => {
            
            if (i !== 0) {
                
                item.remove();
            };
        });
    
    periodSelect.value = '1';
    periodAmount.textContent = 1;
    }
};


const appData = new AppData();
appData.eventListeners();








