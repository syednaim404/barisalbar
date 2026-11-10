/* ফটো গ্যালারি — ছবিতে ক্লিক করলে পপ-আপে বড় হয়ে খুলবে, X দিয়ে বন্ধ হবে */
(function(){
  var links=document.querySelectorAll('.gs');
  if(!links.length) return;
  var box=document.createElement('div');
  box.className='lb';
  box.innerHTML='<button class="lb-close" type="button" aria-label="বন্ধ করুন"><i class="fa-solid fa-xmark"></i></button><img class="lb-img" alt="">';
  document.body.appendChild(box);
  var img=box.querySelector('.lb-img');
  function open(src,alt){img.src=src;img.alt=alt||'';box.classList.add('show');document.body.style.overflow='hidden';}
  function close(){box.classList.remove('show');document.body.style.overflow='';setTimeout(function(){if(!box.classList.contains('show'))img.src='';},250);}
  links.forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      var im=a.querySelector('img');
      open(a.getAttribute('href'),im?im.alt:'');
    });
  });
  box.querySelector('.lb-close').addEventListener('click',close);
  box.addEventListener('click',function(e){if(e.target===box)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();
