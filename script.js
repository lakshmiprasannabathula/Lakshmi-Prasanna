// Recipes data
const RECIPES=[
 {title:"Creamy Tomato Pasta",cat:"Vegetarian",time:25,rating:4.6,img:"https://via.placeholder.com/400x250?text=Pasta"},
 {title:"Garlic Butter Shrimp",cat:"Seafood",time:20,rating:4.8,img:"https://via.placeholder.com/400x250?text=Shrimp"},
 {title:"Lemon Herb Chicken",cat:"Meat",time:40,rating:4.4,img:"https://via.placeholder.com/400x250?text=Chicken"},
 {title:"Chocolate Lava Cake",cat:"Dessert",time:30,rating:4.9,img:"https://via.placeholder.com/400x250?text=Cake"}
];
// Helpers
const qs=s=>document.querySelector(s),qsa=s=>document.querySelectorAll(s);
function show(id){qsa(".page").forEach(p=>p.classList.add("hidden"));qs("#"+id).classList.remove("hidden");}
qsa("[data-link]").forEach(a=>a.onclick=e=>{e.preventDefault();show(a.getAttribute("href").replace("#",""));});
qs("#nav-toggle").onclick=()=>qsa(".main-nav a").forEach(a=>a.style.display=a.style.display==="inline"?"none":"inline");

// Quiz
const QUIZ=[{q:"Which oil in Italian cooking?",a:"Olive Oil",o:["Olive Oil","Coconut","Mustard","Sunflower"]}];
function loadQuiz(){
 let c=qs("#quiz");c.innerHTML=QUIZ.map((x,i)=>`<p>${x.q}</p>`+x.o.map(o=>`<label><input type=radio name=q${i} value="${o}"> ${o}</label>`).join("")).join("");
}
qs("#quiz-submit").onclick=()=>{let s=0;QUIZ.forEach((x,i)=>{let v=qs(`input[name=q${i}]:checked`);if(v&&v.value===x.a)s++});qs("#quiz-result").textContent=`Score: ${s}/${QUIZ.length}`};
loadQuiz();

// Joke API
qs("#joke-btn").onclick=async()=>{qs("#joke-output").textContent="Loading...";try{let r=await fetch("https://official-joke-api.appspot.com/random_joke");let j=await r.json();qs("#joke-output").textContent=j.setup+" — "+j.punchline}catch{qs("#joke-output").textContent="Error loading joke"}};

// To-do
let todos=JSON.parse(localStorage.getItem("todos")||"[]");
function renderTodos(){qs("#todo-list").innerHTML=todos.map((t,i)=>`<li data-i=${i} class="${t.done?"done":""}"><input type=checkbox ${t.done?"checked":""}> ${t.text} <button>x</button></li>`).join("")}
qs("#todo-add").onclick=()=>{let v=qs("#todo-input").value.trim();if(!v)return;todos.push({text:v,done:!1});localStorage.setItem("todos",JSON.stringify(todos));qs("#todo-input").value="";renderTodos()};
qs("#todo-list").onclick=e=>{let i=e.target.parentNode.dataset.i;if(e.target.type==="checkbox"){todos[i].done=e.target.checked}else if(e.target.tagName==="BUTTON"){todos.splice(i,1)}localStorage.setItem("todos",JSON.stringify(todos));renderTodos()};
renderTodos();

// Recipes
function renderRecipes(){
 let g=qs("#recipe-grid"),f=qs("#filter-category").value,s=qs("#search").value.toLowerCase(),sort=qs("#sort-by").value;
 let r=RECIPES.filter(x=>(!f||x.cat===f)&&x.title.toLowerCase().includes(s));
 if(sort==="rating-desc")r.sort((a,b)=>b.rating-a.rating);if(sort==="time-asc")r.sort((a,b)=>a.time-b.time);
 g.innerHTML=r.map(x=>`<div class="recipe-card card"><img src="${x.img}" loading="lazy"><h3>${x.title}</h3><p>${x.cat} • ${x.time}min • ⭐${x.rating}</p></div>`).join("");
}
["search","filter-category","sort-by"].forEach(id=>qs("#"+id).oninput=renderRecipes);renderRecipes();

// Contact
let msgs=JSON.parse(localStorage.getItem("msgs")||"[]");
function renderMsgs(){qs("#saved-messages").innerHTML=msgs.map(m=>`<li>${m.name}: ${m.msg}</li>`).join("")}
qs("#contact-form").onsubmit=e=>{e.preventDefault();let m={name:qs("#cname").value,email:qs("#cemail").value,msg:qs("#cmsg").value};msgs.push(m);localStorage.setItem("msgs",JSON.stringify(msgs));qs("#contact-feedback").textContent="Saved!";renderMsgs();e.target.reset()};
renderMsgs();
