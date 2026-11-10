const menuToggle = document.getElementById("menuToggle");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("mobileOverlay");
function openMenu(){sideMenu.classList.add("open");overlay.classList.add("show");document.body.style.overflow="hidden";}
function hideMenu(){sideMenu.classList.remove("open");overlay.classList.remove("show");document.body.style.overflow="";}
menuToggle.addEventListener("click",openMenu);
overlay.addEventListener("click",hideMenu);
sideMenu.querySelectorAll("a").forEach(link=>link.addEventListener("click",hideMenu));
document.addEventListener("keydown",e=>{if(e.key==="Escape")hideMenu();});
const backToTop=document.getElementById("backToTop");
window.addEventListener("scroll",()=>{backToTop.classList.toggle("show",window.scrollY>400);});
backToTop.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
document.getElementById('next').setAttribute('title', 'n@!3');
/* ===== v2 ===== */
(function(){
const tr=document.getElementById("tickerTrack");
function ticker(){const unit=tr.dataset.u||(tr.dataset.u=tr.innerHTML),box=tr.parentElement;tr.style.animation="none";tr.innerHTML=unit;while(tr.scrollWidth<box.clientWidth)tr.innerHTML+=unit;tr.innerHTML+=tr.innerHTML;const half=tr.scrollWidth/2;tr.style.setProperty("--shift",-half+"px");void tr.offsetWidth;tr.style.animation="tickerLoop "+(half/70)+"s linear infinite";}
const st=document.createElement("style");st.textContent="@keyframes tickerLoop{to{transform:translateX(var(--shift))}}";document.head.appendChild(st);
if(tr){ticker();let rt;window.addEventListener("resize",()=>{clearTimeout(rt);rt=setTimeout(ticker,200)});}
const mc=document.getElementById("memberCarousel"),track=mc.querySelector(".mc-track"),n=track.children.length;let i=0,timer;
const pv=()=>innerWidth<576?2:innerWidth<992?3:5;
function go(k){const max=n-pv();i=k>max?0:k<0?max:k;track.style.transform="translateX("+(-i*track.children[0].offsetWidth)+"px)";}
function play(){clearInterval(timer);timer=setInterval(()=>go(i+1),3000)}
mc.querySelector(".next").onclick=()=>{go(i+1);play()};mc.querySelector(".prev").onclick=()=>{go(i-1);play()};
let sx=0;mc.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});mc.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>40){go(i+(d<0?1:-1));play()}});
window.addEventListener("resize",()=>go(i));play();

const m=document.getElementById("infoModal");
m.addEventListener("show.bs.modal",e=>{const b=e.relatedTarget.dataset;mTitle.textContent=b.title;mMeta.textContent=b.meta;mDesc.textContent=b.desc;mImg.classList.toggle("d-none",!b.img);if(b.img)mImg.src=b.img});
document.querySelectorAll("[data-bs-toggle=modal]").forEach(a=>a.addEventListener("click",e=>e.preventDefault()));
const ph="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#e3e9f0"/><circle cx="150" cy="115" r="48" fill="#a9b7c6"/><rect x="70" y="180" width="160" height="90" rx="45" fill="#a9b7c6"/></svg>');
document.querySelectorAll("img[src^='https://images.unsplash']").forEach(im=>{const f=()=>{im.onerror=null;im.src=ph};im.onerror=f;if(im.complete&&!im.naturalWidth)f()});
})();
