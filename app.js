document.getElementById('nextButton').addEventListener('click', function () {
    
    const studentRole = document.getElementById('studentRole');
    const instituteRole = document.getElementById('instituteRole');
    const adminRole = document.getElementById('adminRole');
    
    
    if (studentRole.checked) {
        location.href = 'studentForm.html'; 
    } else if (instituteRole.checked) {
        location.href = 'instituteform.html'; 
    } else if (adminRole.checked) {
        location.href = 'adminform.html'; 
    } else {
        alert('Please select a role!'); 
    }
});
