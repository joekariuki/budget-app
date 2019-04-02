// BUDGET CONTROLLER
let budgetController = (function() {
  // Expense Structure
  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Income Structure
  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  // Data Structue
  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };
  // Add new item method
  return {
    addItem: function(type, des, val) {
        let newItem, ID;
        // Create new ID
        if (data.allItems[type].length  > 0) {
          ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        } else {
          ID = 0;
        }
        // Create new item based on 'inc' or 'exp' type
        if (type === 'exp') {
          newItem = new Expense(ID, des, val);
        } else if (type === 'inc') {
          newItem = new Income(ID, des, val);
        }
        // Push it into our data structure
        data.allItems[type].push(newItem);
        // Return the new element
        return newItem;
    },
    testing: function() {
      console.log(data);
    }
  };

})();

// UI CONTROLLER
let UIController = (function() {

    let DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list'
    }

    return {
      getInput: function() {
        return {
            type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
        };
      },

      addListItem: function(obj, type) {
        let html, newHtml, element;
        // Create HTML string with placeholder text
        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp'){
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        // Replace placeholder text with data from object
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', obj.value);
        // Insert HTML into DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    };
})();

// GLOBAL CONTROLLER
let controller = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function() {
      let DOM = UICtrl.getDOMstrings();

      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });
    };

    let ctrlAddItem = function() {
      // variables
      let input, newItem;
      // Get field input data
      input = UICtrl.getInput();
      // Add item to budget controller
      newItem = budgetController.addItem(input.type, input.description, input.value);
      // Add item to user interface
      UICtrl.addListItem(newItem, input.type);
      // Calculate the budget

      // Display budget on user interface
    };

    return {
      init: function() {
        console.log('Application has started.');
        setupEventListeners();
      }
    }

})(budgetController, UIController);

controller.init();
