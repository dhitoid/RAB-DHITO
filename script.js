/* ======================================================
   RAB PRO ENTERPRISE SYSTEM
====================================================== */
/* ================= APP META ================= */
const APP_NAME = "RAB PRO"
const APP_EDITION = "Enterprise Edition"
const APP_VERSION = "v2.0.0"
const APP_BRAND = "DTSCRIPTID"

/* ================= DATA ================= */

let projects = JSON.parse(localStorage.getItem("rab_pro_data") || "{}")
let currentProject = localStorage.getItem("rab_pro_current") || null
let activeTab = null
let chartInstance = null
let projectCollapsed = true

let previousTotals = {
subtotal:0,
diskon:0,
ppn:0,
grand:0,
profit:0
}

let templateExpanded = false

/* ================= SAVE ================= */

function save(){
localStorage.setItem("rab_pro_data",JSON.stringify(projects))
localStorage.setItem("rab_pro_current",currentProject||"")
}

/* ================= TEMPLATE TOGGLE ================= */

function toggleTemplate(){
const grid = document.getElementById("templateGrid")
const toggle = document.querySelector(".template-toggle")

templateExpanded = !templateExpanded

if(templateExpanded){
grid.classList.remove("collapsed")
toggle.innerText = "Lihat Lebih Sedikit"
}else{
grid.classList.add("collapsed")
toggle.innerText = "Lihat Lebih Banyak"
}
}

/* ================= TEMPLATE CLICK HANDLER ================= */

document.addEventListener("DOMContentLoaded", () => {

document.querySelectorAll(".template-card").forEach(card => {
card.addEventListener("click", () => {

const name = card.innerText.trim()

if(projects[name]){
if(!confirm("Project sudah ada. Replace?")) return
}

generateAITemplate(name)

})
})

})

/* ================= PROFIT RATE BY BUSINESS ================= */

const businessProfitRates = {
coffee: 0.12,     // 12% per bulan
bengkel: 0.10,    // 10%
laundry: 0.15,    // 15%
fashion: 0.18,    // 18%
startup: 0.20,    // 20%
renovasi: 0.08,   // 8%
event: 0.12,      // 12%
default: 0.08     // fallback
}

/* ================= IDEAL MARGIN RANGE ================= */

const marginGuidelines = {
coffee: {min:20, max:40},
bengkel: {min:15, max:35},
laundry: {min:25, max:50},
fashion: {min:30, max:60},
startup: {min:40, max:80},
renovasi: {min:10, max:25},
event: {min:20, max:45},
default: {min:15, max:40}
}

/* ================= ENTERPRISE STRUCTURE ================= */
const enterpriseStructures = {

bengkel:{
Peralatan:[
{nama:"Lift Motor",percent:0.18},
{nama:"Toolkit Lengkap",percent:0.10},
{nama:"Compressor",percent:0.07}
],
Renovasi:[
{nama:"Renovasi Tempat",percent:0.20}
],
Operasional:[
{nama:"Sparepart Awal",percent:0.18},
{nama:"Gaji 2 Bulan",percent:0.12}
],
Marketing:[
{nama:"Spanduk & Promosi",percent:0.05}
],
Cadangan:[
{nama:"Risk Buffer",percent:0.10}
]
},

coffee:{
Peralatan:[
{nama:"Mesin Espresso",percent:0.22},
{nama:"Grinder",percent:0.08}
],
Interior:[
{nama:"Renovasi & Furniture",percent:0.22}
],
Operasional:[
{nama:"Bahan Baku Awal",percent:0.15},
{nama:"Gaji 2 Bulan",percent:0.12}
],
Marketing:[
{nama:"Grand Opening & Ads",percent:0.08}
],
Cadangan:[
{nama:"Risk Buffer",percent:0.13}
]
},

laundry:{
Mesin:[
{nama:"Mesin Cuci & Dryer",percent:0.35}
],
Renovasi:[
{nama:"Renovasi Tempat",percent:0.20}
],
Operasional:[
{nama:"Gaji 2 Bulan",percent:0.15},
{nama:"Deterjen & Perlengkapan",percent:0.08}
],
Marketing:[
{nama:"Spanduk & Brosur",percent:0.05}
],
Cadangan:[
{nama:"Risk Buffer",percent:0.17}
]
},

property:{
Material:[
{nama:"Material Bangunan",percent:0.45}
],
Upah:[
{nama:"Tukang & Mandor",percent:0.25}
],
Perizinan:[
{nama:"IMB & Legal",percent:0.05}
],
Operasional:[
{nama:"Biaya Lapangan",percent:0.05}
],
Cadangan:[
{nama:"Overrun Buffer",percent:0.20}
]
},

startup:{
Development:[
{nama:"Developer & Designer",percent:0.35}
],
Infrastructure:[
{nama:"Server & Tools",percent:0.10}
],
Marketing:[
{nama:"Digital Ads",percent:0.20}
],
Legal:[
{nama:"Legalitas & Notaris",percent:0.05}
],
Operasional:[
{nama:"Gaji Tim 3 Bulan",percent:0.10}
],
Cadangan:[
{nama:"Runway Buffer",percent:0.20}
]
}

}

/* ================= TEMPLATE RAB ================= */
const aiTemplates = {

/* ================= LIBURAN ================= */

"Liburan Keluarga": {
kategori:{
Transportasi:[
{nama:"Tiket Pesawat PP (4 Orang)",volume:4,harga:1500000},
{nama:"Bagasi Tambahan",volume:4,harga:250000},
{nama:"Transport Lokal (5 Hari)",volume:5,harga:300000}
],
Akomodasi:[
{nama:"Hotel 3 Malam",volume:3,harga:750000},
{nama:"Early Check-in / Late Check-out",volume:1,harga:500000}
],
Konsumsi:[
{nama:"Makan Harian (4 Org x 4 Hari)",volume:4,harga:250000},
{nama:"Cafe & Jajan",volume:4,harga:150000}
],
Aktivitas:[
{nama:"Tiket Wisata",volume:4,harga:300000},
{nama:"Souvenir",volume:1,harga:1500000}
],
Cadangan:[
{nama:"Emergency Fund",volume:1,harga:2000000}
]
}
},

/* ================= RENOVASI ================= */

"Renovasi Rumah": {
kategori:{
Material:[
{nama:"Semen",volume:50,harga:65000},
{nama:"Pasir",volume:5,harga:250000},
{nama:"Cat Tembok Premium",volume:10,harga:180000},
{nama:"Keramik",volume:40,harga:85000}
],
Upah:[
{nama:"Tukang",volume:20,harga:150000},
{nama:"Mandor",volume:10,harga:200000}
],
Peralatan:[
{nama:"Sewa Alat",volume:1,harga:2000000}
],
Cadangan:[
{nama:"Overbudget Material",volume:1,harga:3000000}
]
}
},

/* ================= COFFEE SHOP ================= */

"Buka Coffee Shop": {
kategori:{
Peralatan:[
{nama:"Mesin Espresso 2 Group",volume:1,harga:15000000},
{nama:"Grinder Profesional",volume:1,harga:5000000},
{nama:"Freezer & Chiller",volume:1,harga:7000000},
{nama:"POS System",volume:1,harga:4000000}
],
Interior:[
{nama:"Meja & Kursi",volume:10,harga:750000},
{nama:"Renovasi Interior",volume:1,harga:20000000},
{nama:"Neon Sign & Branding",volume:1,harga:5000000}
],
Operasional:[
{nama:"Bahan Baku Awal",volume:1,harga:5000000},
{nama:"Gaji Barista 2 Bulan",volume:2,harga:3500000},
{nama:"Sewa Tempat 2 Bulan",volume:2,harga:7000000}
],
Marketing:[
{nama:"Soft Opening Event",volume:1,harga:3000000},
{nama:"Ads Instagram 1 Bulan",volume:1,harga:5000000}
],
Cadangan:[
{nama:"Risk Buffer",volume:1,harga:7000000}
]
}
},

/* ================= EVENT ================= */

"Event Seminar": {
kategori:{
Venue:[
{nama:"Sewa Gedung 1 Hari",volume:1,harga:8000000},
{nama:"Sound System",volume:1,harga:3000000}
],
Konsumsi:[
{nama:"Snack 100 Peserta",volume:100,harga:35000},
{nama:"Air Mineral",volume:100,harga:5000}
],
Marketing:[
{nama:"Iklan Sosial Media",volume:1,harga:2000000},
{nama:"Desain Poster",volume:1,harga:1000000}
],
Operasional:[
{nama:"MC & Moderator",volume:1,harga:2500000},
{nama:"Dokumentasi",volume:1,harga:2000000}
],
Cadangan:[
{nama:"Biaya Tak Terduga",volume:1,harga:3000000}
]
}
},

/* ================= PERNIKAHAN ================= */

"Pernikahan Sederhana": {
kategori:{
Venue:[
{nama:"Gedung",volume:1,harga:15000000}
],
Katering:[
{nama:"Paket 300 Tamu",volume:300,harga:50000}
],
Dokumentasi:[
{nama:"Foto & Video",volume:1,harga:5000000}
],
Dekorasi:[
{nama:"Dekor Pelaminan",volume:1,harga:8000000}
],
Hiburan:[
{nama:"Band / Organ Tunggal",volume:1,harga:5000000}
],
Cadangan:[
{nama:"Biaya Tambahan",volume:1,harga:5000000}
]
}
},

/* ================= KONTRAKAN ================= */

"Kontrakan 5 Pintu": {
kategori:{
Material:[
{nama:"Bata Ringan",volume:1000,harga:1200},
{nama:"Semen",volume:200,harga:65000},
{nama:"Besi",volume:100,harga:90000}
],
Upah:[
{nama:"Tukang",volume:60,harga:150000},
{nama:"Mandor",volume:30,harga:200000}
],
Perizinan:[
{nama:"IMB & Administrasi",volume:1,harga:5000000}
],
Cadangan:[
{nama:"Biaya Overrun",volume:1,harga:10000000}
]
}
},

/* ================= LAUNDRY ================= */

"Bisnis Laundry": {
kategori:{
Mesin:[
{nama:"Mesin Cuci",volume:2,harga:4500000},
{nama:"Mesin Pengering",volume:2,harga:4000000}
],
Interior:[
{nama:"Renovasi Tempat",volume:1,harga:8000000}
],
Operasional:[
{nama:"Deterjen Awal",volume:1,harga:1000000},
{nama:"Gaji Karyawan 2 Bulan",volume:2,harga:2500000}
],
Marketing:[
{nama:"Spanduk & Brosur",volume:1,harga:1500000}
],
Cadangan:[
{nama:"Dana Darurat",volume:1,harga:3000000}
]
}
},

/* ================= FASHION ================= */

"UMKM Fashion": {
kategori:{
Produksi:[
{nama:"Bahan Kain",volume:100,harga:45000},
{nama:"Jahit Produksi",volume:100,harga:25000}
],
Branding:[
{nama:"Logo & Packaging",volume:1,harga:3000000}
],
Marketing:[
{nama:"Iklan Instagram",volume:1,harga:3000000},
{nama:"Influencer Endorse",volume:1,harga:5000000}
],
Cadangan:[
{nama:"Return & Reject Buffer",volume:1,harga:2000000}
]
}
},

/* ================= UMROH ================= */

"Travel Umroh": {
kategori:{
Paket:[
{nama:"Paket Umroh 1 Orang",volume:1,harga:30000000}
],
Administrasi:[
{nama:"Visa & Handling",volume:1,harga:5000000}
],
Perlengkapan:[
{nama:"Perlengkapan Umroh",volume:1,harga:2000000}
],
Cadangan:[
{nama:"Biaya Tambahan",volume:1,harga:3000000}
]
}
},

/* ================= RUMAH 36 ================= */

"Bangun Rumah 36": {
kategori:{
Material:[
{nama:"Semen",volume:100,harga:65000},
{nama:"Bata Ringan",volume:2000,harga:1200},
{nama:"Besi Beton",volume:200,harga:90000}
],
Upah:[
{nama:"Mandor",volume:30,harga:200000},
{nama:"Tukang",volume:60,harga:150000}
],
Instalasi:[
{nama:"Listrik & Plumbing",volume:1,harga:15000000}
],
Cadangan:[
{nama:"Biaya Overrun",volume:1,harga:10000000}
]
}
},

/* ================= STARTUP ================= */

"Startup Digital": {
kategori:{
Development:[
{nama:"Developer 3 Bulan",volume:3,harga:8000000},
{nama:"UI/UX Designer",volume:2,harga:7000000}
],
Infrastructure:[
{nama:"Server & Hosting 1 Tahun",volume:1,harga:12000000}
],
Marketing:[
{nama:"Ads Budget",volume:1,harga:10000000},
{nama:"Influencer Tech Review",volume:1,harga:8000000}
],
Legal:[
{nama:"Legalitas PT",volume:1,harga:15000000}
],
Cadangan:[
{nama:"Runway Buffer",volume:1,harga:20000000}
]
}
}

}

const templateNameMap = {
"Coffee":"Buka Coffee Shop",
"Wedding":"Pernikahan Sederhana",
"Laundry":"Bisnis Laundry",
"Rumah 36":"Bangun Rumah 36",
"Liburan":"Liburan Keluarga",
"Renovasi":"Renovasi Rumah",
"Event":"Event Seminar",
"Kontrakan":"Kontrakan 5 Pintu",
"Fashion":"UMKM Fashion",
"Umroh":"Travel Umroh",
"Startup":"Startup Digital",
}

/* ================= TEMPLATE GENERATOR ================= */

function generateAITemplate(name){

const realName = templateNameMap[name] || name

if(!aiTemplates[realName]) {
alert("Template tidak ditemukan")
return
}

const uniqueName = realName + " - " + Date.now()

projects[uniqueName] = {
type: detectProjectType(realName.toLowerCase()), // tambahkan ini
diskon:0,
margin:25,
ppn:11,
kategori:JSON.parse(JSON.stringify(aiTemplates[realName].kategori))
}

currentProject = uniqueName
activeTab = null

save()
renderProjects()
render()
}

/* ================= AI TEXT PARSER ================= */

function extractBudget(text){

text = text.toLowerCase().replace(/\./g,"")

let match = text.match(/(\d+(\.\d+)?)\s*(jt|juta)/)
if(match){
return parseFloat(match[1]) * 1000000
}

let matchM = text.match(/(\d+(\.\d+)?)\s*(m|milyar)/)
if(matchM){
return parseFloat(matchM[1]) * 1000000000
}

let numeric = text.match(/\d{7,}/)
if(numeric){
return parseInt(numeric[0])
}

return null
}

function detectProjectType(text){

text = text.toLowerCase()

const keywords = {

bengkel:[
"bengkel","motor","mobil","service",
"oli","sparepart","tune up","ganti ban"
],

coffee:[
"coffee","cafe","kopi","espresso",
"barista","kedai kopi","ngopi"
],

laundry:[
"laundry","cuci","dry clean",
"setrika","laundry kiloan"
],

property:[
"renovasi","bangun rumah","rumah 36",
"kontrakan","kost","ruko","proyek"
],

startup:[
"startup","app","aplikasi","digital",
"software","saas","platform","website"
]

}

for(let type in keywords){
if(keywords[type].some(word => text.includes(word))){
return type
}
}

return "coffee"
}

function detectScale(budget){

if(budget < 50000000) return "kecil"
if(budget < 250000000) return "menengah"
return "besar"
}

/* ================= DISTRIBUTE ================= */

function distributeBudget(budget, structure){

let result = {}
let scale = detectScale(budget)

Object.keys(structure).forEach(cat=>{

result[cat] = structure[cat].map(item=>{

let multiplier = 1

if(scale==="besar") multiplier = 1.2
if(scale==="kecil") multiplier = 0.9

return {
nama:item.nama,
volume:1,
harga:Math.round(budget * item.percent * multiplier)
}

})

})

return result
}

/* ================= Generate Universal ================= */

function generateUniversalInsight(project){

if(!project) return ""

const total = Object.values(project.kategori)
.flat()
.reduce((sum,i)=>sum + i.volume*i.harga,0)

let type = project.type
if(!type){
type = detectProjectType(currentProject.toLowerCase())
}

const score = calculateUniversalAIScore(project)
const risk = calculateRiskLevel(score)
const color = getInsightColor(score)

let roiSection = ""

if(["coffee","bengkel","startup","laundry","property"].includes(type)){

const roiData = calculateROI(total, project.margin)
const bepMonths = calculateBEP(total, project.margin)

roiSection = `
<hr style="margin:10px 0;border:0;border-top:1px solid #1f2937">
ROI Tahunan: <b>${roiData.roiYearly.toFixed(1)}%</b><br>
Estimasi BEP: ± <b>${bepMonths} bulan</b><br>
Profit Bulanan: Rp ${formatRp(roiData.monthlyProfit)}
`
}

const marginCheck = analyzeMargin(type, project.margin)

let warning = ""
if(project.margin > 50){
warning = `<div style="color:#f87171;margin-top:6px">
⚠ Margin sangat tinggi, pastikan realistis.
</div>`
}

return `
<div style="padding:14px;border-radius:14px;
background:#0f172a;
border:1px solid #1f2937">

<div style="font-weight:600;
color:${color};
font-size:16px">
AI Financial Score: ${score}/100
</div>

<div style="font-size:13px;color:#94a3b8">
Risk Level: ${risk}
</div>

<div style="margin-top:10px;font-size:14px">
Total Budget: Rp ${formatRp(total)}<br>
Margin: ${project.margin}%
</div>

${roiSection}

<div style="margin-top:8px;font-size:13px;color:#94a3b8">
${marginCheck.message}
</div>

${warning}

</div>
`
}

/* ================= AI GENERATOR ================= */

function generateFromText(){

const text = aiPrompt.value.trim()
if(!text) return

const budget = extractBudget(text) || 100000000
const type = detectProjectType(text)

aiStatus.innerText = "AI Enterprise sedang menganalisa..."

setTimeout(()=>{

const structure =
enterpriseStructures[type] || enterpriseStructures["coffee"]

const kategori = distributeBudget(budget, structure)

const scale = detectScale(budget)

const name =
"AI - " + type.toUpperCase() +
" - " + scale.toUpperCase() +
" - " + Date.now()

projects[name] = {
type:type,
diskon:0,
margin:calculateSuggestedMargin(type, scale),
ppn:11,
kategori:kategori
}

currentProject = name
activeTab = null

previousTotals = {
subtotal:0,
diskon:0,
ppn:0,
grand:0,
profit:0
}

save()
render()
renderProjects()

calculateBEP(projects[name])

aiStatus.innerText = "RAB Enterprise berhasil dibuat."

},600)
}

/* ================= MARGIN ================= */

function calculateSuggestedMargin(type, scale){

let base = 25

if(type==="startup") base = 40
if(type==="coffee") base = 35
if(type==="bengkel") base = 30
if(type==="property") base = 25

if(scale==="besar") base += 5
if(scale==="kecil") base -= 5

return base
}

/* ================= BEP ================= */

function calculateBEP(totalModal, margin){
const turnoverRate = 0.4
const revenue = totalModal * turnoverRate
const monthlyProfit = revenue * (margin/100)
if(monthlyProfit <= 0) return 0
return Math.ceil(totalModal / monthlyProfit)
}

/* ================= Analis Margin ================= */

function analyzeMargin(type, margin){

const guide = marginGuidelines[type] || marginGuidelines.default

if(margin < guide.min){
return {
status:"low",
message:`Margin ${margin}% tergolong rendah untuk bisnis ini. Potensi ROI kecil dan BEP lebih lama.`
}
}

if(margin > guide.max){
return {
status:"high",
message:`Margin ${margin}% tergolong tinggi dan berisiko tidak kompetitif di pasar. Perlu validasi harga jual.`
}
}

return {
status:"normal",
message:`Margin ${margin}% masih dalam batas ideal untuk bisnis ini.`
}
}

/* ================= ROI CALCULATION ================= */

function calculateROI(totalModal, margin){

const turnoverRate = 0.4
const marginRate = margin / 100

const estimatedRevenue = totalModal * turnoverRate
const monthlyProfit = estimatedRevenue * marginRate
const yearlyProfit = monthlyProfit * 12
const roiYearly = (yearlyProfit / totalModal) * 100

return {
monthlyProfit,
yearlyProfit,
roiYearly,
turnoverRate,
profitRate: turnoverRate * marginRate
}
}

/* ================= AI SCORE ================= */

function calculateAIScore(project){

let score = 100
let total = 0
let categoryTotals = []

Object.values(project.kategori).forEach(items=>{
let catTotal = 0
items.forEach(i=>{
catTotal += i.volume * i.harga
})
categoryTotals.push(catTotal)
total += catTotal
})

if(!project.kategori["Cadangan"]) score -= 15
if(project.margin < 20) score -= 10

const maxCat = Math.max(...categoryTotals)
if(maxCat / total > 0.6) score -= 15

if(total < 20000000) score -= 10

return Math.max(score,0)
}

function calculateRiskLevel(score){
if(score >= 80) return "Rendah"
if(score >= 60) return "Sedang"
return "Tinggi"
}

/* ================= UNIVERSAL AI SCORE ================= */

function calculateUniversalAIScore(project){

let total = 0
let categoryTotals = []
let hasCadangan = false

Object.entries(project.kategori).forEach(([key,items])=>{

let catTotal = 0
items.forEach(i=>{
catTotal += i.volume * i.harga
})

if(key.toLowerCase().includes("cadangan")) hasCadangan = true

categoryTotals.push(catTotal)
total += catTotal
})

if(total === 0) return 0

let score = 0

// Diversifikasi kategori
score += categoryTotals.length >= 4 ? 25 : 15

// Dominasi kategori
const maxCat = Math.max(...categoryTotals)
score += (maxCat/total < 0.5) ? 25 : 10

// Margin health
score += project.margin >= 20 ? 20 : 10

// Cadangan
score += hasCadangan ? 20 : 5

// Skala budget sehat
score += total > 20000000 ? 10 : 5

return Math.min(score,100)
}

function getInsightColor(score){
if(score >= 80) return "#22c55e"
if(score >= 60) return "#f59e0b"
return "#ef4444"
}

/* ================= FORMAT ================= */
function formatRp(val){
return new Intl.NumberFormat("id-ID").format(val)
}

function parseNumber(val){
return Number(val.replace(/\D/g,""))||0
}

/* ================= PROJECT ================= */
function createProject(){
let name=newProject.value.trim()
if(!name || projects[name]) return
projects[name]={
kategori:{},
diskon:0,
margin:20,
ppn:0
}
currentProject=name
newProject.value=""
save()
renderProjects()
render()
}

function deleteProject(){

if(!currentProject) return

delete projects[currentProject]

let keys = Object.keys(projects)
currentProject = keys.length ? keys[0] : null

save()
renderProjects()
render()
}

function renameProject(){
let val=projectName.value.trim()
if(!val || val===currentProject) return
if(projects[val]) return alert("Nama sudah ada")
projects[val]=projects[currentProject]
delete projects[currentProject]
currentProject=val
save()
renderProjects()
}

function selectProject(p){
currentProject=p
save()
renderProjects()
render()
}

function toggleProjectCollapse(){
  projectCollapsed = !projectCollapsed
  renderProjects()
}

function renderProjects(){

  projectList.innerHTML = ""

  let keys = Object.keys(projects)

  // SEARCH FILTER
  let search = document.getElementById("projectSearch")?.value?.toLowerCase() || ""
  if(search){
    keys = keys.filter(p => p.toLowerCase().includes(search))
  }

  if(keys.length === 0){
    projectList.innerHTML = `
      <div style="opacity:.6;font-size:13px">
      Tidak ditemukan
      </div>
    `
    document.getElementById("projectToggle").style.display = "none"
    return
  }

  // COLLAPSE LOGIC
  let visibleProjects = keys

  if(projectCollapsed && keys.length > 3){
    visibleProjects = keys.slice(0,3)
    document.getElementById("projectToggle").style.display = "block"
    document.getElementById("projectToggle").innerText = "Lihat Semua"
  } else if(keys.length > 3){
    document.getElementById("projectToggle").style.display = "block"
    document.getElementById("projectToggle").innerText = "Sembunyikan"
  } else {
    document.getElementById("projectToggle").style.display = "none"
  }

  visibleProjects.forEach(p=>{
    let div = document.createElement("div")
    div.className = "project-item " + (p===currentProject?"active":"")
    div.innerText = p
    div.onclick = ()=>selectProject(p)
    projectList.appendChild(div)
  })

}

function smartAnimate(element, key, newValue, duration = 600){

let start = previousTotals[key] || 0
let end = newValue
let startTime = null

function easeOutCubic(t){
return 1 - Math.pow(1 - t, 3)
}

function animation(currentTime){
if(!startTime) startTime = currentTime
let progress = (currentTime - startTime) / duration
progress = Math.min(progress, 1)

let eased = easeOutCubic(progress)
let value = Math.floor(start + (end - start) * eased)

element.innerText = "Rp " + formatRp(value)

if(progress < 1){
requestAnimationFrame(animation)
} else {
previousTotals[key] = newValue
}
}

requestAnimationFrame(animation)

/* Flash effect */
element.classList.remove("flash-up","flash-down")
void element.offsetWidth

if(end > start){
element.classList.add("flash-up")
} else if(end < start){
element.classList.add("flash-down")
}
}

/* ================= KATEGORI ================= */
function addKategori(){
let k=newKategori.value.trim()
if(!k || !currentProject) return
projects[currentProject].kategori[k]=[]
newKategori.value=""
save()
render()
}

function deleteKategori(k){
delete projects[currentProject].kategori[k]
save()
render()
}

/* ================= ITEM ================= */
function addItem(k){
projects[currentProject].kategori[k].push({nama:"Item Baru",volume:1,harga:0})
save()
render()
}

function removeItem(k,i){
projects[currentProject].kategori[k].splice(i,1)
save()
render()
}

function updateItem(k,i,key,val){
if(key==="volume") projects[currentProject].kategori[k][i][key]=Number(val)||0
else projects[currentProject].kategori[k][i][key]=val
updateSummary()
save()
}

function updateHarga(k,i,input){
let number=parseNumber(input.value)
projects[currentProject].kategori[k][i].harga=number
input.value=formatRp(number)
updateSummary()
save()
}

function updateVolume(k,i,input){
let val=Number(input.value)||0
projects[currentProject].kategori[k][i].volume=val
updateSubtotalCell(k,i)
save()
}

function updateHargaRealtime(k,i,input){
let number=parseNumber(input.value)
projects[currentProject].kategori[k][i].harga=number
input.value=formatRp(number)
updateSubtotalCell(k,i)
save()
}

function updateSubtotalCell(k,i){
let item=projects[currentProject].kategori[k][i]
let subtotal=item.volume*item.harga

let cell=document.getElementById(`subtotal-${k}-${i}`)
if(cell){
cell.innerHTML="Rp "+formatRp(subtotal)
}

updateSummary()
}

function renderActiveTab(){
let p = projects[currentProject]
let tabContent = document.getElementById("tabContent")
if(!activeTab || !p.kategori[activeTab]){
tabContent.innerHTML = ""
return
}

let k = activeTab
let html = `
<div class="card">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
<h3 style="font-size:16px">${k}</h3>
<button class="btn-danger" onclick="deleteKategori('${k}')">Hapus</button>
</div>

<div class="table-wrap">
<table>
<tr>
<th>Nama</th>
<th style="width:90px">Volume</th>
<th style="width:140px">Harga</th>
<th style="width:160px">Subtotal</th>
<th style="width:60px"></th>
</tr>
`

p.kategori[k].forEach((it,i)=>{
html+=`
<tr>
<td>
<input value="${it.nama}" 
oninput="updateItem('${k}',${i},'nama',this.value)">
</td>

<td>
<input type="number" value="${it.volume}" 
oninput="updateVolume('${k}',${i},this)">
</td>

<td>
<input value="${formatRp(it.harga)}" 
oninput="updateHargaRealtime('${k}',${i},this)">
</td>

<td id="subtotal-${k}-${i}">
Rp ${formatRp(it.volume*it.harga)}
</td>

<td>
<button class="btn-danger" onclick="removeItem('${k}',${i})">X</button>
</td>
</tr>
`
})

html+=`
</table>
<button class="btn-success" style="margin-top:12px" onclick="addItem('${k}')">+ Item</button>
</div>
</div>
`

tabContent.innerHTML = html
}


/* ================= RENDER ================= */
function render(){

/* RESET UI jika tidak ada project */
if(!currentProject){

kategoriContainer.innerHTML = `
<div style="opacity:.6;padding:20px">
Belum ada project. Buat baru atau pilih template.
</div>
`

summary.innerHTML = ""
if(chartInstance){
chartInstance.destroy()
chartInstance = null
}

return
}

let p = projects[currentProject]

projectName.value = currentProject
diskon.value = p.diskon
margin.value = p.margin
ppn.value = p.ppn

let kategoriKeys = Object.keys(p.kategori)

/* Reset active tab */
if(!kategoriKeys.includes(activeTab)){
activeTab = kategoriKeys[0] || null
}

kategoriContainer.innerHTML = `
<div class="tab-wrapper">
<div class="tab-nav" id="tabNav"></div>
<div class="tab-content" id="tabContent"></div>
</div>
`

let tabNav = document.getElementById("tabNav")

kategoriKeys.forEach(k=>{
let btn = document.createElement("div")
btn.className = "tab-btn " + (k === activeTab ? "active" : "")
btn.innerHTML = `
<span>${k}</span>
<span class="tab-badge">${p.kategori[k].length}</span>
`

btn.onclick = () => {
activeTab = k
document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"))
btn.classList.add("active")
renderActiveTab()
}

tabNav.appendChild(btn)
})

renderActiveTab()
updateSummary()
}

/* ================= SUMMARY ================= */

function updateSummary(){
if(!currentProject) return
let p=projects[currentProject]

p.diskon=Number(diskon.value)||0
p.margin=Number(margin.value)||0
p.ppn=Number(ppn.value)||0

let subtotal=0
Object.values(p.kategori).forEach(arr=>{
arr.forEach(it=>subtotal+=it.volume*it.harga)
})

let disk=subtotal*(p.diskon/100)
let afterDisk=subtotal-disk
let ppnVal=afterDisk*(p.ppn/100)
let grand=afterDisk+ppnVal
let profit=grand*(p.margin/100)

summary.innerHTML=`
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
`

/* Animate values */
smartAnimate(document.getElementById("sum-subtotal"), "subtotal", subtotal)
smartAnimate(document.getElementById("sum-diskon"), "diskon", disk)
smartAnimate(document.getElementById("sum-ppn"), "ppn", ppnVal)
smartAnimate(document.getElementById("sum-grand"), "grand", grand, 700)
smartAnimate(document.getElementById("sum-profit"), "profit", profit, 700)

renderChart(subtotal,profit)
const insightBox = document.getElementById("aiInsight")

if(insightBox){

const content = generateUniversalInsight(projects[currentProject])

// Cancel animation jika belum selesai
clearTimeout(insightBox._fadeTimer)

insightBox.classList.remove("ai-fade-in")
insightBox.classList.add("ai-fade-out")

insightBox._fadeTimer = setTimeout(()=>{

if(!document.body.contains(insightBox)) return

insightBox.innerHTML = content
insightBox.classList.remove("ai-fade-out")
insightBox.classList.add("ai-fade-in")

},150)

}
save()
}

/* ================= CHART ================= */
function renderChart(total, profit){

const canvas = document.getElementById("chart")
if(!canvas) return
if(typeof Chart === "undefined") return

if(chartInstance){
chartInstance.destroy()
chartInstance = null
}

const ctx = canvas.getContext("2d")

/* ===== Gradient Modern ===== */
const gradBiaya = ctx.createLinearGradient(0,0,0,300)
gradBiaya.addColorStop(0,"#6366f1")
gradBiaya.addColorStop(1,"#4f46e5")

const gradProfit = ctx.createLinearGradient(0,0,0,300)
gradProfit.addColorStop(0,"#22c55e")
gradProfit.addColorStop(1,"#16a34a")

/* ===== Center Text Plugin ===== */
const centerTextPlugin = {
id:"centerText",
beforeDraw(chart){
const {width} = chart
const {height} = chart
const ctx = chart.ctx
ctx.restore()

const grand = total + profit
const percent = grand > 0 ? ((profit/grand)*100).toFixed(1) : 0

ctx.font = "600 16px Inter, sans-serif"
ctx.fillStyle = "#111"
ctx.textAlign = "center"
ctx.fillText("TOTAL", width/2, height/2 - 10)

ctx.font = "700 18px Inter, sans-serif"
ctx.fillStyle = "#22c55e"
ctx.fillText(percent + "%", width/2, height/2 + 15)

ctx.save()
}
}

chartInstance = new Chart(ctx,{
type:"doughnut",
data:{
labels:["Biaya","Profit"],
datasets:[{
data:[total,profit],
backgroundColor:[gradBiaya,gradProfit],
borderWidth:0,
hoverOffset:8
}]
},
options:{
responsive:true,
maintainAspectRatio:false,
cutout:"68%",
animation:{
animateRotate:true,
duration:900,
easing:"easeOutQuart"
},
plugins:{
legend:{
position:"bottom",
labels:{
usePointStyle:true,
pointStyle:"circle",
padding:20,
font:{
family:"Inter",
size:12,
weight:"600"
}
}
},
tooltip:{
backgroundColor:"#111827",
titleColor:"#fff",
bodyColor:"#fff",
padding:12,
cornerRadius:10,
displayColors:false,
callbacks:{
label:function(context){
return context.label + ": Rp " + context.raw.toLocaleString("id-ID")
}
}
}
}
},
plugins:[centerTextPlugin]
})

}

/* ================= EXPORT ================= */
function exportExcel(){
let wb=XLSX.utils.book_new()
let rows=[["Kategori","Nama","Volume","Harga","Subtotal"]]
let p=projects[currentProject]

Object.keys(p.kategori).forEach(k=>{
p.kategori[k].forEach(it=>{
rows.push([k,it.nama,it.volume,it.harga,it.volume*it.harga])
})
})

let ws=XLSX.utils.aoa_to_sheet(rows)
XLSX.utils.book_append_sheet(wb,ws,"RAB")
XLSX.writeFile(wb,currentProject+"_RAB.xlsx")
}

/* ================= INIT ================= */
document.addEventListener("DOMContentLoaded", ()=>{

if(!currentProject && Object.keys(projects).length>0){
currentProject = Object.keys(projects)[0]
}

renderProjects()
render()

})