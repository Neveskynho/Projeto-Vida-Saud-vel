function scrollToPlans() {
    document.getElementById("plans").scrollIntoView({ behavior: "smooth" });
}

function toggleFaq(el) {
    const item = el.parentElement;
    const isActive = item.classList.contains("active");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));
    if (!isActive) item.classList.add("active");
}

function setCurrentDate() {
    const el = document.getElementById("current-date");
    if (!el) return;
    const d = new Date();
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    el.textContent = `${day}/${month}/${d.getFullYear()}`;
}

// ===================== COUNTDOWN =====================

function startPlansCountdown() {
    const end = Date.now() + 7199000; // 2 horas
    const interval = setInterval(() => {
        const diff = end - Date.now();
        if (diff <= 0) {
            clearInterval(interval);
            ["plans-hours","plans-minutes","plans-seconds"].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = "00";
            });
            return;
        }
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        const hEl = document.getElementById("plans-hours");
        const mEl = document.getElementById("plans-minutes");
        const sEl = document.getElementById("plans-seconds");
        if (hEl) hEl.textContent = h.toString().padStart(2, "0");
        if (mEl) mEl.textContent = m.toString().padStart(2, "0");
        if (sEl) sEl.textContent = s.toString().padStart(2, "0");
    }, 1000);
}

// ===================== ANIMATIONS =====================

function animateOnScroll() {
    const cards = document.querySelectorAll(".benefit-card, .bonus-card, .testimonial-card, .plan-card");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(24px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
    });
}

// ===================== POPUP =====================

function showUpgradePopup(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    const popup = document.getElementById("upgrade-popup");
    if (popup) {
        popup.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function hideUpgradePopup() {
    const popup = document.getElementById("upgrade-popup");
    if (popup) {
        popup.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("upgrade-popup");
    if (popup) {
        popup.addEventListener("click", e => {
            if (e.target === popup) hideUpgradePopup();
        });
    }
});

// ===================== NOTIFICATIONS =====================

const notificationMessages = [
    { name: "Carla M.", product: "Plano Premium", location: "São Paulo, SP", time: "há 2 min" },
    { name: "Roberto A.", product: "Plano Premium", location: "Fortaleza, CE", time: "há 4 min" },
    { name: "Patrícia L.", product: "Plano Premium", location: "Belo Horizonte, MG", time: "há 6 min" },
    { name: "Fernanda S.", product: "Plano Premium", location: "Porto Alegre, RS", time: "há 9 min" },
    { name: "Diego C.", product: "Plano Básico", location: "Curitiba, PR", time: "há 11 min" },
    { name: "Mariana B.", product: "Plano Premium", location: "Recife, PE", time: "há 14 min" },
];

let notifIndex = 0;

function createNotification(data) {
    const container = document.getElementById("notification-container");
    if (!container) return;

    const el = document.createElement("div");
    el.className = "notification";
    el.innerHTML = `
        <div class="notification-icon">✓</div>
        <div class="notification-content">
            <div class="notification-name">${data.name}</div>
            <div class="notification-product">Comprou: ${data.product}</div>
            <div class="notification-location">${data.location} · ${data.time}</div>
        </div>
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 5000);
}

function startNotifications() {
    const show = () => {
        createNotification(notificationMessages[notifIndex]);
        notifIndex = (notifIndex + 1) % notificationMessages.length;
        setTimeout(show, 8000 + Math.random() * 4000);
    };
    setTimeout(show, 2500);
}

// ===================== UTM PROPAGATION =====================

(function () {
    const params = window.location.search;
    if (!params) return;
    document.querySelectorAll('a[href*="pay.cakto.com.br"]').forEach(link => {
        try {
            const url = new URL(link.href);
            const existing = new URLSearchParams(url.search);
            const incoming = new URLSearchParams(params);
            incoming.forEach((val, key) => {
                if (!existing.has(key)) existing.set(key, val);
            });
            url.search = existing.toString();
            link.href = url.toString();
        } catch (err) {
            console.error("Erro ao propagar UTM:", err);
        }
    });
})();

// ===================== RIPPLE EFFECT =====================

function addRippleAnimation() {
    const style = document.createElement("style");
    style.textContent = `@keyframes ripple { to { transform: scale(4); opacity: 0 } }`;
    document.head.appendChild(style);
}

function addPlanButtonEffects() {
    document.querySelectorAll(".plan-button").forEach(btn => {
        btn.addEventListener("click", function (e) {
            if (this.classList.contains("basic-button")) e.preventDefault();

            const ripple = document.createElement("span");
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                width: ${size}px; height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                position: absolute; border-radius: 50%;
                background: rgba(255,255,255,0.4);
                transform: scale(0); animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            this.style.position = "relative";
            this.style.overflow = "hidden";
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);

            if (this.classList.contains("basic-button")) {
                setTimeout(showUpgradePopup, 350);
            }
        });
    });
}

// ===================== SCROLL TRACKING =====================

function trackScroll() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90];
    window.addEventListener("scroll", () => {
        const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (pct > maxScroll) {
            maxScroll = pct;
            milestones.forEach(m => {
                if (pct >= m && !sessionStorage.getItem(`scroll_${m}`)) {
                    sessionStorage.setItem(`scroll_${m}`, "1");
                    console.log(`Usuário scrollou ${m}% da página`);
                }
            });
        }
    });
}

// ===================== INIT =====================

function init() {
    setCurrentDate();
    startPlansCountdown();
    animateOnScroll();
    addRippleAnimation();
    addPlanButtonEffects();
    startNotifications();
    trackScroll();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
