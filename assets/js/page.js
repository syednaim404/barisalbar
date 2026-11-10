/* ভেতরের পেজের জন্য (মেনু, back-to-top, ছবির ফলব্যাক) */
(function(){
const menuToggle=document.getElementById("menuToggle"),sideMenu=document.getElementById("sideMenu"),overlay=document.getElementById("mobileOverlay");
function openMenu(){sideMenu.classList.add("open");overlay.classList.add("show");document.body.style.overflow="hidden";}
function hideMenu(){sideMenu.classList.remove("open");overlay.classList.remove("show");document.body.style.overflow="";}
menuToggle.addEventListener("click",openMenu);overlay.addEventListener("click",hideMenu);
sideMenu.querySelectorAll("a").forEach(l=>l.addEventListener("click",hideMenu));
document.addEventListener("keydown",e=>{if(e.key==="Escape")hideMenu();});
const b=document.getElementById("backToTop");
window.addEventListener("scroll",()=>b.classList.toggle("show",window.scrollY>400));
b.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
const ph="data:image/svg+xml;utf8,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#e3e9f0"/></svg>');
document.querySelectorAll("img[src^='https://images.unsplash']").forEach(im=>{const f=()=>{im.onerror=null;im.src=ph};im.onerror=f;if(im.complete&&!im.naturalWidth)f()});
})();
