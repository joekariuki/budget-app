// BUDGET CONTROLLER
let budgetController = (function() {

  let Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };



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

  return {
    addItem: function(type, des, val) {
        let newItem;
        newItem new Expense(ID, des, val);
    }
  }

})();

// UI CONTROLLER
let UIController = (function() {

    let DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn'

    }

    return {
      getInput: function() {
        return {
            type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: document.querySelector(DOMstrings.inputValue).value
        };
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
      // Get field input data
      let input = UICtrl.getInput();
      // Add item to budget controller

      // Add item to user interface

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
