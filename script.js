// Fetch and display expenses on page load
async function fetchExpenses() {
    try {
        const response = await fetch('http://localhost:3000/api/expenses');
        const expenses = await response.json();
        
        const tbody = document.getElementById('expenseTableBody');
        tbody.innerHTML = ''; // Clear old rows

        expenses.forEach(exp => {
            const row = document.createElement('tr');
            const formattedDate = new Date(exp.date).toISOString().split('T')[0];
            const categoryClass = exp.category_name.toLowerCase();

            row.innerHTML = `
                <td>${exp.id}</td>
                <td>${exp.user_name}</td>
                <td><span class="badge ${categoryClass}">${exp.category_name}</span></td>
                <td>$${Number(exp.amount).toFixed(2)}</td>
                <td>${formattedDate}</td>
                <td>${exp.description || ''}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading expenses:', error);
    }
}

// Handle Form Submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newExpense = {
        amount: document.getElementById('amount').value,
        category_id: document.getElementById('category').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/expenses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newExpense)
        });

        if (response.ok) {
            document.getElementById('expenseForm').reset();
            fetchExpenses(); // Refresh the table instantly!
        } else {
            alert('Failed to add expense');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
});

// Load expenses when the page opens
fetchExpenses();