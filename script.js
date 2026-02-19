/* ======================================================
   RAB PRO ENTERPRISE SYSTEM
====================================================== */
/* ================= DATA ================= */

let projects = JSON.parse(localStorage.getItem("rab_pro_data") || "{}")
let currentProject = localStorage.getItem("rab_pro_current") || null
let activeTab = null
let chartInstance = null

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

/* ================= ENTERPRISE STRUCTURE ================= */
const templateNameMap = {
"Coffee":"Buka Coffee Shop",
"Wedding":"Pernikahan Sederhana",
"Laundry":"Bisnis Laundry",
"Rumah 36":"Bangun Rumah 36"
}

const enterpriseStructures = {

bengkel:{
Peralatan:[
{nama:"Lift Motor",percent:0.2},
{nama:"Toolkit Lengkap",percent:0.1},
{nama:"Compressor",percent:0.08}
],
Renovasi:[
{nama:"Renovasi Tempat",percent:0.25}
],
Operasional:[
{nama:"Sparepart Awal",percent:0.2},
{nama:"Biaya 3 Bulan",percent:0.12}
],
Cadangan:[
{nama:"Risk Buffer",percent:0.05}
]
},

coffee:{
Peralatan:[
{nama:"Mesin Espresso",percent:0.25},
{nama:"Grinder",percent:0.08}
],
Interior:[
{nama:"Meja & Kursi",percent:0.2},
{nama:"Dekorasi",percent:0.07}
],
Operasional:[
{nama:"Bahan Baku Awal",percent:0.2},
{nama:"Gaji 2 Bulan",percent:0.15}
],
Cadangan:[
{nama:"Risk Buffer",percent:0.05}
]
}

}

/* ================= TEMPLATE RAB ================= */

const aiTemplates = {

"Liburan Keluarga": {
kategori:{
Transportasi:[
{nama:"Tiket Pesawat",volume:4,harga:1500000},
{nama:"Transport Lokal",volume:5,harga:300000}
],
Akomodasi:[
{nama:"Hotel 3 Malam",volume:3,harga:750000}
],
Konsumsi:[
{nama:"Makan Harian",volume:4,harga:250000}
]
}
},

"Renovasi Rumah": {
kategori:{
Material:[
{nama:"Semen",volume:50,harga:65000},
{nama:"Cat Tembok",volume:10,harga:180000}
],
Upah:[
{nama:"Tukang",volume:20,harga:150000}
]
}
},

"Buka Coffee Shop": {
kategori:{
Peralatan:[
{nama:"Mesin Espresso",volume:1,harga:15000000},
{nama:"Grinder",volume:1,harga:5000000}
],
Interior:[
{nama:"Meja & Kursi",volume:10,harga:750000}
],
Operasional:[
{nama:"Bahan Baku Awal",volume:1,harga:5000000}
]
}
},

"Event Seminar": {
kategori:{
Venue:[
{nama:"Sewa Gedung",volume:1,harga:8000000}
],
Konsumsi:[
{nama:"Snack Peserta",volume:100,harga:35000}
],
Marketing:[
{nama:"Iklan Sosial Media",volume:1,harga:2000000}
]
}
},

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
]
}
},

"Kontrakan 5 Pintu": {
kategori:{
Material:[
{nama:"Bata Ringan",volume:1000,harga:1200}
],
Upah:[
{nama:"Tukang",volume:60,harga:150000}
]
}
},

"Bisnis Laundry": {
kategori:{
Mesin:[
{nama:"Mesin Cuci",volume:2,harga:4500000}
],
Operasional:[
{nama:"Deterjen Awal",volume:1,harga:1000000}
]
}
},

"UMKM Fashion": {
kategori:{
Produksi:[
{nama:"Bahan Kain",volume:100,harga:45000}
],
Marketing:[
{nama:"Iklan Instagram",volume:1,harga:3000000}
]
}
},

"Travel Umroh": {
kategori:{
Paket:[
{nama:"Paket Umroh",volume:1,harga:30000000}
]
}
},

"Bangun Rumah 36": {
kategori:{
Material:[
{nama:"Semen",volume:100,harga:65000}
],
Upah:[
{nama:"Mandor",volume:30,harga:200000}
]
}
},

"Startup Digital": {
kategori:{
Development:[
{nama:"Developer 3 Bulan",volume:3,harga:8000000}
],
Marketing:[
{nama:"Ads Budget",volume:1,harga:10000000}
]
}
}

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
text = text.toLowerCase()
let match = text.match(/(\d+)\s*(jt|juta|m)/i)
if(match){
return parseInt(match[1]) * 1000000
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
bengkel:["bengkel","motor","mobil","service"],
coffee:["coffee","cafe","kopi"],
renovasi:["renovasi","rumah","bangun","kontrakan"],
startup:["startup","app","aplikasi","digital"],
laundry:["laundry","cuci"],
fashion:["fashion","baju","clothing"],
event:["event","seminar","workshop"]
}

for(let type in keywords){
if(keywords[type].some(word => text.includes(word))){
return type
}
}

return "coffee"
}

/* ================= DISTRIBUTE ================= */

function distributeBudget(budget, structure){
let result = {}

Object.keys(structure).forEach(cat=>{
result[cat] = structure[cat].map(item=>({
nama:item.nama,
volume:1,
harga:Math.round(budget * item.percent)
}))
})

return result
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

const name = "AI - " + type.toUpperCase() + " - " + Date.now()

projects[name] = {
diskon:0,
margin:calculateSuggestedMargin(type),
ppn:11,
kategori:kategori
}

currentProject = name
activeTab = null

save()
render()
renderProjects()

calculateBEP(budget)
showAIInsight(projects[name], budget)

aiStatus.innerText = "RAB Enterprise berhasil dibuat."

},700)
}

/* ================= MARGIN ================= */

function calculateSuggestedMargin(type){
if(type==="coffee") return 35
if(type==="bengkel") return 30
if(type==="renovasi") return 25
return 20
}

/* ================= BEP ================= */

function calculateBEP(budget){
const monthlyProfitEstimate = budget * 0.08
const bepMonths = Math.ceil(budget / monthlyProfitEstimate)
console.log("Estimasi BEP:",bepMonths,"bulan")
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

/* ================= INSIGHT UI ================= */

function showAIInsight(project, budget){

const score = calculateAIScore(project)
const risk = calculateRiskLevel(score)

let recommendation = ""

if(score >= 85){
recommendation = "Struktur sangat sehat dan siap dijalankan."
}
else if(score >= 70){
recommendation = "Layak dijalankan dengan kontrol biaya ketat."
}
else{
recommendation = "Perlu optimasi struktur biaya sebelum eksekusi."
}

aiInsight.innerHTML = `
<strong>AI Feasibility Score:</strong> ${score}/100 <br>
<strong>Risk Level:</strong> ${risk}<br>
<strong>Estimasi BEP:</strong> ~${Math.ceil(budget/(budget*0.08))} bulan<br><br>
${recommendation}
`
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

function renderProjects(){

projectList.innerHTML = ""

if(Object.keys(projects).length === 0){
projectList.innerHTML = `
<div style="opacity:.6;font-size:13px">
Belum ada project
</div>
`
return
}

Object.keys(projects).forEach(p=>{
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
save()
}

/* ================= CHART ================= */
function renderChart(total,profit){
if(chartInstance) chartInstance.destroy()
chartInstance=new Chart(document.getElementById("chart"),{
type:"doughnut",
data:{
labels:["Biaya","Profit"],
datasets:[{data:[total,profit]}]
},
options:{responsive:true}
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