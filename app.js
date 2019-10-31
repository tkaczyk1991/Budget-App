// BUDGET CONTROLLER
var budgetController = (function() {
    
    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){ // parameters are: item, index, array
            sum += cur.value;                      // curr = item 
            data.totals[type] = sum;
        });
        
    }
    
    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    return {
        addItem: function(type, des, val){
            var newItem, ID;
            
            // [1 2 3 4 5], next ID = 6
            // [1 2 4 6 8], next ID = 9
            // ID = last ID + 1
            
            // Create new ID
            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            
            
            // Create new item, based on 'inc' or 'exp' type
            // All new data, gets stored inside the data object
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);    
            } else if (type === 'inc'){
                newItem = new Income(ID, des, val);
            } 
            
            // Type is either exp or inc (expense or income), comes from parameter of function
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
            
        }, 
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            // data.allItems[type][id]
            // ids = [1 2 4 6 8]
            // index = 3
            
            ids = data.allItems[type].map(function(current){
               return current.id; 
            });
            // indexOf returns the index, of the parameter element (so the index of the ID passed into it)
            index = ids.indexOf(id);
            if(index !== -1){
                // splice = delete from array
                data.allItems[type].splice(index, 1);
            }
            
        },
        
        calculateBudget: function() {
            
            // Calculate total income + expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            // Calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of income spent
            if(data.totals.inc > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);    
            } else {
                data.percentage = -1;
            }
            
        },
        
        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }  
        },
        
        testing: function(){
            console.log(data);
        }
    }
    
})();


// UI CONTROLLER
var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }
    
    return {
        getinput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value,  // Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //parseFloat converts string to number
            };

        },
        
        // Displaying the information
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
        
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
        },
        
        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
            // Go into the array prototype, and pass
            // a list into the array slice.call method
            fieldsArr = Array.prototype.slice.call(fields);
            
            // callback function is applied to each element passed into the forEach method (this sets the fields to an empty string)
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            // first element of the fields array is the description 
            fieldsArr[0].focus();
            
        },
        
        displayBudget: function(obj) {
          
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
            
            if(obj.percentage > 0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';    
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        getDOMstrings: function() {
            return DOMstrings;
        }
    }
    
})();



//GLOBAL APP CONTROLLER
// pass other two modules into the controller module
var controller = (function(budgetCtrl, UICtrl) {

    
    var setupEventListeners = function(){
        
        // get DOM strings from public part of UI controller
        var DOM = UICtrl.getDOMstrings();
        
        //what happens when user clicks button 
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(event){
        
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();    
            }
        
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
    };
    
    
    
    
    var updateBudget = function(){
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        // 2. Return the budget
        var budget = budgetCtrl.getBudget();
//        console.log(budget);
        
        // 3. Display the budget on UI
        UICtrl.displayBudget(budget);
    }
    
    
    // This function runs when someone presses the add button, or enter key
    // its like the control center for the entire application
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get field input data
        input = UICtrl.getinput();
        
        
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            // 2. Add the item to the budget controller
            // comes from input variable above
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate + update budget
            updateBudget();    
        }
        
        
    }
    
    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;
        //when you click on the button, you're actually clicking the icon element... use: .parentNode to move up the chain until you are clicking on what you want to click on / return
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 
        
        if(itemID){
            
            // .split returns an array if all parts of the original string, with the parameter removed
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete item from data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete item from UI
            
            // 3. Update and show the new budget
            
            
        }
    };
    
    
    return {
        init: function() {
            console.log('Application started...');
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

    
})(budgetController, UIController);

controller.init();