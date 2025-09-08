// registration.js

// Word spin animation
const words = ["COLOMBO", "ANURADHAPURA", "TRINKOMALIEE", "GALLE"];
let index = 0;
const animatedSpan = document.getElementById("animatedWords");

function changeWord() {
    animatedSpan.innerHTML = "";
    const wordSpan = document.createElement("span");
    wordSpan.classList.add("word-spin");
    wordSpan.textContent = words[index];
    animatedSpan.appendChild(wordSpan);
    index = (index + 1) % words.length;
}

changeWord();
setInterval(changeWord, 2000);

// Toggle password visibility
const togglePasswordBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePasswordBtn.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePasswordBtn.querySelector("i").classList.toggle("fa-eye-slash");
});

// Registration form submission
const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate password match
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Prepare user data
    const userData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        nic: document.getElementById("nic").value.trim(),
        passwordHash: password
    };

    try {
        const response = await fetch("http://localhost:8080/api/v1/register/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "User registered successfully!");
            registrationForm.reset();
        } else {
            alert(result.message || "Registration failed. Please try again!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while registering. Check console for details.");
    }
});
