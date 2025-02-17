// Expense Tracker Application

// Select DOM Elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionForm = document.getElementById('transaction-form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');
const transactionList = document.getElementById('transaction-list');

// Initialize transactions array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to update local storage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Function to calculate total balance, income, and expenses
function calculateTotals() {
    const amounts = transactions.map(transaction => transaction.amount);
    
    const total = amounts.reduce((acc, item) => acc + item, 0);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0);
    const expense = amounts
        .filter(item => item < 0)
        .reduce((acc, item) => acc + item, 0);

    balanceEl.textContent = `$${total.toFixed(2)}`;
    incomeEl.textContent = `$${income.toFixed(2)}`;
    expenseEl.textContent = `$${Math.abs(expense).toFixed(2)}`;
}

// Function to render transactions
function renderTransactions() {
    // Clear previous transactions
    transactionList.innerHTML = '';

    // Render each transaction
    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.classList.add(transaction.type);
        
        li.innerHTML = `
            <span>${transaction.text}</span>
            <span>$${Math.abs(transaction.amount).toFixed(2)}</span>
            <button onclick="deleteTransaction(${index})">Delete</button>
        `;
        
        transactionList.appendChild(li);
    });

    // Recalculate totals
    calculateTotals();
}

// Function to add a new transaction
function addTransaction(e) {
    e.preventDefault();

    const text = textInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = document.querySelector('input[name="type"]:checked').value;

    // Validate inputs
    if (text === '' || isNaN(amount) || amount === 0) {
        alert('Please enter a valid description and amount');
        return;
    }

    // Adjust amount based on transaction type
    const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    // Create transaction object
    const transaction = {
        text,
        amount: finalAmount,
        type
    };

    // Add transaction to array
    transactions.push(transaction);

    // Update local storage and render
    updateLocalStorage();
    renderTransactions();

    // Reset form
    textInput.value = '';
    amountInput.value = '';
    document.querySelector('input[name="type"]:checked').checked = false;
}

// Function to delete a transaction
function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    renderTransactions();
}

// Event Listeners
transactionForm.addEventListener('submit', addTransaction);

// Initial render
renderTransactions();
