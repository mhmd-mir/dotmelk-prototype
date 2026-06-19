
document.addEventListener('click', function(e){
  const t = e.target.closest('[data-toast]');
  if(t){
    const old = document.querySelector('.toast-demo');
    if(old) old.remove();
    const el = document.createElement('div');
    el.className = 'toast-demo';
    el.textContent = t.getAttribute('data-toast');
    Object.assign(el.style,{
      position:'fixed',left:'24px',bottom:'24px',zIndex:'9999',background:'rgba(15,23,42,.88)',color:'#fff',
      padding:'10px 14px',borderRadius:'999px',boxShadow:'0 10px 24px rgba(15,23,42,.18)',fontSize:'13px'
    });
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),2600);
  }
});
