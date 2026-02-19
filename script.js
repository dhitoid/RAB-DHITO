/* ======================================================
   RAB PRO ENTERPRISE SYSTEM
====================================================== */


/* ================= GLOBAL STATE ================= */

let projects = JSON.parse(localStorage.getItem("rab_pro_data") || "{}");
let currentProject = localStorage.getItem("rab_pro_current") || null;
let activeTab = null;
let chartInstance = null;

let previousTotals = {
    subtotal: 0,
    diskon: 0,
    ppn: 0,
    grand: 0,
    profit: 0
};

let templateExpanded = false;


/* ================= SAVE SYSTEM ================= */

function save() {
    localStorage.setItem("rab_pro_data", JSON.stringify(projects));
    localStorage.setItem("rab_pro_current", currentProject || "");
}


/* ================= FORMAT HELPERS ================= */

function formatRp(val) {
    return new Intl.NumberFormat("id-ID").format(val);
}

function parseNumber(val) {
    return Number(val.replace(/\D/g, "")) || 0;
}


/* ================= TEMPLATE TOGGLE ================= */

function toggleTemplate() {
    const grid = document.getElementById("templateGrid");
    const toggle = document.querySelector(".template-toggle");

    templateExpanded = !templateExpanded;

    if (templateExpanded) {
        grid.classList.remove("collapsed");
        toggle.innerText = "Lihat Lebih Sedikit";
    } else {
        grid.classList.add("collapsed");
        toggle.innerText = "Lihat Lebih Banyak";
    }
}


/* ================= ENTERPRISE STRUCTURE ================= */

const enterpriseStructures = {
    bengkel: {
        Peralatan: [
            { nama: "Lift Motor", percent: 0.2 },
            { nama: "Toolkit Lengkap", percent: 0.1 },
            { nama: "Compressor", percent: 0.08 }
        ],
        Renovasi: [
            { nama: "Renovasi Tempat", percent: 0.25 }
        ],
        Operasional: [
            { nama: "Sparepart Awal", percent: 0.2 },
            { nama: "Biaya 3 Bulan", percent: 0.12 }
        ],
        Cadangan: [
            { nama: "Risk Buffer", percent: 0.05 }
        ]
    },

    coffee: {
        Peralatan: [
            { nama: "Mesin Espresso", percent: 0.25 },
            { nama: "Grinder", percent: 0.08 }
        ],
        Interior: [
            { nama: "Meja & Kursi", percent: 0.2 },
            { nama: "Dekorasi", percent: 0.07 }
        ],
        Operasional: [
            { nama: "Bahan Baku Awal", percent: 0.2 },
            { nama: "Gaji 2 Bulan", percent: 0.15 }
        ],
        Cadangan: [
            { nama: "Risk Buffer", percent: 0.05 }
        ]
    }
};


/* ================= AI TEMPLATE ================= */
/* (SEMUA TEMPLATE KAMU TETAP SAMA - TIDAK DIUBAH) */

const aiTemplates = /* --- PASTE PERSIS BLOK aiTemplates LAMA KAMU DI SINI TANPA PERUBAHAN --- */;


/* ================= AI SYSTEM ================= */

function extractBudget(text) {
    const match = text.match(/(\d+)\s*(jt|juta|m)/i);
    if (!match) return null;
    return parseInt(match[1]) * 1000000;
}

function detectProjectType(text) {
    text = text.toLowerCase();

    if (text.includes("bengkel")) return "bengkel";
    if (text.includes("coffee") || text.includes("cafe")) return "coffee";
    if (text.includes("renovasi")) return "renovasi";
    if (text.includes("rumah")) return "renovasi";

    return "coffee";
}

function distributeBudget(budget, structure) {
    let result = {};

    Object.keys(structure).forEach(cat => {
        result[cat] = structure[cat].map(item => ({
            nama: item.nama,
            volume: 1,
            harga: Math.round(budget * item.percent)
        }));
    });

    return result;
}

function calculateSuggestedMargin(type) {
    if (type === "coffee") return 35;
    if (type === "bengkel") return 30;
    if (type === "renovasi") return 25;
    return 20;
}

function calculateBEP(budget) {
    const monthlyProfitEstimate = budget * 0.08;
    const bepMonths = Math.ceil(budget / monthlyProfitEstimate);
    console.log("Estimasi BEP:", bepMonths, "bulan");
}

function calculateAIScore(project) {

    let score = 100;
    let total = 0;
    let categoryTotals = [];

    Object.values(project.kategori).forEach(items => {
        let catTotal = 0;
        items.forEach(i => {
            catTotal += i.volume * i.harga;
        });
        categoryTotals.push(catTotal);
        total += catTotal;
    });

    if (!project.kategori["Cadangan"]) score -= 15;
    if (project.margin < 20) score -= 10;

    const maxCat = Math.max(...categoryTotals);
    if (maxCat / total > 0.6) score -= 15;

    if (total < 20000000) score -= 10;

    return Math.max(score, 0);
}

function calculateRiskLevel(score) {
    if (score >= 80) return "Rendah";
    if (score >= 60) return "Sedang";
    return "Tinggi";
}

function showAIInsight(project) {

    const score = calculateAIScore(project);
    const risk = calculateRiskLevel(score);

    document.getElementById("aiInsight").innerHTML = `
        <strong>AI Feasibility Score:</strong> ${score}/100 <br>
        <strong>Risk Level:</strong> ${risk}
    `;
}


/* ================= PROJECT MANAGEMENT ================= */
/* Semua function createProject, deleteProject, renameProject,
   selectProject, renderProjects, addKategori, deleteKategori,
   addItem, removeItem, updateItem, updateHarga, updateVolume,
   updateHargaRealtime, updateSubtotalCell
   --> COPY PERSIS DARI KODE LAMA KAMU TANPA DIHAPUS
*/


/* ================= SUMMARY ================= */

function updateSummary() {

    if (!currentProject) return;

    let p = projects[currentProject];

    p.diskon = Number(diskon.value) || 0;
    p.margin = Number(margin.value) || 0;
    p.ppn = Number(ppn.value) || 0;

    let subtotal = 0;
    Object.values(p.kategori).forEach(arr => {
        arr.forEach(it => subtotal += it.volume * it.harga);
    });

    let disk = subtotal * (p.diskon / 100);
    let afterDisk = subtotal - disk;
    let ppnVal = afterDisk * (p.ppn / 100);
    let grand = afterDisk + ppnVal;
    let profit = grand * (p.margin / 100);

    summary.innerHTML = `
        <div class="summary-box">
            <small>Subtotal</small>
            <strong id="sum-subtotal">Rp 0</strong>
        </div>
        <div class="summary-box">
            <small>Diskon</small>
            <strong id="sum-diskon">Rp 0</strong>
        </div>
        <div class="summary-box">
            <small>PPN</small>
            <strong id="sum-ppn">Rp 0</strong>
        </div>
        <div class="summary-box total">
            <small>Grand Total</small>
            <strong id="sum-grand">Rp 0</strong>
        </div>
        <div class="summary-box">
            <small>Estimasi Profit</small>
            <strong id="sum-profit" style="color:#22c55e">Rp 0</strong>
        </div>
    `;

    smartAnimate(document.getElementById("sum-subtotal"), "subtotal", subtotal);
    smartAnimate(document.getElementById("sum-diskon"), "diskon", disk);
    smartAnimate(document.getElementById("sum-ppn"), "ppn", ppnVal);
    smartAnimate(document.getElementById("sum-grand"), "grand", grand, 700);
    smartAnimate(document.getElementById("sum-profit"), "profit", profit, 700);

    renderChart(subtotal, profit);
    save();
}


/* ================= CHART ================= */

function renderChart(total, profit) {

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(document.getElementById("chart"), {
        type: "doughnut",
        data: {
            labels: ["Biaya", "Profit"],
            datasets: [{ data: [total, profit] }]
        },
        options: { responsive: true }
    });
}


/* ================= EXPORT ================= */

function exportExcel() {

    let wb = XLSX.utils.book_new();
    let rows = [["Kategori", "Nama", "Volume", "Harga", "Subtotal"]];
    let p = projects[currentProject];

    Object.keys(p.kategori).forEach(k => {
        p.kategori[k].forEach(it => {
            rows.push([k, it.nama, it.volume, it.harga, it.volume * it.harga]);
        });
    });

    let ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, "RAB");
    XLSX.writeFile(wb, currentProject + "_RAB.xlsx");
}


/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {

    if (!currentProject && Object.keys(projects).length > 0) {
        currentProject = Object.keys(projects)[0];
    }

    renderProjects();
    render();
});
