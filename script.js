document.addEventListener('DOMContentLoaded', function () {
    for (let i = 0; i < 3; i++) {
        addGradeField();
    }
});

function addGradeField() {
    const container = document.getElementById('gradeInputs');

    const div = document.createElement('div');
    div.className = 'flex items-center gap-3';
    div.innerHTML = `
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Course ${container.children.length + 1}</label>
            <input type="text" placeholder="Course name (optional)" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200">
        </div>
        <div class="w-24">
            <label class="block text-sm font-medium text-gray-700 mb-1">Grade</label>
            <input type="number" step="0.01" min="1" max="5" placeholder="1.00" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 grade-input" required>
        </div>
        <div class="w-24">
            <label class="block text-sm font-medium text-gray-700 mb-1">Units</label>
            <input type="number" min="1" max="10" placeholder="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 units-input" required>
        </div>
        <button onclick="removeGradeField(this)" class="mt-6 text-red-500 hover:text-red-700 transition">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(div);
}

function removeGradeField(button) {
    const container = document.getElementById('gradeInputs');
    if (container.children.length > 1) {
        button.parentElement.remove();
    } else {
        alert("You need at least one course to calculate GWA.");
    }
}

function calculateGWA() {
    const gradeInputs = document.querySelectorAll('.grade-input');
    const unitInputs = document.querySelectorAll('.units-input');

    if (gradeInputs.length === 0) {
        showResult("Please add at least one course", "error");
        return;
    }

    let totalGradePoints = 0;
    let totalUnits = 0;
    let allValid = true;

    gradeInputs.forEach((input, index) => {
        const grade = parseFloat(input.value);
        const units = parseInt(unitInputs[index].value);

        if (isNaN(grade) || isNaN(units) || grade < 1 || grade > 5 || units < 1) {
            input.classList.add('border-red-500');
            unitInputs[index].classList.add('border-red-500');
            allValid = false;
        } else {
            input.classList.remove('border-red-500');
            unitInputs[index].classList.remove('border-red-500');
            totalGradePoints += grade * units;
            totalUnits += units;
        }
    });

    if (!allValid) {
        showResult("Please check your inputs. Grades must be between 1.00-5.00 and units must be positive numbers.", "error");
        return;
    }

    const gwa = totalGradePoints / totalUnits;
    showResult(gwa.toFixed(2), "success");
}

function showResult(gwa, type) {
    const container = document.getElementById('resultContainer');

    if (type === "error") {
        container.innerHTML = `
            <div class="fade-in text-center text-red-600">
                <i class="fas fa-exclamation-triangle text-4xl mb-3"></i>
                <p class="font-medium">${gwa}</p>
            </div>
        `;
        return;
    }

    let rating = "";
    let ratingColor = "";

    if (gwa <= 1.00) {
        rating = "Excellent";
        ratingColor = "text-green-600";
    } else if (gwa <= 1.25) {
        rating = "Very Good";
        ratingColor = "text-blue-600";
    } else if (gwa <= 1.50) {
        rating = "Good";
        ratingColor = "text-indigo-600";
    } else if (gwa <= 1.75) {
        rating = "Satisfactory";
        ratingColor = "text-purple-600";
    } else if (gwa <= 3.00) {
        rating = "Passing";
        ratingColor = "text-yellow-600";
    } else {
        rating = "Needs Improvement";
        ratingColor = "text-red-600";
    }

    container.innerHTML = `
        <div class="fade-in text-center">
            <div class="text-5xl font-bold text-indigo-700 mb-2">${gwa}</div>
            <div class="text-lg ${ratingColor} font-medium mb-4">${rating}</div>
            <div class="bg-gray-100 rounded-full h-3 w-full max-w-xs overflow-hidden mb-4">
                <div class="bg-indigo-500 h-full" style="width: ${100 - ((gwa - 1) / 4 * 100)}%"></div>
            </div>
            <div class="text-sm text-gray-600">
                Based on ${document.querySelectorAll('.grade-input').length} courses
            </div>
        </div>
    `;
}

function resetCalculator() {
    const container = document.getElementById('gradeInputs');
    container.innerHTML = '';
    addGradeField();

    document.getElementById('resultContainer').innerHTML = `
        <div class="text-center text-gray-500">
            <i class="fas fa-calculator text-4xl mb-3 opacity-50"></i>
            <p>Your GWA will appear here</p>
        </div>
    `;
}
