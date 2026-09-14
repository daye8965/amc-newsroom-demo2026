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
      '<form class="nr-search" onsubmit="return AMC.search(event)">',
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">',
      '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
      '<input type="search" placeholder="의료진·질환·검사명으로 검색" aria-label="뉴스룸 통합검색">',
      '</form>',
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
      '제작: 홍보팀 언론Unit · 내부 검토용',
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

  function ph(c1, c2, label, extra) {
    return '<div class="ph" style="--c1:' + c1 + ';--c2:' + c2 + ';' + (extra || '') + '">' +
      '<span>' + (label || '이미지 영역') + '</span></div>';
  }

  function search(e) {
    e.preventDefault();
    var v = e.target.querySelector('input').value.trim();
    toast(v
      ? '<b>' + v + '</b> — 제목·본문·의료진·질환·검사명 태그를 함께 검색합니다 (시연)'
      : '통합검색: 제목 / 본문 / 의료진 / 질환 / 검사·시술명 태그');
    return false;
  }

  /* ---------- 히어로 롤링 ---------- */
  function initHero() {
    var stage = document.querySelector('.hero-stage');
    if (!stage) return;
    var slides = stage.querySelectorAll('.hero-slide');
    var dots = stage.querySelectorAll('.hero-dots i');
    var i = 0, timer = null;

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      dots.forEach(function (d, k) { d.classList.toggle('on', k === i); });
    }
    function play() { timer = setInterval(function () { go(i + 1); }, 5200); }
    function stop() { clearInterval(timer); }

    stage.querySelector('.js-prev').addEventListener('click', function () { go(i - 1); });
    stage.querySelector('.js-next').addEventListener('click', function () { go(i + 1); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { go(k); }); });
    stage.addEventListener('mouseenter', stop);
    stage.addEventListener('mouseleave', play);
    go(0); play();
  }

  window.AMC = {
    toast: toast,
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
