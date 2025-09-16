document.addEventListener("DOMContentLoaded", function () {
    // Read from the fragment (after #)
    const params = new URLSearchParams(window.location.search);
    const bookingRef = params.get("order_id");

    console.log("Booking Ref from URL:", bookingRef); // Debug

    if (!bookingRef) {
        alert("Booking reference not found.");
        return;
    }

    const token = localStorage.getItem("jwtToken") || localStorage.getItem("token");
    if (!token) {
        alert("Please login again to see booking details.");
        return;
    }

    fetch(`http://localhost:8080/api/v1/booking/${bookingRef}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch booking");
            return res.json();
        })
        .then(data => {
            console.log("Booking Data:", data);
            document.getElementById("ref").innerText = bookingRef;
            document.getElementById("status").innerText = data.data?.status || 'N/A';
            // Add more DOM updates if needed
            if (window.history.replaceState) {
                console.log("Cleaning URL now...");
                const cleanUrl = window.location.origin + window.location.pathname;
                window.history.replaceState({}, document.title, cleanUrl);
                console.log("URL cleaned:", cleanUrl);
            } else {
                console.warn("Browser doesn't support history.replaceState");
            }
        })
        .catch(err => {
            console.error(err);
            alert("Error loading booking.");
        });
});
