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

    
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
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
        expenseContainer: '.expenses__list'
    }
    
    return {
        getinput: function() {
            return {
            type: document.querySelector(DOMstrings.inputType).value,  // Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
            };

        },
        
        // Displaying the information
        addListItem: function(obj, type){
            var html, newHtml, element;
            // Create HTML string with placeholder text
            
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
        
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //Insert HTML into the DOM
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
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
    };
    
    
    
    // This function runs when someone presses the add button, or enter key
    // its like the control center for the entire application
    var ctrlAddItem = function() {
        var input, newItem;
        
        // 1. Get field input data
        input = UICtrl.getinput();
        
        // 2. Add the item to the budget controller
        // comes from input variable above
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        
        // 4. Calculate the budget
        
        
        // 5. Display the budget on UI
        
    }
    
    return {
        init: function() {
            console.log('Application started...');
            setupEventListeners();
        }
    }

    
})(budgetController, UIController);

controller.init();