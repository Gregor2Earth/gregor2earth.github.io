// Builds zen.html from index.html: same content and scripts, a calm stylesheet, one scrolling column.
// Run after every content change:  node build-zen.js
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, 'index.html'), OUT = path.join(__dirname, 'zen.html');
let s = fs.readFileSync(SRC, 'utf8');
const R = (a, b) => { if (!s.includes(a)) throw new Error('build-zen: missing ' + a.slice(0, 70)); s = s.split(a).join(b); };

const CSS = `
:root{
  --bg:#f7f5f0; --bg2:#fffdf8; --card:#fffdf8; --line:#e5e1d7; --line2:#d6d1c4;
  --ink:#2a2a27; --body:#4a4944; --mute:#7c7a72; --dim:#a6a399;
  --accent:#5f8a72; --blue:#5f8a72; --green:#5f8a72; --sky:#7d93a8; --teal:#5f8a72; --onaccent:#fff;
  --navbg:rgba(247,245,240,.88); --pillbg:transparent; --skyglow:#ece8df; --star:42,42,39; --link-a:.2;
  --radius:14px; --sans:"Exo 2",system-ui,sans-serif; --serif:"Exo 2",system-ui,sans-serif; --mono:"JetBrains Mono",ui-monospace,monospace;
  color-scheme:light;
}
:root[data-theme="dark"]{
  --bg:#151613; --bg2:#1b1c19; --card:#1b1c19; --line:#2b2c28; --line2:#3a3b36;
  --ink:#e9e7e0; --body:#c9c6bd; --mute:#9b988f; --dim:#6f6d66;
  --accent:#9fc2ad; --blue:#9fc2ad; --green:#9fc2ad; --sky:#9db4c6; --teal:#9fc2ad; --onaccent:#151613;
  --navbg:rgba(21,22,19,.88); --skyglow:#1f201d; --star:233,231,224; color-scheme:dark;
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --bg:#151613; --bg2:#1b1c19; --card:#1b1c19; --line:#2b2c28; --line2:#3a3b36;
    --ink:#e9e7e0; --body:#c9c6bd; --mute:#9b988f; --dim:#6f6d66;
    --accent:#9fc2ad; --blue:#9fc2ad; --green:#9fc2ad; --sky:#9db4c6; --teal:#9fc2ad; --onaccent:#151613;
    --navbg:rgba(21,22,19,.88); --skyglow:#1f201d; --star:233,231,224; color-scheme:dark;
  }
}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--bg);color:var(--ink);font-family:var(--sans);font-weight:300;line-height:1.75;-webkit-font-smoothing:antialiased;transition:background .5s,color .5s}
a{color:inherit}
::selection{background:var(--accent);color:var(--onaccent)}
.wrap{max-width:720px;margin:0 auto;padding:0 24px}
/* decoration from the classic version is not used here */
#progress,#glow,#sky,nav,.scroll,.print-qr,#route,.legs,.marquee,#values .sky,.board,.how-line,.paper,footer [data-i18n="egg"]{display:none!important}
.print-only{display:block}

/* controls */
.ctrl{position:fixed;top:16px;right:16px;z-index:45;display:flex;gap:8px;align-items:center}
.seg{position:relative;display:flex;border:1px solid var(--line2);border-radius:999px;padding:2px;background:var(--bg)}
.seg button{position:relative;z-index:1;width:38px;font:500 12px var(--mono);padding:5px 0;border:0;background:none;color:var(--mute);cursor:pointer;transition:color .3s}
.seg button.on{color:var(--bg)}
.seg-pill{position:absolute;top:2px;bottom:2px;left:2px;width:38px;border-radius:999px;background:var(--ink);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.seg[data-l="sl"] .seg-pill{transform:translateX(38px)}
.switch{position:relative;width:56px;height:30px;flex:none;border-radius:999px;border:1px solid var(--line2);background:var(--bg);cursor:pointer;padding:0}
.switch .ico{position:absolute;top:50%;transform:translateY(-50%);font-size:12px;line-height:1;color:var(--dim)}
.switch .sun{left:9px}.switch .moon{right:9px}
.switch .knob{position:absolute;top:2px;left:2px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;background:var(--ink);color:var(--bg);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
.switch[data-mode="dark"] .knob{transform:translateX(26px)}

/* header */
#hero{display:block;padding:120px 0 44px;text-align:center}
.hero-in{display:flex;flex-direction:column;align-items:center}
.portrait{width:96px;height:96px;border-radius:50%;overflow:hidden;margin-bottom:28px}
.portrait>div{width:100%;height:100%}
.portrait img{width:100%;height:100%;object-fit:cover;filter:saturate(.8)}
.name{font-size:clamp(36px,6vw,56px);font-weight:300;letter-spacing:.01em;line-height:1.15}
.name .row{display:inline-block;margin:0 .1em}
.name .row span{display:inline-block}
.name .row:nth-child(2) span{color:var(--accent)}
.tag{margin-top:18px;font-size:clamp(15px,1.8vw,18px);color:var(--mute);white-space:nowrap}
.tag b{font-weight:500;color:var(--ink)}
#rot{color:var(--accent);font-style:italic;border-right:1px solid var(--accent);padding-right:3px}
.hero-meta{margin-top:16px;display:flex;gap:18px;justify-content:center;flex-wrap:wrap}
.pill{font-size:13px;color:var(--mute);letter-spacing:.04em}
.pill i{font-style:normal;color:var(--accent)}

/* version tabs (Rocket | Zen) */
.vswitch{position:fixed;top:16px;left:16px;z-index:45;display:flex;border:1px solid var(--line2);border-radius:999px;padding:2px;background:var(--bg)}
.vswitch a{font:400 13px var(--sans);letter-spacing:.04em;text-decoration:none;color:var(--mute);padding:5px 14px;border-radius:999px;transition:color .3s,background .3s;white-space:nowrap}
.vswitch a:hover{color:var(--ink)}
.vswitch a.on{background:var(--ink);color:var(--bg)}

/* sections: one calm scrolling column, separated by thin lines */
section{padding:0 0 88px}
section:not(#hero) .wrap{border-top:1px solid var(--line);padding-top:72px}
.eyebrow{font:400 11px var(--mono);letter-spacing:.3em;text-transform:uppercase;color:var(--dim);margin-bottom:16px;text-align:center}
h2{font-size:clamp(26px,3.6vw,36px);font-weight:300;line-height:1.3;margin-bottom:52px;text-align:center}
h2 em,.serif{font-style:italic;color:var(--accent);font-weight:300}

/* about */
#about .big{font-size:clamp(19px,2.2vw,23px);line-height:1.85;font-weight:300;color:var(--body)}
#about .big .w{opacity:1}
#about .big .hl{font-style:italic;color:var(--accent)}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:72px}
.stat{display:flex;flex-direction:column;align-items:center;text-align:center}
.stat .ring{position:relative;width:112px;height:112px;display:grid;place-items:center}
.stat svg{position:absolute;inset:0;transform:rotate(-90deg)}
.stat circle{fill:none;stroke-width:2}
.stat .track{stroke:var(--line)}
.stat .arc{stroke:var(--accent);stroke-linecap:round;stroke-dasharray:440;stroke-dashoffset:440;transition:stroke-dashoffset 1.8s cubic-bezier(.2,.8,.2,1)}
.stat.in .arc{stroke-dashoffset:110}
.stat b{display:block;font-size:30px;font-weight:300;line-height:1}
.stat .u{display:block;font:400 10px var(--mono);letter-spacing:.15em;text-transform:uppercase;color:var(--mute);margin-top:4px}
.stat .lbl{margin-top:12px;font-size:13px;color:var(--mute);line-height:1.5;max-width:160px}

/* journey */
.pass{padding:40px 0;border-top:1px solid var(--line)}
.pass:first-of-type{border-top:0;padding-top:0}
.ph{font:400 11px var(--mono);letter-spacing:.25em;text-transform:uppercase;color:var(--dim);margin-bottom:10px}
.route-code{display:flex;align-items:center;gap:10px;font-size:14px;color:var(--mute);margin-bottom:6px}
.route-code b{font-weight:400}
.route-code .dash{width:28px;height:1px;background:var(--line2)}
.pass h3{font-size:22px;font-weight:400}
.pass .co{color:var(--mute);font-size:15px;margin:2px 0 18px}
.pass ul{list-style:none}
.pass li{position:relative;padding-left:22px;margin:10px 0;color:var(--body);font-size:16px}
.pass li::before{content:"";position:absolute;left:0;top:.85em;width:10px;height:1px;background:var(--accent)}
.pass li strong{font-weight:500;color:var(--ink)}
.meta{display:flex;flex-wrap:wrap;gap:8px 36px;margin-top:22px;font-size:14px}
.meta dt{font:400 10px var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--dim)}
.meta dd{color:var(--body)}
.meta .live{color:var(--accent)}

/* how I work */
.step{display:grid;grid-template-columns:56px 1fr;column-gap:18px;padding:30px 0;border-top:1px solid var(--line)}
.how-line+.step{border-top:0;padding-top:0}
.step .num{grid-row:1 / span 3;font-size:22px;font-weight:300;font-style:italic;color:var(--accent);line-height:1.4}
.step h3{font-size:20px;font-weight:400}
.step p{color:var(--body);margin-top:4px}
.step .ex{margin-top:12px;font-size:14px;color:var(--mute)}
.step .ex span{display:block;font:400 10px var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--dim);margin-bottom:4px}

/* skills */
.kit{display:flex;flex-direction:column;gap:44px}
.box h4{font:400 11px var(--mono);letter-spacing:.25em;text-transform:uppercase;color:var(--dim);margin-bottom:16px;text-align:center}
.chips,.int-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 10px}
.chip,.int-chips span{font-size:15px;color:var(--body);padding:6px 14px;border:1px solid var(--line);border-radius:999px;transition:border-color .3s,color .3s}
.chip:hover,.int-chips span:hover{border-color:var(--accent);color:var(--ink)}
.tools-line{text-align:center;color:var(--mute);font-size:15px;line-height:1.9}
.tools-line b{font-weight:500;color:var(--ink)}

/* education */
.passport{display:flex;flex-direction:column}
.stamp{display:grid;grid-template-columns:1fr auto;grid-template-areas:"b yr" "em yr" "small yr";column-gap:24px;padding:24px 0;border-top:1px solid var(--line)}
.stamp:first-child{border-top:0;padding-top:0}
.stamp b{grid-area:b;font-size:18px;font-weight:400}
.stamp em{grid-area:em;font-style:normal;color:var(--body)}
.stamp small{grid-area:small;font:400 11px var(--mono);letter-spacing:.2em;text-transform:uppercase;color:var(--dim);margin-top:4px}
.stamp .yr{grid-area:yr;align-self:center;font-size:15px;color:var(--mute)}
.langs{display:flex;gap:48px;justify-content:center;flex-wrap:wrap;margin-top:56px}
.lang{display:flex;gap:16px;align-items:center}
.lang b{font-weight:400;font-size:17px}.lang span{font-size:13px;color:var(--mute)}
.meter{display:flex;gap:3px}.meter i{width:4px;height:12px;border-radius:2px;background:var(--line2)}.meter i.on{background:var(--accent)}

/* values */
#printValues{display:flex!important;flex-wrap:wrap;justify-content:center;gap:14px 30px;font-size:clamp(18px,2.2vw,22px);color:var(--body);margin-bottom:64px}
#printValues span:nth-child(3n+2){color:var(--accent)}
.interests{text-align:center;padding-top:48px;border-top:1px solid var(--line)}
.interests h3{font-size:20px;font-weight:400;margin-bottom:20px}
.interests h3 em{font-style:italic;color:var(--accent);font-weight:400}
.int-chips span{font-size:14px;padding:5px 13px}
.int-chips span.more{border-style:dashed;color:var(--mute)}

/* contact */
#contact h2{margin-bottom:28px}
.contact-line{text-align:center;color:var(--body);font-size:17px;margin-bottom:36px}
.contact-line b{color:var(--accent);font-weight:400}
.cta{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.btn{font:400 15px var(--sans);text-decoration:none;padding:12px 22px;border:1px solid var(--line2);border-radius:999px;background:none;color:var(--ink);cursor:pointer;transition:border-color .3s}
.btn:hover{border-color:var(--accent)}
.btn.primary{background:var(--ink);color:var(--bg);border-color:var(--ink)}

footer{border-top:1px solid var(--line);padding:28px 0;font:400 12px var(--mono);color:var(--dim)}
footer .wrap{max-width:960px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
footer a.alt{color:var(--accent);text-decoration:none}footer a.alt:hover{text-decoration:underline}
kbd{border:1px solid var(--line2);border-radius:3px;padding:0 5px}
#toast{position:fixed;bottom:24px;left:50%;transform:translate(-50%,100px);background:var(--ink);color:var(--bg);font-size:13px;padding:10px 18px;border-radius:999px;transition:transform .4s;z-index:60}
#toast.show{transform:translate(-50%,0)}

@media (max-width:700px){
  #hero{padding-top:84px}
  .ctrl{top:10px;right:10px}
  .vswitch{top:10px;left:10px}
  .stats{grid-template-columns:1fr 1fr;row-gap:32px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition-duration:.01ms!important;transition-delay:0s!important}
}
@media print{
  .vswitch,.ctrl,footer,.cta{display:none!important}
  section{padding:14px 0}section:not(#hero) .wrap{padding-top:14px}
  #hero{padding:0 0 14px}
  .stat .arc{stroke-dashoffset:110!important}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact}
}
`;

// 1. stylesheet
const a = s.indexOf('<style>'), b = s.indexOf('</style>');
if (a < 0 || b < 0) throw new Error('build-zen: <style> not found');
s = s.slice(0, a) + '<style>' + CSS + s.slice(b);

// 2. identity of this page
R('<title>Gregor Skok — Product Creator</title>', '<title>Gregor Skok — Product Creator · Zen</title>');
R('<link rel="canonical" href="https://gregor2earth.github.io/">', '<link rel="canonical" href="https://gregor2earth.github.io/zen.html">');
R('<meta property="og:url" content="https://gregor2earth.github.io/">', '<meta property="og:url" content="https://gregor2earth.github.io/zen.html">');
R('<a href="index.html" role="tab" aria-selected="true" class="on" data-i18n="v1">', '<a href="index.html" role="tab" aria-selected="false" data-i18n="v1">');
R('<a href="zen.html" role="tab" aria-selected="false" data-i18n="v2">', '<a href="zen.html" role="tab" aria-selected="true" class="on" data-i18n="v2">');

fs.writeFileSync(OUT, s);
console.log('zen.html written (' + s.length + ' bytes)');
