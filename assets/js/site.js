/* =========================================================
   공통 스크립트 — 헤더/내비 주입, 개편 포인트 주석 토글, 유틸
   ========================================================= */
(function () {
  'use strict';

  var PAGES = [
    { href: 'start.html', label: '시연 시작' },
    { href: 'index.html', label: '뉴스룸 메인' },
    { href: 'article.html', label: '기사 상세' },
    { href: 'press.html', label: '프레스센터' },
    { href: 'admin.html', label: '업로드 페이지(CMS)' },
    { href: 'app.html', label: '앱 화면' },
    { href: 'compare.html', label: '현재 vs 개편안' },
    { href: 'guide.html', label: '개편 포인트 정리' }
  ];

  function currentPage() {
    var f = location.pathname.split('/').pop();
    return f === '' ? 'index.html' : f;
  }

  /* ---------- 상단 레이아웃 주입 ---------- */
  function buildTop(opts) {
    opts = opts || {};
    var here = currentPage();
    var nav = (window.AMC_DATA && window.AMC_DATA.nav) || [];

    var demoNav = PAGES.map(function (p) {
      return '<a href="' + p.href + '"' + (p.href === here ? ' class="on"' : '') + '>' + p.label + '</a>';
    }).join('');

    /* 검색창 아래 주요 태그 — 게시물마다 칩을 붙이는 대신 한 줄로 모아 노출 */
    var tagRow = ((window.AMC_DATA && window.AMC_DATA.topTags) || []).map(function (t) {
      return '<a href="#" data-tag="' + t + '" onclick="return AMC.tag(this.dataset.tag)">#' + t + '</a>';
    }).join('');

    var nrNav = nav.map(function (n) {
      var cls = [];
      if (n.id === opts.active) cls.push('on');
      if (n.isNew) cls.push('new');
      return '<a href="' + n.href + '"' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>' + n.label + '</a>';
    }).join('');

    return [
      '<div class="demobar"><div class="wrap">',
      '<div><b>시연용 프로토타입</b> · 2026 뉴스룸 웹·앱 통합개편 시안 ',
      '<span class="demobar-note">— 실제 서비스 화면이 아니며 기사·수치는 모두 가상 예시입니다.</span></div>',
      '<nav>' + demoNav + '</nav>',
      '</div></div>',

      '<div class="hospital-gnb"><div class="wrap">',
      '<div class="hg-logo">서울아산병원</div>',
      '<ul>',
      '<li>진료과·의료진</li><li>진료안내</li><li>건강정보</li><li>병원안내</li>',
      '<li class="on">뉴스룸</li>',
      '</ul>',
      '<div class="hg-url"><s>news.amc.seoul.kr</s> &nbsp;→&nbsp; www.amc.seoul.kr/news/</div>',
      '</div></div>',

      '<header class="nr-header"><div class="wrap">',
      '<a class="nr-logo" href="index.html">',
      '<span class="ci" aria-hidden="true"></span>',
      '<span class="lockup"><b>서울아산병원 <span>뉴스룸</span></b>',
      '<small>Asan Medical Center Newsroom</small></span></a>',
      '<div class="nr-searchwrap">',
      '<form class="nr-search" onsubmit="return AMC.search(event)">',
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">',
      '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
      '<input type="search" placeholder="의료진·질환·검사명으로 검색" aria-label="뉴스룸 통합검색">',
      '</form>',
      '<div class="nr-tags" aria-label="주요 태그">' + tagRow + '</div>',
      '</div>',
      '<div class="nr-utils">',
      '<a href="#" onclick="return AMC.toast(\'마이페이지 &gt; 스크랩한 콘텐츠로 이동합니다 (시연)\')">☆ 스크랩</a>',
      '<a href="#" onclick="return AMC.toast(\'영문 뉴스룸으로 이동합니다 (시연)\')">EN</a>',
      '</div>',
      '</div></header>',

      '<nav class="nr-nav"><div class="wrap">' + nrNav + '</div></nav>'
    ].join('');
  }

  /* ---------- 푸터 ---------- */
  function buildFooter() {
    return [
      '<footer class="footer"><div class="wrap">',
      '<div class="cols">',
      '<div><h5>뉴스룸</h5><ul><li>뉴스</li><li>헬스</li><li>피플</li><li>리서치·AI</li></ul></div>',
      '<div><h5>프레스센터</h5><ul><li>보도자료</li><li>미디어 라이브러리</li><li>Fast Facts</li><li>언론문의</li></ul></div>',
      '<div><h5>바로가기</h5><ul><li>서울아산병원 홈</li><li>진료예약</li><li>건강TV</li><li>English Newsroom</li></ul></div>',
      '</div>',
      '<div class="fine">',
      '본 페이지는 <b>2026 뉴스룸 웹·앱 통합개편</b> 논의를 위해 제작한 <b>시연용 프로토타입</b>입니다. ',
      '실제 서울아산병원 뉴스룸 서비스가 아니며, 게시된 기사·인물·수치는 화면 구성 확인을 위한 가상 예시입니다.<br>',
      '홍보팀 이다예 / 내부 검토용',
      '</div>',
      '</div></footer>'
    ].join('');
  }

  /* ---------- 개편 포인트 토글 ---------- */
  function initAnnotations() {
    var count = document.querySelectorAll('.annot').length;
    if (!count) return;
    var btn = document.createElement('button');
    btn.className = 'annot-fab';
    btn.innerHTML = '개편 포인트 <span class="cnt">' + count + '</span>';
    btn.addEventListener('click', function () {
      var on = document.body.classList.toggle('annot-on');
      btn.innerHTML = (on ? '포인트 숨기기' : '개편 포인트') + ' <span class="cnt">' + count + '</span>';
      try { sessionStorage.setItem('amc-annot', on ? '1' : '0'); } catch (e) {}
    });
    document.body.appendChild(btn);
    try {
      if (sessionStorage.getItem('amc-annot') === '1') btn.click();
    } catch (e) {}
  }

  /* ---------- 유틸 ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = msg;
    toastEl.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('on'); }, 2400);
    return false;
  }

  /* 썸네일 자리.
     img 를 주면 실제 사진을 깔고, 없거나 파일을 못 찾으면 그라데이션 자리표시로 남는다.
     (시연 장소에서 사진 파일이 빠져도 화면이 깨지지 않게) */
  function ph(c1, c2, label, extra, img) {
    /* lazy 는 쓰지 않는다 - 롤링의 복제 슬라이드와 ZIP 오프라인 시연에서
       사진이 늦게 뜨거나 아예 안 뜨는 일이 생긴다 (25장 규모라 부담도 없다) */
    var pic = img ? '<img src="' + img + '" alt="">' : '';
    return '<div class="ph' + (img ? ' has-img' : '') + '"' +
      ' style="--c1:' + c1 + ';--c2:' + c2 + ';' + (extra || '') + '">' +
      pic + '<span>' + (label || '이미지 영역') + '</span></div>';
  }

  /* 사진 파일이 없으면 그라데이션 자리표시로 되돌린다.
     error 는 버블링하지 않으므로 캡처 단계에서 받는다. */
  document.addEventListener('error', function (e) {
    var img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    var box = img.parentNode;
    if (box && box.classList && box.classList.contains('ph')) {
      box.classList.remove('has-img');
      img.remove();
    }
  }, true);

  function search(e) {
    e.preventDefault();
    var v = e.target.querySelector('input').value.trim();
    toast(v
      ? '<b>' + v + '</b> — 제목·본문·의료진·질환·검사명 태그를 함께 검색합니다 (시연)'
      : '통합검색: 제목 / 본문 / 의료진 / 질환 / 검사·시술명 태그');
    return false;
  }

  /* ---------- 히어로 — 가운데 한 장 + 양옆 미리보기 ----------
     원본 n장을 세 벌 이어 붙이고 가운데 벌에서 시작한다.
     끝에 닿으면 애니메이션이 끝난 뒤 같은 장의 가운데 벌 위치로 조용히 옮겨,
     마지막에서 처음으로 되감기는 움직임이 보이지 않게 한다. */
  function initHero() {
    Array.prototype.forEach.call(document.querySelectorAll('.hero-stage'), buildHero);
  }

  function buildHero(stage) {
    var track = stage.querySelector('.hero-track');
    if (!track || !track.children.length) return;

    /* 점은 data-dots 로 지정한 곳을 쓰고, 없으면 같은 부모 안에서 찾는다 */
    var dotBox = stage.getAttribute('data-dots')
      ? document.querySelector(stage.getAttribute('data-dots'))
      : stage.parentNode.querySelector('.hero-dots');
    var dots = dotBox ? Array.prototype.slice.call(dotBox.querySelectorAll('i')) : [];

    var n = track.children.length;
    track.innerHTML = track.innerHTML + track.innerHTML + track.innerHTML;
    var all = Array.prototype.slice.call(track.children);
    var i = n, timer = null, curX = 0;

    function place(animate) {
      if (!animate) track.style.transition = 'none';
      var w = all[0].getBoundingClientRect().width;
      var gap = parseFloat(getComputedStyle(track).columnGap || 0) || 0;
      var x = i * (w + gap) - (stage.clientWidth - w) / 2;
      curX = -x;
      track.style.transform = 'translateX(' + curX + 'px)';
      if (!animate) { void track.offsetWidth; track.style.transition = ''; }

      all.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      var real = ((i % n) + n) % n;
      dots.forEach(function (d, k) { d.classList.toggle('on', k === real); });
    }

    /* 바깥 벌에 있으면 가운데 벌의 같은 장으로 조용히 옮긴다 */
    function normalize() {
      if (i < n || i >= n * 2) { i = n + (((i % n) + n) % n); place(false); }
    }

    /* transitionend 만 믿으면 안 된다.
       탭이 뒤에 있거나 렌더링이 멈춘 상태에서는 이벤트가 오지 않아
       i 가 계속 커지고, 결국 어느 슬라이드에도 .on 이 붙지 않는다.
       타이머를 보험으로 같이 건다 (둘 중 먼저 오는 쪽이 처리, 중복 호출은 무해). */
    var resetTimer = null;
    function go(step) {
      i += step;
      place(true);
      clearTimeout(resetTimer);
      resetTimer = setTimeout(normalize, 520);
    }

    track.addEventListener('transitionend', function (e) {
      if (e.target !== track || e.propertyName !== 'transform') return;
      clearTimeout(resetTimer);
      normalize();
    });

    /* 옆에 걸친 기사를 누르면 그 기사로 넘어간다 (민 직후의 클릭은 무시) */
    var swiped = false;
    all.forEach(function (s, k) {
      s.addEventListener('click', function () {
        if (swiped) return;
        if (k !== i) go(k - i);
      });
    });

    /* ----- 손으로 옆으로 밀어 넘기기 ----- */
    var sx = 0, sy = 0, dx = 0, dragging = false, decided = false, sideways = false;

    track.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      stop();
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      dx = 0; dragging = true; decided = false; sideways = false; swiped = false;
      track.style.transition = 'none';
    }, { passive: true });

    track.addEventListener('touchmove', function (e) {
      if (!dragging) return;
      var x = e.touches[0].clientX - sx;
      var y = e.touches[0].clientY - sy;

      /* 첫 움직임의 방향으로 가로/세로를 정한다 — 세로면 페이지 스크롤에 양보 */
      if (!decided) {
        if (Math.abs(x) < 6 && Math.abs(y) < 6) return;
        decided = true;
        sideways = Math.abs(x) > Math.abs(y);
        if (!sideways) { dragging = false; track.style.transition = ''; return; }
      }

      e.preventDefault();
      dx = x;
      track.style.transform = 'translateX(' + (curX + dx) + 'px)';
    }, { passive: false });

    function release() {
      if (!dragging) return;
      dragging = false;
      swiped = Math.abs(dx) > 8;
      if (swiped) setTimeout(function () { swiped = false; }, 300);
      track.style.transition = '';
      var w = all[0].getBoundingClientRect().width;
      var need = Math.min(70, w * 0.18);
      if (dx < -need) go(1);
      else if (dx > need) go(-1);
      else place(true);
      play();
    }
    track.addEventListener('touchend', release);
    track.addEventListener('touchcancel', release);

    var prev = stage.querySelector('.js-prev');
    var next = stage.querySelector('.js-next');
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    dots.forEach(function (d, k) {
      d.addEventListener('click', function () { go(k - (((i % n) + n) % n)); });
    });

    function play() { stop(); timer = setInterval(function () { go(1); }, 5200); }
    function stop() { clearInterval(timer); }
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);
    window.addEventListener('resize', function () { place(false); });

    place(false);
    play();
  }

  function tag(name) {
    return toast('<b>#' + name + '</b> 태그가 붙은 콘텐츠를 모아 보여줍니다 (시연)');
  }

  window.AMC = {
    toast: toast,
    tag: tag,
    ph: ph,
    search: search,
    layout: function (opts) {
      var top = document.getElementById('site-top');
      if (top) top.innerHTML = buildTop(opts);
      var foot = document.getElementById('site-footer');
      if (foot) foot.outerHTML = buildFooter();
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    initHero();
    initAnnotations();
  });
})();
