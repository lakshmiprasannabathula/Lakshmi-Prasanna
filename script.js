/***********************
 * Data
 ***********************/
const RECIPES = [
  { id:1, title:"Creamy Tomato Pasta", category:"Vegetarian", time:25, rating:4.6,
    img:"https://via.placeholder.com/640x420?text=Creamy+Tomato+Pasta",
    ingredients:["200g pasta","2 tomatoes","1 onion","2 cloves garlic","olive oil","salt","pepper"],
    steps:["Boil pasta until al dente.","Sauté onion & garlic.","Add tomatoes & simmer.","Add cream and combine with pasta."] },
  { id:2, title:"Garlic Butter Shrimp", category:"Seafood", time:20, rating:4.8,
    img:"https://via.placeholder.com/640x420?text=Garlic+Butter+Shrimp",
    ingredients:["400g shrimp","2 tbsp butter","3 cloves garlic","lemon","parsley","salt"],
    steps:["Season shrimp.","Sear shrimp in butter.","Add garlic & lemon.","Finish with parsley."] },
  { id:3, title:"Lemon Herb Chicken", category:"Meat", time:40, rating:4.4,
    img:"https://via.placeholder.com/640x420?text=Lemon+Herb+Chicken",
    ingredients:["1kg chicken","lemon","rosemary","garlic","olive oil","salt","pepper"],
    steps:["Marinate chicken.","Roast at 200°C until done.","Rest then serve."] },
  { id:4, title:"Chocolate Lava Cake", category:"Dessert", time:30, rating:4.9,
    img:"https://via.placeholder.com/640x420?text=Chocolate+Lava+Cake",
    ingredients:["chocolate","butter","sugar","eggs","flour"],
    steps:["Melt chocolate & butter.","Mix batter.","Bake until edges set & center gooey."] }
];

/* localStorage helpers */
function readLS(key, fallback=null){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch(e){return fallback} }
function writeLS(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

/***********************
 * Navigation
 ***********************/
document.querySelectorAll('[data-link]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    e.preventDefault();
    const href = a.getAttribute('href') || '#home';
    const id = href.replace('#','') || 'home';
    showSection(id);
    history.pushState({page:id}, '', '#'+id);
  });
});
document.getElementById('nav-toggle').addEventListener('click', ()=>{
  document.querySelectorAll('.main-nav a').forEach(a=>{
    a.style.display = a.style.display === 'inline' ? 'none' : 'inline';
  });
});
window.addEventListener('popstate', (e)=>{
  const id = (e.state && e.state.page) || location.hash.replace('#','') || 'home';
  showSection(id);
});
function showSection(id){
  document.querySelectorAll('.page').forEach(s=>s.classList.add('hidden'));
  const sel = document.getElementById(id);
  if(sel) sel.classList.remove('hidden');
  window.scrollTo({top:0,behavior:'smooth'});
}

/***********************
 * Home features
 ***********************/
document.addEventListener('DOMContentLoaded', ()=>{
  const initial = location.hash.replace('#','') || 'home';
  showSection(initial);

  // toggle steps
  document.querySelectorAll('#home-steps li').forEach(li=> li.addEventListener('click', ()=> li.classList.toggle('done')));

  // quiz
  setupQuiz('#home-quiz','home-quiz-submit','home-quiz-result');

  // joke
  setupJoke('joke-btn','joke-output');

  // todo
  setupTodo('todo-input','todo-add','todo-list');

  // recipes
  initRecipesPage();
  initContactPage();
});

/***********************
 * Quiz
 ***********************/
const QUIZ_DATA = [
  {question:"Which oil is widely used in Italian cooking?", options:["Olive Oil","Coconut Oil","Mustard Oil","Sunflower Oil"], answer:"Olive Oil"},
  {question:"Pasta is primarily made from?", options:["Rice","Wheat","Corn","Potato"], answer:"Wheat"},
  {question:"Which ingredient makes a sauce creamy?", options:["Water","Cream","Vinegar","Soy Sauce"], answer:"Cream"}
];
function setupQuiz(containerSelector, submitBtnId, resultId){
  const container = document.querySelector(containerSelector);
  if(!container) return;
  container.innerHTML = QUIZ_DATA.map((q,i)=>`
    <div class="q"><p>${i+1}. ${q.question}</p>
    ${q.options.map(opt=>`<label><input name="q${i}" type="radio" value="${opt}"> ${opt}</label><br>`).join('')}
    </div>
  `).join('');
  const submitBtn = document.getElementById(submitBtnId);
  if(submitBtn) submitBtn.addEventListener('click', ()=>{
    let score=0;
    QUIZ_DATA.forEach((q,i)=>{
      const sel = document.querySelector(`input[name="q${i}"]:checked`);
      if(sel && sel.value===q.answer) score++;
    });
    const out = document.getElementById(resultId);
    if(out) out.textContent = `Score: ${score} / ${QUIZ_DATA.length}`;
  });
}

/***********************
 * Joke
 ***********************/
function setupJoke(buttonId, outputId){
  const btn = document.getElementById(buttonId);
  const out = document.getElementById(outputId);
  if(!btn) return;
  btn.addEventListener('click', async ()=>{
    out.textContent = "Loading...";
    try{
      const r = await fetch("https://official-joke-api.appspot.com/random_joke");
      const j = await r.json();
      out.textContent = `${j.setup} — ${j.punchline}`;
    }catch(e){
      out.textContent = "Couldn't fetch a joke right now.";
    }
  });
}

/***********************
 * To-Do / Shopping
 ***********************/
function setupTodo(inputId, addBtnId, listId){
  const input = document.getElementById(inputId);
  const addBtn = document.getElementById(addBtnId);
  const ul = document.getElementById(listId);
  if(!input || !addBtn || !ul) return;
  let items = readLS('shop-items',[]) || [];
  function render(){ ul.innerHTML = items.map((it,idx)=>`<li data-i="${idx}"><label><input type="checkbox" ${it.done?'checked':''}/> ${it.text}</label> <button class="del" data-i="${idx}">✕</button></li>`).join(''); }
  render();
  addBtn.addEventListener('click', ()=>{
    const txt = input.value.trim(); if(!txt) return;
    items.push({text:txt, done:false}); writeLS('shop-items',items); input.value=''; render();
  });
  ul.addEventListener('click', (e)=>{
    if(e.target.matches('.del')){ const i = +e.target.dataset.i; items.splice(i,1); writeLS('shop-items',items); render(); }
    if(e.target.matches('input[type="checkbox"]')){ const li = e.target.closest('li'); const i = +li.dataset.i; items[i].done = e.target.checked; writeLS('shop-items',items); render(); }
  });
}

/***********************
 * Recipes page
 ***********************/
function initRecipesPage(){
  const grid = document.getElementById('recipe-grid');
  if(!grid) return;
  const search = document.getElementById('
