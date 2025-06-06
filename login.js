document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(loginForm);
            const userType = loginForm.getAttribute('data-user-type'); // Get user type from form attribute
            const endpoint = `/${userType}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                body: new URLSearchParams(formData)
            });

            const result = await response.json();
            if (result.success) {
                // Store user data in localStorage
                localStorage.setItem('usernameInitial', result.usernameInitial);
                localStorage.setItem('userType', result.userType);

                // Redirect to home page
                window.location.href = result.redirectUrl || 'index1.html';
            } else {
                alert(result.message); // Show error message
            }
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const formData = new FormData(signupForm);
            const userType = signupForm.getAttribute('data-user-type'); // Get user type from form attribute
            const endpoint = `/${userType}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                body: new URLSearchParams(formData)
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message); // Show success message
                toggleForms(); // Switch to login form
            } else {
                alert(result.message); // Show error message
            }
        });
    }

    // Handle logout functionality
    const userCircle = document.getElementById('userCircle');
    const logoutButton = document.getElementById('logoutButton');
    const letsGoButton = document.getElementById('letsGoButton');

    if (userCircle && logoutButton && letsGoButton) {
        // Toggle logout button visibility when circle is clicked
        userCircle.addEventListener('click', () => {
            logoutButton.style.display = logoutButton.style.display === 'block' ? 'none' : 'block';
        });

        // Handle logout with confirmation dialog
        logoutButton.addEventListener('click', () => {
            const confirmLogout = confirm('Are you sure you want to log out?');
            if (confirmLogout) {
                // Clear user data from localStorage
                localStorage.removeItem('usernameInitial');
                localStorage.removeItem('userType');

                // Revert the "Let's Go" button to its original state with animation
                letsGoButton.classList.remove('circle');
                letsGoButton.classList.add('revert');
                letsGoButton.innerHTML = '<span>Let\'s Go</span>';
                letsGoButton.style.backgroundColor = '#007bff';

                // Remove the revert class after animation completes
                setTimeout(() => {
                    letsGoButton.classList.remove('revert');
                }, 500); // Match the duration of the animation

                // Redirect to the home page
                window.location.href = 'index1.html';
            }
        });
    }

    // Handle "Let's Go" button transformation
    if (letsGoButton) {
        const usernameInitial = localStorage.getItem('usernameInitial');
        const userType = localStorage.getItem('userType');

        if (usernameInitial && userType) {
            // User is logged in
            // Transform the button into a circle with the user's initial
            letsGoButton.classList.add('circle');
            letsGoButton.textContent = usernameInitial;

            // Add user-specific color based on user type
            if (userType === 'student') {
                letsGoButton.style.backgroundColor = 'green';
            } else if (userType === 'institute') {
                letsGoButton.style.backgroundColor = 'purple';
            } else if (userType === 'admin') {
                letsGoButton.style.backgroundColor = 'red';
            }

            // Handle logout when the circle is clicked
            letsGoButton.addEventListener('click', () => {
                const confirmLogout = confirm('Are you sure you want to log out?');
                if (confirmLogout) {
                    // Clear user data from localStorage
                    localStorage.removeItem('usernameInitial');
                    localStorage.removeItem('userType');

                    // Revert the button to its original state with animation
                    letsGoButton.classList.remove('circle');
                    letsGoButton.classList.add('revert');
                    letsGoButton.innerHTML = '<span>Let\'s Go</span>';
                    letsGoButton.style.backgroundColor = '#007bff';

                    // Remove the revert class after animation completes
                    setTimeout(() => {
                        letsGoButton.classList.remove('revert');
                    }, 500); // Match the duration of the animation

                    // Redirect to the home page
                    window.location.href = 'index1.html';
                }
            });
        } else {
            // User is not logged in
            // Redirect to the login page when the button is clicked
            letsGoButton.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    }
});