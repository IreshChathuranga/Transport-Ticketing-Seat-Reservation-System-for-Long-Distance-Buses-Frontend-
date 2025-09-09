document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".quick-search-section form");
    const tableBody = document.getElementById("busScheduleTable");
    const fromSelect = document.getElementById("fromStop");
    const toSelect = document.getElementById("toStop");

    // 1️⃣ Load stops dynamically
    async function loadStops() {
        try {
            const res = await fetch("http://localhost:8080/api/v1/stop/get");
            const result = await res.json();

            if (!res.ok || !result.data || result.data.length === 0) {
                fromSelect.innerHTML = `<option>No stops found</option>`;
                toSelect.innerHTML = `<option>No stops found</option>`;
                return;
            }

            fromSelect.innerHTML = "";
            toSelect.innerHTML = "";

            result.data.forEach(stop => {
                const option = document.createElement("option");
                option.value = stop.name;
                option.textContent = stop.name;

                fromSelect.appendChild(option.cloneNode(true));
                toSelect.appendChild(option);
            });

        } catch (err) {
            console.error("Error loading stops:", err);
            fromSelect.innerHTML = `<option>Error loading stops</option>`;
            toSelect.innerHTML = `<option>Error loading stops</option>`;
        }
    }
    loadStops(); // call once on page load

    // 2️⃣ Handle form submit for search
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const from = fromSelect.value;
        const to = toSelect.value;
        const date = form.querySelector("input[type='date']").value;

        tableBody.innerHTML = '<tr><td colspan="8">Loading...</td></tr>';

        try {
            const res = await fetch(`http://localhost:8080/api/v1/schedule/search?from=${from}&to=${to}&date=${date}`);
            const data = await res.json();

            if (res.ok && data.data.length) {
                tableBody.innerHTML = "";
                data.data.forEach(schedule => {
                    const row = `<tr>
                        <td>${schedule.busId}</td>
                        <td>${from} ➜ ${to}</td>
                        <td>${schedule.departTime}</td>
                        <td>--:--</td>
                        <td>--h --m</td>
                        <td>-- LKR</td>
                        <td>--</td>
                        <td><button class="btn btn-sm btn-primary">Book</button></td>
                    </tr>`;
                    tableBody.innerHTML += row;
                });
            } else {
                tableBody.innerHTML = '<tr><td colspan="8">No buses found.</td></tr>';
            }
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = '<tr><td colspan="8">Error fetching data</td></tr>';
        }
    });
});
