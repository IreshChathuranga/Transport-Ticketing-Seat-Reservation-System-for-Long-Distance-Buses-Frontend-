// login.js

document.addEventListener("DOMContentLoaded", () => {
    const ORIGIN = window.location.origin;
    console.log("Current Origin:", ORIGIN);

    // -----------------------------
    // Word spin animation
    // -----------------------------
    const words = ["COLOMBO", "ANURADHAPURA", "TRINKOMALIEE", "GALLE"];
    let index = 0;
    const animatedSpan = document.getElementById("animatedWords");

    function changeWord() {
        if (!animatedSpan) return;
        animatedSpan.innerHTML = "";
        const wordSpan = document.createElement("span");
        wordSpan.classList.add("word-spin");
        wordSpan.textContent = words[index];
        animatedSpan.appendChild(wordSpan);
        index = (index + 1) % words.length;
    }
    changeWord();
    setInterval(changeWord, 2000);

    // -----------------------------
    // Toggle password visibility
    // -----------------------------
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePasswordBtn.querySelector("i")?.classList.toggle("fa-eye-slash");
        });
    }

    // -----------------------------
    // Login form submission
    // -----------------------------
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) {
        console.error("loginForm element not found!");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email")?.value.trim();
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        const payload = { email, password };
        console.log("Sending login payload:", payload);

        try {
            const res = await fetch("http://localhost:8080/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            console.log("Response JSON:", data);

            if (!res.ok) {
                alert(data.massage || "Login failed");
                return;
            }

            //Extract token from response.data.token
            const token = data?.data?.token;
            const user = data?.data?.user;

            if (!token) {
                console.error("No token returned from server!");
                alert("Login successful but token missing!");
                return;
            }

            // Save token to localStorage
            localStorage.setItem("jwtToken", token);
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            console.log("JWT token saved:", localStorage.getItem("jwtToken"));
            console.log("User saved:", localStorage.getItem("user"));

            alert("Login successful!");
            setTimeout(() => {
                window.location.href = "../html/user-profile.html";
            }, 100);

        } catch (err) {
            console.error("Login error:", err);
            alert("Server error");
        }
    });

    // -----------------------------
    // Protected API requests helper
    // -----------------------------
    async function fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            // Silent redirect to login if token missing
            window.location.href = "login.html";
            return;
        }

        const headers = { ...options.headers, "Authorization": "Bearer " + token };
        const res = await fetch(url, { ...options, headers });

        if (res.status === 401) {
            // Token expired → remove and redirect silently
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("user");
            window.location.href = "login.html";
            return;
        }
        return res;
    }
});


google.accounts.id.initialize({
    client_id: "948863779289-371gubqgtieojjvm7onlqm6qc8gi8i2r.apps.googleusercontent.com", // Replace this!
    callback: handleCredentialResponse,
    ux_mode: "popup" //Important: popup mode
});

// ✅ Render your custom-looking button
google.accounts.id.renderButton(
    document.getElementById("customGoogleBtn"),
    {
        theme: "outline",   // "outline" | "filled_blue" | "filled_black"
        size: "large",      // "small" | "medium" | "large"
        type: "standard",   // "standard" | "icon"
        shape: "pill",      // "rectangular" | "pill" | "circle" | "square"
        logo_alignment: "center"
    }
);
setTimeout(() => {
    const googleBtnText = document
        .querySelector('#customGoogleBtn span');
    if (googleBtnText) {
        googleBtnText.innerText = "Continue with Google";
    }
}, 100);

function handleCredentialResponse(response) {
    const idToken = response.credential;
    console.log("Google ID Token: ", idToken);

    // ✅ Send to backend
    fetch("http://localhost:8080/api/v1/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
    })
        .then(res => res.json())
        .then(data => {
            if (data?.data?.token) {
                localStorage.setItem("jwtToken", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));
                alert("Google login successful!");
                window.location.href = "../html/user-profile.html";
            } else {
                alert(data?.message || "Login failed");
            }
        })
        .catch(err => {
            console.error("Error during Google login:", err);
            alert("Server error");
        });
}


