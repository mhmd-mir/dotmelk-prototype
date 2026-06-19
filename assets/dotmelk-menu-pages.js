
(function(){
  function closeDrawer(){ document.body.classList.remove('drawer-open'); }
  document.addEventListener('click', function(e){
    const toggle = e.target.closest('[data-drawer-toggle]');
    if(toggle){ document.body.classList.toggle('drawer-open'); return; }
    if(e.target.closest('[data-drawer-close]')){ closeDrawer(); return; }
    const acc = e.target.closest('[data-accordion-button]');
    if(acc){
      const item = acc.closest('.accordion');
      if(item) item.classList.toggle('open');
      return;
    }
    const toast = e.target.closest('[data-toast]');
    if(toast){
      const old=document.querySelector('.toast-demo'); if(old) old.remove();
      const el=document.createElement('div');
      el.className='toast-demo';
      el.textContent=toast.getAttribute('data-toast') || 'عملیات نمایشی انجام شد';
      Object.assign(el.style,{position:'fixed',left:'20px',bottom:'20px',zIndex:9999,background:'rgba(15,23,42,.88)',color:'#fff',padding:'10px 14px',borderRadius:'999px',boxShadow:'0 10px 24px rgba(15,23,42,.18)',fontSize:'13px'});
      document.body.appendChild(el); setTimeout(()=>el.remove(),2600);
      return;
    }
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeDrawer(); });
})();
