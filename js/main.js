// LexTier interactions — premium header, mega, mobile, carousel, form
(function(){
  const header = document.getElementById('siteHeader');
  const expertiseBtn = document.getElementById('expertiseBtn');
  const megaParent = expertiseBtn ? expertiseBtn.closest('.has-mega') : null;
  const hamburger = document.getElementById('hamburger');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const carousel = document.getElementById('insightsCarousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Sticky header shadow
  const onScroll = () => {
    if(window.scrollY > 6) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mega menu toggle (click) + hover for desktop
  if(expertiseBtn && megaParent){
    expertiseBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      const open = megaParent.classList.toggle('open');
      expertiseBtn.setAttribute('aria-expanded', open ? 'true':'false');
    });
    // hover intent for desktop
    let hoverTimer;
    megaParent.addEventListener('mouseenter', ()=>{
      if(window.innerWidth > 1100){
        clearTimeout(hoverTimer);
        megaParent.classList.add('open');
        expertiseBtn.setAttribute('aria-expanded','true');
      }
    });
    megaParent.addEventListener('mouseleave', ()=>{
      if(window.innerWidth > 1100){
        hoverTimer = setTimeout(()=>{
          megaParent.classList.remove('open');
          expertiseBtn.setAttribute('aria-expanded','false');
        }, 120);
      }
    });
    document.addEventListener('click', (e)=>{
      if(!megaParent.contains(e.target)){
        megaParent.classList.remove('open');
        expertiseBtn.setAttribute('aria-expanded','false');
      }
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key==='Escape'){
        megaParent.classList.remove('open');
        expertiseBtn.setAttribute('aria-expanded','false');
      }
    });
  }

  // Mobile drawer
  if(hamburger && mobileDrawer){
    hamburger.addEventListener('click', ()=>{
      const open = mobileDrawer.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open? 'true':'false');
      mobileDrawer.setAttribute('aria-hidden', open? 'false':'true');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileDrawer.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        mobileDrawer.classList.remove('open');
        hamburger.setAttribute('aria-expanded','false');
        document.body.style.overflow='';
      });
    });
  }

  // Insights carousel
  if(carousel && prevBtn && nextBtn){
    const scrollAmount = 380;
    prevBtn.addEventListener('click', ()=> carousel.scrollBy({left: -scrollAmount, behavior:'smooth'}));
    nextBtn.addEventListener('click', ()=> carousel.scrollBy({left: scrollAmount, behavior:'smooth'}));
    // drag to scroll
    let isDown=false, startX, scrollLeft;
    carousel.addEventListener('mousedown', (e)=>{
      isDown=true; carousel.classList.add('dragging');
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', ()=>{ isDown=false; carousel.classList.remove('dragging'); });
    carousel.addEventListener('mouseup', ()=>{ isDown=false; carousel.classList.remove('dragging'); });
    carousel.addEventListener('mousemove', (e)=>{
      if(!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.2;
      carousel.scrollLeft = scrollLeft - walk;
    });
    // auto scroll hint on load
    setTimeout(()=>{ if(window.innerWidth>900) carousel.scrollLeft = 0; }, 200);
  }

  // Contact form — fake success (Netlify-ready: add netlify attribute if deploying)
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      if(!form.checkValidity()){
        form.reportValidity();
        return;
      }
      const data = new FormData(form);
      const name = data.get('name') || 'there';
      success.textContent = `Thank you, ${name} — your enquiry has been received. Our team will respond within one business day with a fixed-fee proposal.`;
      success.classList.add('show');
      form.reset();
      // optional: persist to localStorage for demo
      try{ localStorage.setItem('lextier_last_enquiry', new Date().toISOString()); }catch(_){}
      setTimeout(()=> success.scrollIntoView({behavior:'smooth', block:'center'}), 100);
    });
  }

  // Smooth anchor offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(href.length>1){
        const target = document.querySelector(href);
        if(target){
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 86;
          window.scrollTo({top, behavior:'smooth'});
          // close mega/drawer
          if(megaParent) megaParent.classList.remove('open');
        }
      }
    });
  });

})();
