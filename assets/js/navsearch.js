/* মেনুবারের সার্চ আইকন — ক্লিকে প্যানেল খোলে/বন্ধ হয় */
(function(){
  var btn=document.getElementById('navSearchBtn'),panel=document.getElementById('navSearchPanel'),input=document.getElementById('navSearchInput');
  if(!btn||!panel) return;
  var icon=btn.querySelector('i');
  function setOpen(o){
    panel.classList.toggle('show',o);
    btn.setAttribute('aria-expanded',o?'true':'false');
    icon.className=o?'fa-solid fa-xmark':'fa-solid fa-magnifying-glass';
    if(o&&input) setTimeout(function(){input.focus()},120);
  }
  btn.addEventListener('click',function(e){e.stopPropagation();setOpen(!panel.classList.contains('show'));});
  panel.addEventListener('click',function(e){e.stopPropagation();});
  document.addEventListener('click',function(){setOpen(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
})();
