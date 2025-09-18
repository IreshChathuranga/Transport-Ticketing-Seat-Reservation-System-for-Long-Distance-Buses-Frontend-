// admin-navigation.js

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link[data-section]");
    const sections = document.querySelectorAll(".content-section");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            // Remove 'active' class from all nav links
            navLinks.forEach(link => link.classList.remove("active"));

            // Add 'active' to clicked nav link
            link.classList.add("active");

            const target = link.getAttribute("data-section") + "-section";

            // Hide all sections
            sections.forEach(section => section.classList.add("d-none"));

            // Show target section
            const sectionToShow = document.getElementById(target);
            if (sectionToShow) {
                sectionToShow.classList.remove("d-none");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const dashDate = document.getElementById("dashDate");
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months start at 0
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    dashDate.value = formattedDate;
});