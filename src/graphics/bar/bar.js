import m from 'mithril';
import gsap from 'gsap';
import moment from 'moment';

import '../common.css';
import './bar.css';

class Ticker extends EventTarget {
  constructor(intervalMs) {
    super();

    if (typeof intervalMs !== 'number') {
        throw new TypeError('Expected number');
    }

    this.intervalMs = intervalMs;
  }

  start() {
    this.ticker = setInterval(this.tick.bind(this), this.intervalMs);
  }

  stop() {
    clearInterval(this.ticker);
  }

  tick() {
    this.dispatchEvent(new Event('tick'));
  }
}

class CTA {
  view(vnode) {
    return m('.cta', vnode.attrs.ctas.map(c => m('.cta-text', c)));
  }

  oncreate(vnode) {
    const ctas = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1 });

    ctas.forEach((cta) => {
      tl.from(cta, { opacity: 0 });
      tl.to({}, vnode.attrs.hold || 2, {});
      tl.to(cta, { opacity: 0 });
    });

    this.anim = tl;
  }

  onremove(vnode) {
    if (this.anim) {
      this.anim.kill();
    }
  }
}

export default class BarComponent {
  view(vnode) {
    return m('.bar', [
      /*
      m('.name', [
        m('.bar-logo.wasd-icon'),
        m('span', 'WASD 2021'),
      ]),
      m('.v-space'),
      */
      m('.donos', [
        m('.bar-logo.special-effect'),
        m('span', `£${vnode.attrs.total}`),
      ]),
      m('.bar-v-space'),
      m(CTA, {
        hold: 30,
        ctas: [
        'This is Warwick\'s Awesome Speedruns & Demos SUMMER 2021',
        'See the full schedule at warwickspeed.run/schedule',
        'WASD SUMMER 2021 is raising money for SpecialEffect',
        'Donate now at warwickspeed.run/donate',
        ]
      }),
      m('.bar-v-space'),
      m('span', moment().format('HH:mm')),
    ]);
  }

  oncreate(vnode) {
    this.ticker = new Ticker(5000); // 5 seconds
    this.ticker.addEventListener('tick', () => { m.redraw(); });
    this.ticker.start();
  }

  onremove(vnode) {
    this.ticker.stop();
  }
}
