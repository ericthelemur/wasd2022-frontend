import m from 'mithril';
import gsap from 'gsap';

import './beach.css';

const textShadowDay = '0px 0px 3px rgb(0, 0, 0, 1)';
const textShadowNight = '0px 0px 3px rgb(0, 0, 0, 0)';

export default class BeachBackground {
  view(vnode) {
    return m('#beach-background', [
      m('.beach.night-sky'),
      m('.beach.night-stars'),
      m('.beach.night-foreground'),
      m('#lighthouse', [
        m('.beach.night-lighthouse-inner'),
        m('.beach.night-lighthouse-outer'),
      ]),
      m('.beach.day-sky'),
      m('.beach.day-foreground'),
    ]);
  }

  oncreate(vnode) {
    const rep = vnode.attrs.backgroundModeRep;

    this.setuplightHouseAnimation();

    rep.on('change', (newMode, oldMode) => {
      // hard set to state on init when no old more
      if (!oldMode) {
        this.resetAjustments();

        if (newMode === 'day') {
          this.setDay();
          return;
        }

        if (newMode === 'night') {
          this.setNight();
          return;
        }
      }

      if (newMode === 'day') {
        this.transitionDay();
        return;
      }

      if (newMode === 'night') {
        this.transitionNight();
        return;
      }
    });
  }

  resetAjustments() {
    gsap.set('.beach.day-foreground',   { filter: 'brightness(1)' });
    gsap.set('.beach.day-sky',          { filter: 'brightness(1)' });
    gsap.set('.beach.night-foreground', { filter: 'brightness(1)' });
    gsap.set('.beach.night-sky',        { filter: 'brightness(1)' });
  }

  setDay() {
    gsap.set('.beach.night-stars',    { opacity: 0 });
    gsap.set('#lighthouse',           { opacity: 0 });
    gsap.set('.beach.day-foreground', { opacity: 1 });
    gsap.set('.beach.day-sky',        { opacity: 1 });
    gsap.set(document.body,           { textShadow: textShadowDay });
    gsap.set('#night-element',        { opacity: 0 });
    gsap.set('#day-element',          { opacity: 1 });
  }

  setNight() {
    gsap.set('.beach.night-stars',    { opacity: 1 });
    gsap.set('#lighthouse',           { opacity: 1 });
    gsap.set('.beach.day-foreground', { opacity: 0 });
    gsap.set('.beach.day-sky',        { opacity: 0 });
    gsap.set(document.body,           { textShadow: textShadowNight });
    gsap.set('#night-element',        { opacity: 1 });
    gsap.set('#day-element',          { opacity: 0 });
  }

  transitionDay() {
    const tl = gsap.timeline({ paused: true });
    tl.to('.beach.night-stars',          { opacity: 0, duration: 3 });
    tl.set('#lighthouse',                { opacity: 0 });

    tl.fromTo('.beach.night-sky',        { filter: 'brightness(1)' }, { filter: 'brightness(1.9)', duration: 3 });

    tl.to(document.body,    { textShadow: textShadowDay, duration: 5 });
    tl.to('#night-element', { opacity: 0, duration: 5 }, '<');
    tl.to('#day-element',   { opacity: 1, duration: 5 }, '<');

    tl.to('.beach.day-foreground',       { opacity: 1, duration: 10 }, '<');
    tl.to('.beach.day-sky',              { opacity: 1, duration: 6 }, '<+1');

    this.resetAjustments();

    tl.play();
  }

  transitionNight() {
    const tl = gsap.timeline({ paused: true });

    tl.fromTo('.beach.day-foreground', { filter: 'brightness(1)' }, { filter: 'brightness(0.2)', duration: 3 });
    tl.fromTo('.beach.day-sky',        { filter: 'brightness(1)' }, { filter: 'brightness(0.2)', duration: 3 }, '<');
    tl.to('.beach.day-foreground',     { opacity: 0, duration: 6 }, '>-1');
    tl.to('.beach.day-sky',            { opacity: 0, duration: 6 }, '<');

    tl.to(document.body,    { textShadow: textShadowNight, duration: 5 }, '<');
    tl.to('#night-element', { opacity: 1, duration: 5 }, '<');
    tl.to('#day-element',   { opacity: 0, duration: 5 }, '<');

    // show lighthouse anim
    tl.to('#lighthouse',               { opacity: 1, duration: 2 });
    tl.to('.beach.night-stars', { opacity: 1, duration: 5 });

    this.resetAjustments();

    tl.play();
  }

  setuplightHouseAnimation() {
    const tl = gsap.timeline({ paused: true, repeat: -1 });
    tl.fromTo('.beach.night-lighthouse-outer', { opacity: 1 }, {
      opacity: 0,
      duration: 2,
      ease: 'circ.In',
    });
    tl.to('.beach.night-lighthouse-inner', {
      opacity: 1,
      duration: 0.25,
      ease: 'circ.In',
      repeat: 1,
      yoyo: true,
      yoyoEase: true,
    });
    tl.fromTo('.beach.night-lighthouse-outer', { opacity: 0 }, {
      opacity: 1,
      duration: 2,
      ease: 'circ.In',
    });
    tl.play();
  }
}
