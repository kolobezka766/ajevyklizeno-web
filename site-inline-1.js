
    /* \u2500\u2500 SCROLL PROGRESS \u2500\u2500 */
    window.addEventListener('scroll', () => {
      const el = document.getElementById('scrollProgress');
      const total = document.documentElement.scrollHeight - innerHeight;
      if (total > 0) el.style.width = (scrollY / total * 100) + '%';
    });

    /* \u2500\u2500 TOAST \u2500\u2500 */
    function showToast(msg, type) {
      const t = document.getElementById('toast');
      t.textContent = msg;
      t.style.background = type === 'error' ? '#c0392b' : type === 'warn' ? '#d68910' : 'var(--green)';
      t.classList.add('show');
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.classList.remove('show'), 4500);
    }


    /* \u2500\u2500 FOTO UPLOAD \u2013 validace \u2500\u2500 */
    function showFileNames(input) {
      const list = document.getElementById('fileList');
      if (!input.files || input.files.length === 0) { list.style.display = 'none'; return; }
      if (input.files.length > 5) { showToast('\u26a0\ufe0f Maxim\u00e1ln\u011b 5 fotek najednou.', 'warn'); input.value = ''; list.style.display = 'none'; return; }
      let total = 0;
      Array.from(input.files).forEach(f => total += f.size);
      if (total > 10 * 1024 * 1024) { showToast('\u26a0\ufe0f Celkov\u00e1 velikost fotek nesm\u00ed p\u0159es\u00e1hnout 10 MB.', 'warn'); input.value = ''; list.style.display = 'none'; return; }
      list.textContent = Array.from(input.files).map(f => '📷 ' + f.name).join('\n');
      list.style.whiteSpace = 'pre-line';
      list.style.display = 'block';
    }

/* \u2500\u2500 FORM AJAX \u2500\u2500 */

    /* Native submission keeps the provider's server-side bot verification enabled. */
    (function () {
      var form = document.getElementById('kalkulaceForm');
      if (!form) return;
      form.addEventListener('submit', function (event) {
        var trap = form.querySelector('[name="_honey"]');
        if ((trap && trap.value) || !form.reportValidity()) {
          event.preventDefault();
          return;
        }
        var upload = document.getElementById('fotoUpload');
        if (upload && upload.files) {
          var files = Array.from(upload.files);
          if (files.length > 5 || files.reduce(function (n, f) { return n + f.size; }, 0) > 10 * 1024 * 1024) {
            event.preventDefault();
            showToast('Přiložte nejvýše 5 fotografií o celkové velikosti do 10 MB.', 'warn');
          }
        }
      });
    })();

    /* \u2500\u2500 HAMBURGER \u2500\u2500 */
    function toggleMenu() {
      const btn = document.getElementById('hamburger'), menu = document.getElementById('mobileMenu');
      btn.classList.toggle('open'); menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    }
    function closeMenu() {
      document.getElementById('hamburger').classList.remove('open');
      document.getElementById('mobileMenu').classList.remove('open');
      document.body.style.overflow = '';
    }
    document.addEventListener('click', function(e) {
      const menu = document.getElementById('mobileMenu'), btn = document.getElementById('hamburger');
      if (menu.classList.contains('open') && !menu.contains(e.target) && !btn.contains(e.target)) closeMenu();
    });

    /* \u2500\u2500 FAQ \u2500\u2500 */
    function toggleFaq(el) {
      const item = el.closest('.faq-item'), isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    }

    /* \u2500\u2500 TYPING ANIMATION \u2500\u2500 */
    const typeWords = ['NEMOVITOST\u00cd','BYT\u016e','DOM\u016e','SKLEP\u016e','ZAHRAD','KANCEL\u00c1\u0158\u00cd'];
    let tIdx=0, tChar=0, tDel=false;
    const typeEl = document.getElementById('heroType');
    function typeStep() {
      if (!typeEl) return;
      const word = typeWords[tIdx];
      if (!tDel) { typeEl.textContent = word.slice(0,++tChar); if(tChar===word.length){tDel=true;setTimeout(typeStep,2200);}else setTimeout(typeStep,85); }
      else { typeEl.textContent = word.slice(0,--tChar); if(tChar===0){tDel=false;tIdx=(tIdx+1)%typeWords.length;setTimeout(typeStep,350);}else setTimeout(typeStep,45); }
    }
    setTimeout(typeStep, 2000);

    /* \u2500\u2500 ACTIVE NAV \u2500\u2500 */
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if(e.isIntersecting){ navLinks.forEach(a=>a.classList.remove('active')); const l=document.querySelector(`.nav-links a[href="#${e.target.id}"]`); if(l)l.classList.add('active'); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['uvod','sluzby','jak-to-funguje','nase-prace','recenze','faq','kontakt'].forEach(id=>{const el=document.getElementById(id);if(el)navObs.observe(el);});

    /* \u2500\u2500 COUNTER ANIMATION \u2500\u2500 */
    let countersDone = false;
    const statsObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !countersDone) {
        countersDone = true;
        document.querySelectorAll('.h-stat-num[data-target]').forEach(el => {
          const target = parseFloat(el.dataset.target), isDecimal = el.dataset.decimal==='1', span = el.querySelector('.cnt-num'), start = performance.now(), dur = 1600;
          function tick(now) { const p=Math.min((now-start)/dur,1), e2=1-Math.pow(1-p,3), val=e2*target; span.textContent=isDecimal?(val/10).toFixed(1):Math.floor(val); if(p<1)requestAnimationFrame(tick); }
          requestAnimationFrame(tick);
        });
      }
    }, { threshold: 0.5 });
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) statsObs.observe(statsEl);

    /* \u2500\u2500 BEFORE/AFTER SLIDER \u2500\u2500 */
    document.querySelectorAll('.ba-slider').forEach(slider => {
      const handle=slider.querySelector('.ba-handle'), afterWrap=slider.querySelector('.ba-after-wrap'), afterInner=slider.querySelector('.ba-after-inner'), hint=slider.querySelector('.ba-hint');
      let dragging=false;
      function initSize(){afterInner.style.width=slider.offsetWidth+'px';}
      initSize(); window.addEventListener('resize',initSize);
      function setPos(x){const rect=slider.getBoundingClientRect(),pct=Math.min(Math.max((x-rect.left)/rect.width,0.05),0.95);afterWrap.style.width=(pct*100)+'%';handle.style.left=(pct*100)+'%';if(hint)hint.style.opacity='0';}
      handle.addEventListener('mousedown',()=>dragging=true);
      window.addEventListener('mousemove',e=>{if(dragging)setPos(e.clientX);});
      window.addEventListener('mouseup',()=>dragging=false);
      handle.addEventListener('touchstart',e=>{dragging=true;e.preventDefault();},{passive:false});
      window.addEventListener('touchmove',e=>{if(dragging){setPos(e.touches[0].clientX);e.preventDefault();}},{passive:false});
      window.addEventListener('touchend',()=>dragging=false);
    });

    /* \u2500\u2500 CALCULATOR \u2500\u2500 */
    const calcState={type:null,size:null,timing:null};
    const prices={
      byt:{small:'3 000\u20138 000',medium:'8 000\u201316 000',large:'15 000\u201328 000',xlarge:'20 000\u201338 000'},
      dum:{small:'8 000\u201318 000',medium:'18 000\u201335 000',large:'30 000\u201355 000',xlarge:'40 000\u201375 000'},
      sklep:{small:'1 500\u20134 000',medium:'3 500\u20138 000',large:'7 000\u201314 000',xlarge:'10 000\u201320 000'},
      pozustalost:{small:'5 000\u201312 000',medium:'10 000\u201322 000',large:'18 000\u201335 000',xlarge:'25 000\u201350 000'},
      kancelar:{small:'4 000\u20139 000',medium:'8 000\u201318 000',large:'15 000\u201330 000',xlarge:'20 000\u201342 000'},
      zahrada:{small:'2 000\u20135 000',medium:'4 500\u201310 000',large:'8 000\u201318 000',xlarge:'12 000\u201328 000'},
    };
    const timings={urgent:'do 24\u201348 hodin',week:'tento t\u00fdden',later:'za v\u00edce ne\u017e t\u00fdden',flexible:'dle dohody'};
    function openCalc(){calcState.type=calcState.size=calcState.timing=null;document.querySelectorAll('.calc-opt').forEach(o=>o.classList.remove('sel'));document.querySelectorAll('.calc-next').forEach(b=>b.disabled=true);calcNext(1);document.getElementById('calcOverlay').classList.add('open');document.body.style.overflow='hidden';}
    function closeCalc(){document.getElementById('calcOverlay').classList.remove('open');document.body.style.overflow='';}
    function closeCalcOutside(e){if(e.target===document.getElementById('calcOverlay'))closeCalc();}
    function selectCalc(step,val,el){const key=step===1?'type':step===2?'size':'timing';calcState[key]=val;el.closest('.calc-options').querySelectorAll('.calc-opt').forEach(o=>o.classList.remove('sel'));el.classList.add('sel');document.getElementById('cNext'+step).disabled=false;}
    function calcNext(step){document.querySelectorAll('.calc-panel').forEach(p=>p.classList.remove('active'));document.getElementById('cStep'+step).classList.add('active');for(let i=1;i<=4;i++)document.getElementById('cp'+i).classList.toggle('done',i<step);if(step===4){const price=(prices[calcState.type]&&prices[calcState.type][calcState.size])||'2 000\u201375 000';document.getElementById('calcPrice').textContent=price+' K\u010d';document.getElementById('calcTiming').textContent=timings[calcState.timing]||'dle dohody';}}
    function calcBack(step){calcNext(step);}

    /* \u2500\u2500 COUNTDOWN \u2500\u2500 */
    function updateCountdown(){const el=document.getElementById('cdTimer');if(!el)return;const now=new Date(),day=now.getDay(),mins=now.getHours()*60+now.getMinutes();if(day>=1&&day<=5&&mins>=480&&mins<1080){const rem=1080-mins;el.textContent=' \u00b7 \u23f0 Dnes do '+Math.floor(rem/60)+':'+String(rem%60).padStart(2,'0');}else if(day===0||day===6){el.textContent=' \u00b7 \u1f4c5 So\u2013Ne pracujeme tak\u00e9';}else{el.textContent='';}}
    updateCountdown(); setInterval(updateCountdown,60000);

    /* \u2500\u2500 SCROLL FADE-IN \u2500\u2500 */
    const fadeEls=document.querySelectorAll('.svc-card,.why-card,.test-card,.step-item,.gallery-pair');
    const fadeObs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';}});},{threshold:0.08});
    fadeEls.forEach(el=>{el.style.opacity='0';el.style.transition='opacity .45s ease, transform .45s ease';el.style.transform='translateY(24px)';fadeObs.observe(el);});
    function toggleSvc(btn) {
      const card = btn.closest('.svc-card');
      card.classList.toggle('open');
    }
  