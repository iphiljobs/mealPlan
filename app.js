
const D=window.MEAL_PLAN_DATA;
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const fmt=(v,d=1)=>typeof v==="number"?v.toLocaleString(undefined,{maximumFractionDigits:d}):(v??"");
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const slug=s=>String(s??"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
function lines(s){return String(s??"").split("\n").filter(Boolean)}
function val(row,...keys){for(const k of keys)if(row[k]!==undefined)return row[k];return null}

$("#navToggle").addEventListener("click",e=>{
  const nav=$("#mainNav"); const open=nav.classList.toggle("open");
  e.currentTarget.setAttribute("aria-expanded",String(open));
});
$$(".nav a").forEach(a=>a.addEventListener("click",()=>$("#mainNav").classList.remove("open")));

const days=D.dailyNutrition;
const avg=(key)=>days.reduce((a,r)=>a+(Number(r[key])||0),0)/days.length;
$("#heroKpis").innerHTML=[
  ["Avg calories",`${Math.round(avg("Calories"))}`],
  ["Avg protein",`${avg("Protein g").toFixed(1)} g`],
  ["Avg fiber",`${avg("Fiber g").toFixed(1)} g`],
  ["Recipe options",`${D.recipes.length}`]
].map(([l,v])=>`<div class="kpi"><b>${esc(v)}</b><span>${esc(l)}</span></div>`).join("");

let selectedDay="Day 1";
const mealsByDay=day=>D.mealPlan.filter(r=>r.Day===day);
function renderDays(){
  $("#dayTabs").innerHTML=days.map(r=>`<button role="tab" class="${r.Day===selectedDay?"active":""}" data-day="${esc(r.Day)}">${esc(r.Day)}</button>`).join("");
  $$("#dayTabs button").forEach(b=>b.addEventListener("click",()=>{selectedDay=b.dataset.day;renderDays();renderMeals()}));
}
function renderMeals(){
  const total=days.find(r=>r.Day===selectedDay);
  $("#daySummary").innerHTML=[
    ["Calories",`${fmt(total["Calories"],0)} kcal`],["Protein",`${fmt(total["Protein g"])} g`],
    ["Fiber",`${fmt(total["Fiber g"])} g`],["Omega-3",`${fmt(total["Omega-3 (g)"])} g`],
    ["Vitamin D",`${fmt(total["Vitamin D (µg)"])} µg`],["Calcium",`${fmt(total["Calcium mg"],0)} mg`]
  ].map(([a,b])=>`<span class="pill"><strong>${a}</strong>${b}</span>`).join("");
  $("#mealCards").innerHTML=mealsByDay(selectedDay).map(m=>`
    <article class="meal-card">
      <div class="meal-type">${esc(m["Meal / Timing"])}</div>
      <ul class="ingredients">${lines(m["Exact Ingredients (1 item per line)"]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      <div class="mini-nutrients">
        <span><b>${fmt(m["Calories (kcal)"],0)}</b> kcal</span>
        <span><b>${fmt(m["Protein (g)"])}</b> g protein</span>
        <span><b>${fmt(m["Fiber (g)"])}</b> g fiber</span>
        <span><b>${fmt(m["Vitamin D (µg)"])}</b> µg Vit D</span>
      </div>
      <p class="muted"><small>${esc(m["Viruddha-Ahara safeguard"])}</small></p>
    </article>`).join("");
}
renderDays();renderMeals();

function barChart(el,key,max,unit){
  el.innerHTML=days.map(r=>{
    const v=Number(r[key])||0,p=Math.min(100,(v/max)*100);
    return `<div class="bar-col" title="${esc(r.Day)}: ${fmt(v)} ${unit}"><b>${fmt(v)}</b><div class="bar" style="height:${p}%"></div><small>${esc(r.Day.replace("Day ","D"))}</small></div>`
  }).join("");
}
barChart($("#calorieChart"),"Calories",1900,"kcal");
barChart($("#proteinChart"),"Protein g",130,"g");
barChart($("#fiberChart"),"Fiber g",50,"g");
barChart($("#vitDChart"),"Vitamin D (µg)",35,"µg");

const nutritionPriority=[
 "Day","Calories","Protein g","Fiber g","Fat g","Calcium mg","Iron mg","Magnesium mg","Potassium mg",
 "Vitamin A Total (µg RAE)","Vitamin C (mg)","Vitamin D (µg)","Vitamin E (mg)","Vitamin K (µg)",
 "Vitamin B1 Thiamin (mg)","Vitamin B2 Riboflavin (mg)","Vitamin B3 Niacin (mg)","Vitamin B5 Pantothenic Acid (mg)",
 "Vitamin B6 (mg)","Vitamin B7 Biotin (µg, est.)","Vitamin B9 Folate (µg DFE)","Vitamin B12 (µg)",
 "Omega-3 (g)","Saturated Fat (g)","Preformed Vitamin A (µg RAE)"
];
function renderNutrition(q=""){
  const cols=nutritionPriority.filter(c=>!q||c.toLowerCase().includes(q.toLowerCase())||c==="Day");
  $("#nutritionTable").innerHTML=`<thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${days.map(r=>`<tr>${cols.map(c=>`<td>${fmt(r[c],1)}</td>`).join("")}</tr>`).join("")}</tbody>`;
}
renderNutrition();
$("#nutrientSearch").addEventListener("input",e=>renderNutrition(e.target.value));

$("#targetCards").innerHTML=D.targets.map(t=>`<div class="target-card"><b>${esc(t["Nutrient"])}</b><span>${esc(t["Target / guide"])}</span><p class="muted">${esc(t["Interpretation"])}</p></div>`).join("");

const recipeDays=[...new Set(D.recipes.map(r=>r.Day))];
const recipeMeals=[...new Set(D.recipes.map(r=>r["Meal / Timing"]))];
$("#recipeDay").innerHTML+=recipeDays.map(x=>`<option>${esc(x)}</option>`).join("");
$("#recipeMeal").innerHTML+=recipeMeals.map(x=>`<option>${esc(x)}</option>`).join("");
function renderRecipes(){
  const d=$("#recipeDay").value,m=$("#recipeMeal").value,b=$("#recipeBatch").value,q=$("#recipeSearch").value.toLowerCase();
  const rows=D.recipes.filter(r=>(d==="all"||r.Day===d)&&(m==="all"||r["Meal / Timing"]===m)&&(b==="all"||r["Batch Friendly"]===b)&&(!q||JSON.stringify(r).toLowerCase().includes(q)));
  const groups=new Map();
  rows.forEach(r=>{const k=`${r.Day}|${r["Meal / Timing"]}`;(groups.get(k)||groups.set(k,[]).get(k)).push(r)});
  $("#recipeResults").innerHTML=[...groups.entries()].map(([k,rs])=>{
    const [day,meal]=k.split("|"),base=rs[0];
    return `<article class="recipe-group">
      <div class="recipe-group-head"><div><strong>${esc(day)} · ${esc(meal)}</strong><div class="muted">${lines(base["Exact Ingredients"]).slice(0,5).map(esc).join(" · ")}${lines(base["Exact Ingredients"]).length>5?" …":""}</div></div><span>${rs.length} option${rs.length!==1?"s":""}</span></div>
      <div class="recipe-options">${rs.sort((a,b)=>Number(a.Option)-Number(b.Option)).map(r=>{
        const bo=(D.breakfastOptions||[]).find(x=>x.Day===r.Day&&Number(x.Option)===Number(r.Option));
        const yt=String(r["YouTube Recipe Reference"]||"");
        const overnight=r["Meal / Timing"]==="Breakfast"&&Number(r.Option)===4;
        const refType=String(r["Reference Type"]||"");
        return `
        <div class="recipe-option ${Number(r.Option)===1?"recommended":""} ${overnight?"overnight":""}">
          <span class="option-label">${overnight?"No-cook overnight":`Option ${esc(r.Option)}${Number(r.Option)===1?" · Recommended":""}`}</span>
          <h3>${esc(r.Recipe)}</h3>
          <div class="recipe-meta">${esc(r.Style)} · ${esc(r.Equipment)} · ${esc(r["Active Prep"])} prep · ${esc(r["Cook Time"])} cook</div>
          ${bo?`<div class="recipe-nutrition"><span>${fmt(bo["Calories"],0)} kcal</span><span>${fmt(bo["Protein g"])} g protein</span><span>${fmt(bo["Fiber g"])} g fiber</span><span>Projected day: ${fmt(bo["Projected Daily Calories"],0)} kcal</span></div>`:""}
          <details class="ingredient-details"><summary>Exact ingredients</summary><ul class="ingredients">${lines(r["Exact Ingredients"]).map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>
          <p>${esc(r.Method)}</p>
          ${yt?`<div class="recipe-actions"><a class="button small yt-link" href="${esc(yt)}" target="_blank" rel="noopener noreferrer">YouTube ${refType.includes("fallback")?"search":"reference"}</a><small>${esc(r["Reference Note"]||refType)}</small></div>`:""}
        </div>`}).join("")}</div></article>`
  }).join("") || `<p>No recipe options match these filters.</p>`;
}
["recipeDay","recipeMeal","recipeBatch","recipeSearch"].forEach(id=>$("#"+id).addEventListener("input",renderRecipes));
renderRecipes();

const shop=D.shopping, checked=JSON.parse(localStorage.getItem("mealPlanShopping")||"{}");
const stores=[...new Set(shop.map(r=>r["Recommended Store"]).filter(Boolean))].sort();
const deps=[...new Set(shop.map(r=>r.Department).filter(Boolean))].sort();
$("#shopStore").innerHTML+=stores.map(x=>`<option>${esc(x)}</option>`).join("");
$("#shopDept").innerHTML+=deps.map(x=>`<option>${esc(x)}</option>`).join("");
function shopKey(r){return slug(`${r.Department}-${r.Item}`)}
function updateProgress(){
  const n=shop.filter(r=>checked[shopKey(r)]).length,p=Math.round(n/shop.length*100);
  $("#shopProgress").value=p;$("#shopProgressText").textContent=`${n} of ${shop.length} purchased`;$("#shopProgressPct").textContent=`${p}%`;
}
function renderShopping(){
  const store=$("#shopStore").value,dep=$("#shopDept").value,q=$("#shopSearch").value.toLowerCase();
  const rows=shop.filter(r=>(store==="all"||r["Recommended Store"]===store)&&(dep==="all"||r.Department===dep)&&(!q||JSON.stringify(r).toLowerCase().includes(q)));
  $("#shoppingCards").innerHTML=rows.map(r=>{
    const k=shopKey(r),done=!!checked[k];
    return `<article class="shop-card ${done?"done":""}">
      <div class="shop-title"><input type="checkbox" data-shop="${esc(k)}" ${done?"checked":""} aria-label="Mark ${esc(r.Item)} purchased"><div><h3>${esc(r.Item)}</h3><div class="need">${esc(r["Weekly Need"])}</div></div></div>
      <span class="store-badge">Recommended: ${esc(r["Recommended Store"])}</span>
      <div class="store-lines"><b>Costco:</b> ${esc(r["Costco Wesley Chapel"])}<br><b>Walmart:</b> ${esc(r["Walmart Wesley Chapel"])}<br><b>Lotte:</b> ${esc(r["Lotte Tampa"])}</div>
      <p class="muted"><small>${esc(r.Why)}</small></p>
    </article>`
  }).join("");
  $$("[data-shop]").forEach(c=>c.addEventListener("change",()=>{checked[c.dataset.shop]=c.checked;localStorage.setItem("mealPlanShopping",JSON.stringify(checked));renderShopping();updateProgress()}));
}
["shopStore","shopDept","shopSearch"].forEach(id=>$("#"+id).addEventListener("input",renderShopping));
$("#resetShopping").addEventListener("click",()=>{Object.keys(checked).forEach(k=>delete checked[k]);localStorage.removeItem("mealPlanShopping");renderShopping();updateProgress()});
renderShopping();updateProgress();


function renderBreakfastFlex(){
  const rows=D.breakfastFlexShopping||[];
  if(!rows.length||!$("#breakfastFlexTable")) return;
  const cols=["Day","Option","Breakfast","Key grains / legumes","Seed side","Morning effort"];
  $("#breakfastFlexTable").innerHTML=`<thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${cols.map(c=>`<td>${esc(r[c]).replace(/\n/g,"<br>")}</td>`).join("")}</tr>`).join("")}</tbody>`;
}
renderBreakfastFlex();

$("#batchGrid").innerHTML=D.batchPrep.map(r=>`<article class="batch-card"><h3>${esc(r["Prep Component"])}</h3><p>${esc(r["Suggested Batch Method"])}</p><div class="meta"><b>Equipment:</b> ${esc(r.Equipment)}<br><b>Active:</b> ${esc(r["Active Time"])} · <b>Batch:</b> ${esc(r["Batch Size / Frequency"])}<br><b>Store:</b> ${esc(r["Cool & Store"])}<br><b>Finish:</b> ${esc(r["Reheat / Finish"])}</div></article>`).join("");

function statusClass(s){s=String(s||"").toUpperCase();return s.includes("GAP")?"warn":s.includes("PASS")?"good":"warn"}
const pass=D.criteria.filter(r=>String(r.Status).includes("PASS")).length,gaps=D.criteria.filter(r=>String(r.Status).includes("GAP")).length;
$("#statusSummary").innerHTML=`<span class="status-chip good">${pass} criteria passing</span><span class="status-chip warn">${gaps} explicit clinical gap</span>`;
$("#criteriaList").innerHTML=D.criteria.map(r=>`<article class="criterion"><div class="criterion-head"><strong>${esc(r.Criterion)}</strong><span class="status ${statusClass(r.Status)}">${esc(r.Status)}</span></div><p class="muted">${esc(r["Final verification / action"])}</p></article>`).join("");

$("#viruddhaList").innerHTML=D.viruddha.map(r=>`<article class="audit-card"><b>${esc(r["#"])}. ${esc(r["Article rule"])}</b><span class="muted">${esc(r.Status)}</span><p>${esc(r["How this plan handles it"])}</p></article>`).join("");

$("#sourceList").innerHTML=D.sources.map(r=>{
  const u=String(r["Source / URL"]??"");
  const link=/^https?:\/\//.test(u)?`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(u)}</a>`:esc(u);
  return `<article class="source-card"><strong>${esc(r.Topic)}</strong><div>${link}</div><p class="muted">${esc(r.Use)}</p></article>`
}).join("");