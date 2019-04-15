// BUDGET CONTROLLER
const budgetController = (function() {
  // Expense Structure
  const Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
      if (totalIncome > 0) {
        this.percentage = Math.round((this.value / totalIncome) * 100);
      } else {
        this.percentage = -1;
      }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  // Income Structure
  const Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  const calculateTotal = function(type) {
    let sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum = sum + cur.value;
    });
    data.totals[type] = sum;
  };

  // Global Data Structue
  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    // percentage: -1
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

    deleteItem: function(type, id) {
      let ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1) {
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function() {
      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // Calculate budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // Calculate percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });

    },

    getPercentages: function() {
      let allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };

})();


// UI CONTROLLER
const UIController = (function() {

    const DOMstrings = {
      inputType: '.add__type',
      inputDescription: '.add__description',
      inputValue: '.add__value',
      inputBtn: '.add__btn',
      incomeContainer: '.income__list',
      expensesContainer: '.expenses__list',
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expensesLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container',
      expensesPercLabel: '.item__percentage',
      dateLabel:'.budget__title--month'
    };

    const formatNumber = function(num, type) {
      // + or - before number
      var numSplit, int, dec, type;

      num = Math.abs(num);
      num = num.toFixed(2);
      numSplit = num.split('.')

      int = numSplit[0];

      if (int.length > 3) {
        int = int.substr(0, 1) + ',' + int.substr(int.length - 3, 3)
      }

      dec = numSplit[1];

      return (type === 'exp' ? sign = '-' : '+') + ' ' + int + '.' + dec;
    };

    const nodeListforEach = function(list, callback) {
      for (let i = 0; i < list.length; i++) {
        callback(list[i], i);
      }
    };

    return {
      getInput: function() {
        return {
            type: document.querySelector(DOMstrings.inputType).value, // Will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
        };
      },

      addListItem: function(obj, type) {
        var html, newHtml, element;
        // Create HTML string with placeholder text
        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        } else if (type === 'exp'){
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }
        // Replace placeholder text with data from object
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
        // Insert HTML into DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
      },

      deleteListItem: function(selectorID) {
          var el = document.getElementById(selectorID);
          el.parentNode.removeChild(el);
      },

      clearFields: function() {
        var fields, fieldsArr;

        fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach(function(current, index, array) {
          current.value = "";
        });

        fieldsArr[0].focus();
      },

      displayBudget: function(obj) {
          var type;
          obj.budget > 0 ? type = 'inc' : type = 'exp';

          document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
          document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
          document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

          if (obj.percentage > 0) {
            document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
          } else {
            document.querySelector(DOMstrings.percentageLabel).textContent = '---';
          }
      },

      displayPercentages: function(percentages) {

        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

        nodeListforEach(fields, function(current, index){

          if (percentages[index] > 0) {
            current.textContent = percentages[index] + '%';
          } else {
            current.textContent = '---';
          }

        });
      },

      displayDate: function() {
        let now, year, months, month;
        now = new Date();
        year = now.getFullYear();

        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        month = now.getMonth();

        document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
      },

      changeType: function() {
        let fieldsType = document.querySelectorAll(
          DOMstrings.inputType + ',' +
          DOMstrings.inputDescription + ',' +
          DOMstrings.inputValue);

        nodeListforEach(fieldsType, function(cur) {
          cur.classList.toggle('red-focus');
        });

        document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
      },

      getDOMstrings: function() {
        return DOMstrings;
      }
    };
})();


// GLOBAL CONTROLLER
const controller = (function(budgetCtrl, UICtrl) {

    const setupEventListeners = function() {
      const DOM = UICtrl.getDOMstrings();

      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

      document.addEventListener('keypress', function(event) {
        if (event.keyCode === 13 || event.which === 13) {
          ctrlAddItem();
        }
      });

      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

      document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

    };

    const updateBudget = function() {
      // Calculate the budget
      budgetCtrl.calculateBudget();
      // Return budget
      const budget = budgetCtrl.getBudget();
      // Display budget on user interface
      UICtrl.displayBudget(budget);
    };


    const updatePercentages = function() {
      // Calculate the percentages
      budgetCtrl.calculatePercentages();
      // Read percentages from budget controller
      let percentages = budgetCtrl.getPercentages();
      // Update the UI with new percentages
      UICtrl.displayPercentages(percentages);
    };

    const ctrlAddItem = function() {
      var input, newItem;
      // Get field input data
      input = UICtrl.getInput();

      if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
        // Add item to budget controller
        newItem = budgetController.addItem(input.type, input.description, input.value);
        // Add item to user interface
        UICtrl.addListItem(newItem, input.type);
        // Clears the fields
        UICtrl.clearFields();
        // Calculate & update budget
        updateBudget();
        // Calculate & update percentages
        updatePercentages();
      }
    };

    const ctrlDeleteItem = function(event) {
      var itemID, splitID, type, ID;

      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

      if(itemID) {
          splitID = itemID.split('-');
          type = splitID[0];
          ID = parseInt(splitID[1]);
          // Delete item from data Structure
          budgetCtrl.deleteItem(type, ID);
          // Delete  the item from the UI
          UICtrl.deleteListItem(itemID);
          // Update and show new budget
          updateBudget();
          // Calculate & update percentages
          updatePercentages();
      }


    };

    return {
      init: function() {
        console.log('Application has started.');
        UICtrl.displayDate();
        UICtrl.displayBudget({
            budget: 0,
            totalInc: 0,
            totalExp: 0,
            percentage: 0
        });
        setupEventListeners();
      }
    }

})(budgetController, UIController);

controller.init();
