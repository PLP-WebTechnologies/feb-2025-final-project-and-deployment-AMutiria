const employeeList = document.getElementById('employee-list');
const employeeSelect = document.getElementById('employee-select');
const assignGoalBtn = document.getElementById('assign-goal-btn');
const viewGoalsBtn = document.getElementById('view-goals-btn');
const assignGoalForm = document.getElementById('assign-goal-form');
const saveGoalBtn = document.getElementById('save-goal-btn');
const cancelGoalBtn = document.getElementById('cancel-goal-btn');
const goalDescriptionInput = document.getElementById('goal-description');
const reviewPeriodInput = document.getElementById('review-period');
const goalsList = document.getElementById('goals-list');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const assignGoalShortcut = document.getElementById('assign-goal-shortcut');
const viewGoalsShortcut = document.getElementById('view-goals-shortcut');

let currentEmployeeId = null;

function loadData() {
    try {
        const data = JSON.parse(localStorage.getItem('employeeData')) || { "employees": [], "goals": {} };
        return data;
    } catch (error) {
        console.error("Error loading data:", error);
        return { "employees": [], "goals": {} };
    }
}

function saveData(data) {
    localStorage.setItem('employeeData', JSON.stringify(data));
}

function renderEmployees() {
    const data = loadData();
    employeeList.innerHTML = '';
    employeeSelect.innerHTML = '<option value="">Select Employee</option>';
    data.employees.forEach(employee => {
        const li = document.createElement('li');
        li.textContent = `${employee.name} (ID: ${employee.id})`;
        employeeList.appendChild(li);

        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = employee.name;
        employeeSelect.appendChild(option);
    });
    updateGoalButtons();
}

function updateGoalButtons() {
    assignGoalBtn.disabled = !currentEmployeeId;
    viewGoalsBtn.disabled = !currentEmployeeId;
    assignGoalShortcut.disabled = !currentEmployeeId;
    viewGoalsShortcut.disabled = !currentEmployeeId;
}

function assignGoal(employeeId, goalDescription, reviewPeriod) {
    const data = loadData();
    if (!data.goals[employeeId]) {
        data.goals[employeeId] = [];
    }
    data.goals[employeeId].push({ goal: goalDescription, period: reviewPeriod });
    saveData(data);
    renderGoals(employeeId);
    alert(`Goal assigned to employee ${employeeId}.`);
}

function viewGoals(employeeId) {
    const data = loadData();
    goalsList.innerHTML = '';
    if (data.goals[employeeId] && data.goals[employeeId].length > 0) {
        data.goals[employeeId].forEach(goal => {
            const li = document.createElement('li');
            li.textContent = `${goal.goal} (Period: ${goal.period})`;
            goalsList.appendChild(li);
        });
    } else {
        goalsList.innerHTML = '<li>No goals assigned to this employee.</li>';
    }
}

function addEmployee(employeeId, name) {
    const data = loadData();
    if (data.employees.some(emp => emp.id === employeeId)) {
        alert(`Employee with ID ${employeeId} already exists.`);
        return;
    }
    data.employees.push({ id: employeeId, name: name });
    saveData(data);
    renderEmployees();
}

// Event Listeners
employeeSelect.addEventListener('change', (event) => {
    currentEmployeeId = event.target.value;
    updateGoalButtons();
    goalsList.innerHTML = '';
});

assignGoalBtn.addEventListener('click', () => {
    assignGoalForm.style.display = 'block';
});

cancelGoalBtn.addEventListener('click', () => {
    assignGoalForm.style.display = 'none';
    goalDescriptionInput.value = '';
    reviewPeriodInput.value = '';
});

saveGoalBtn.addEventListener('click', () => {
    if (currentEmployeeId) {
        const goalDescription = goalDescriptionInput.value.trim();
        const reviewPeriod = reviewPeriodInput.value.trim();
        if (goalDescription && reviewPeriod) {
            assignGoal(currentEmployeeId, goalDescription, reviewPeriod);
            assignGoalForm.style.display = 'none';
            goalDescriptionInput.value = '';
            reviewPeriodInput.value = '';
        } else {
            alert('Please enter both the goal description and review period.');
        }
    } else {
        alert('Please select an employee first.');
    }
});

viewGoalsBtn.addEventListener('click', () => {
    if (currentEmployeeId) {
        viewGoals(currentEmployeeId);
    } else {
        alert('Please select an employee to view their goals.');
    }
});

addEmployeeBtn.addEventListener('click', () => {
    const employeeId = prompt("Enter new employee ID:");
    const employeeName = prompt("Enter new employee name:");
    if (employeeId && employeeName) {
        addEmployee(employeeId, employeeName);
    } else if (employeeId !== null || employeeName !== null) {
        alert("Employee ID and name are required.");
    }
});

assignGoalShortcut.addEventListener('click', () => {
    if (currentEmployeeId) {
        assignGoalForm.style.display = 'block';
    } else {
        alert('Please select an employee first to assign a goal.');
    }
});

viewGoalsShortcut.addEventListener('click', () => {
    if (currentEmployeeId) {
        viewGoals(currentEmployeeId);
    } else {
        alert('Please select an employee first to view their goals.');
    }
});

// Initial data load and rendering
renderEmployees();