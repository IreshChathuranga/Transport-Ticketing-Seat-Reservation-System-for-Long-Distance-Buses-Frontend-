document.addEventListener("DOMContentLoaded", async () => {
    const seatsContainer = document.querySelector(".seats-container");
    const selectedBus = JSON.parse(localStorage.getItem("selectedBus"));

    if (!selectedBus?.tripId) {
        const infoRow = document.querySelector(".card.mb-4 .card-body .row");
        if (infoRow)
            infoRow.innerHTML = `<p class="text-danger">No bus selected or trip ID missing!</p>`;
        return;
    }

    const token = localStorage.getItem("jwtToken") || "";

    try {
        // 1️⃣ Fetch all seats
        const resSeats = await fetch(`http://localhost:8080/api/v1/tripseat/${selectedBus.tripId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        });

        if (!resSeats.ok) throw new Error(`HTTP error: ${resSeats.status}`);

        const seats = await resSeats.json();
        seatsContainer.innerHTML = "";

        let currentRow = "";
        let rowDiv = null;

        seats.forEach(({ seatNumber, status }) => {
            const row = seatNumber.charAt(0);

            if (row !== currentRow) {
                currentRow = row;
                rowDiv = document.createElement("div");
                rowDiv.className = "seat-row";
                rowDiv.dataset.row = row;
                rowDiv.innerHTML = `<span class="row-label">${row}</span>`;
                seatsContainer.appendChild(rowDiv);
            }

            const seatDiv = document.createElement("div");
            seatDiv.className = `seat ${status.toLowerCase()}`;
            seatDiv.dataset.seat = seatNumber;
            seatDiv.textContent = seatNumber.slice(1);
            rowDiv.appendChild(seatDiv);
        });

        // 2️⃣ Fetch available seats count
        const resAvailable = await fetch(
            `http://localhost:8080/api/v1/tripseat/available/${selectedBus.tripId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        if (!resAvailable.ok) throw new Error(`HTTP error: ${resAvailable.status}`);

        const availableData = await resAvailable.json();
        const availableElem = document.querySelector(".available-seats-count");

        if (availableElem) {
            availableElem.textContent = `Available Seats: ${availableData.availableSeats}`;
        }

    } catch (err) {
        console.error("Seat load failed:", err);
        const infoRow = document.querySelector(".card.mb-4 .card-body .row");
        if (infoRow)
            infoRow.innerHTML = `<p class="text-danger">Failed to load seats!</p>`;
    }
});
