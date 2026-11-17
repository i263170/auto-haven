console.log("Auto Haven | Honda Exclusive Luxury Portal Initialized");

document.addEventListener("DOMContentLoaded", () => {
    let curtain = document.querySelector(".page-transition-curtain");
    if (!curtain) {
        curtain = document.createElement("div");
        curtain.className = "page-transition-curtain";
        document.body.appendChild(curtain);
    }

    const activeUser = localStorage.getItem("autoHaven_hondaUser");
    const loginNavBtn = document.getElementById("navLoginLink");
    if (activeUser && loginNavBtn) {
        const userObj = JSON.parse(activeUser);
        loginNavBtn.textContent = "VIP: " + userObj.name;
    }

    document.querySelectorAll("a[href]").forEach(link => {
        const href = link.getAttribute("href");
        const target = link.getAttribute("target");
        if (href && !href.startsWith("#") && !href.startsWith("http") && target !== "_blank") {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                curtain.classList.add("active");
                setTimeout(() => {
                    window.location.href = href;
                }, 380);
            });
        }
    });
});

function openBuyModal(carName, carPrice) {
    console.log("Honda Buy Now initiated for:", carName, carPrice);
    const modal = document.getElementById("buyModal");
    if (modal) {
        document.getElementById("modalCarName").textContent = carName;
        document.getElementById("modalCarPrice").textContent = carPrice;
        modal.classList.add("open");
    } else {
        window.alert("Auto Haven Honda Reservation: " + carName + " (" + carPrice + "). Proceeding to VIP booking!");
    }
}

function closeBuyModal() {
    const modal = document.getElementById("buyModal");
    if (modal) modal.classList.remove("open");
}

function confirmPurchase(event) {
    event.preventDefault();
    const buyer = document.getElementById("buyerName").value.trim();
    const phone = document.getElementById("buyerPhone").value.trim();
    const car = document.getElementById("modalCarName").textContent;

    if (!buyer || !phone) {
        window.alert("Please enter your full name and phone number to lock in your Honda booking.");
        return;
    }

    const order = {
        buyer,
        phone,
        vehicle: car,
        orderId: "HND-" + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toLocaleString()
    };

    localStorage.setItem("autoHaven_lastHondaOrder", JSON.stringify(order));
    console.log("Honda Order Confirmed:", order);

    closeBuyModal();
    window.alert("Congratulations, " + buyer + "!\nYour Honda booking (" + order.orderId + ") for the " + car + " is confirmed. Our Honda VIP Concierge will contact you shortly.");
    document.getElementById("buyForm").reset();
}

function calculateInstallment() {
    const price = parseFloat(document.getElementById("carSelect").value);
    const downPercent = parseFloat(document.getElementById("downPayment").value);
    const months = parseInt(document.getElementById("tenure").value);

    if (isNaN(downPercent) || downPercent < 0 || downPercent >= 100) {
        window.alert("Please enter a valid down payment percentage between 0 and 99.");
        return;
    }

    const downAmount = price * (downPercent / 100);
    const loanAmount = price - downAmount;
    const annualRate = 0.14;
    const monthlyRate = annualRate / 12;

    const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const formattedEMI = Math.round(emi).toLocaleString();

    console.log("Calculated Honda Monthly EMI: PKR", formattedEMI);
    document.getElementById("emiOutput").innerText = "Estimated Monthly Plan: PKR " + formattedEMI + " / month";
}

function filterVehicles(category, btnElement) {
    console.log("Filtering Honda showroom by:", category);
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");

    document.querySelectorAll(".vehicle-card").forEach(card => {
        if (category === "all" || card.getAttribute("data-category") === category) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }
    });
}

function toggleFaq(btn) {
    const item = btn.parentElement;
    item.classList.toggle("open");
}

function submitInquiry(event) {
    event.preventDefault();
    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("emailAddress").value.trim();
    const model = document.getElementById("preferredModel").value;

    if (!name || !email) {
        window.alert("Please complete all required fields.");
        return;
    }

    const record = { name, email, model, timestamp: new Date().toISOString() };
    localStorage.setItem("autoHaven_hondaBooking", JSON.stringify(record));
    console.log("Honda Concierge Inquiry Saved:", record);

    window.alert("Thank you, " + name + "! Your VIP Honda test-drive & consultation for the " + model + " has been scheduled.");
    document.getElementById("vipForm").reset();
}

function handleAuthSubmit(event) {
    event.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {
        window.alert("Please enter your email and password.");
        return;
    }

    const displayName = name || email.split("@")[0];
    const userSession = {
        name: displayName,
        email: email,
        loggedInAt: new Date().toLocaleString()
    };

    localStorage.setItem("autoHaven_hondaUser", JSON.stringify(userSession));
    console.log("Honda VIP User authenticated:", userSession);

    window.alert("Welcome to Auto Haven | Honda VIP Club, " + displayName + "!");
    window.location.href = "index.html";
}

function logoutUser() {
    localStorage.removeItem("autoHaven_hondaUser");
    window.alert("You have been signed out of the Honda VIP Club.");
    window.location.reload();
}