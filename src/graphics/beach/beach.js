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

    // setup lighthouse anim
    const lighthouseTl = gsap.timeline({ paused: true, repeat: -1 });
    lighthouseTl.fromTo('.beach.night-lighthouse-outer', { opacity: 1 }, {
      opacity: 0,
      duration: 2,
      ease: 'circ.In',
    });
    lighthouseTl.to('.beach.night-lighthouse-inner', {
      opacity: 1,
      duration: 0.25,
      ease: 'circ.In',
      repeat: 1,
      yoyo: true,
      yoyoEase: true,
    });
    lighthouseTl.fromTo('.beach.night-lighthouse-outer', { opacity: 0 }, {
      opacity: 1,
      duration: 2,
      ease: 'circ.In',
    });
    lighthouseTl.play();

    rep.on('change', (newMode, oldMode) => {
      console.log(`MODE CHANGE ${oldMode} -> ${newMode}`);

      // hard set to state on init when no old more
      if (!oldMode) {
        // reset
        gsap.set('.beach.day-foreground',   { filter: 'brightness(1)' });
        gsap.set('.beach.day-sky',          { filter: 'brightness(1)' });
        gsap.set('.beach.night-foreground', { filter: 'brightness(1)' });
        gsap.set('.beach.night-sky',        { filter: 'brightness(1)' });

        if (newMode === 'day') {
          gsap.set('.beach.night-stars',    { opacity: 0 });
          gsap.set('#lighthouse',           { opacity: 0 });
          gsap.set('.beach.day-foreground', { opacity: 1 });
          gsap.set('.beach.day-sky',        { opacity: 1 });
          gsap.set(document.body, { textShadow: textShadowDay });
          return;
        }

        if (newMode === 'night') {
          gsap.set('.beach.night-stars',    { opacity: 1 });
          gsap.set('#lighthouse',           { opacity: 1 });
          gsap.set('.beach.day-foreground', { opacity: 0 });
          gsap.set('.beach.day-sky',        { opacity: 0 });
          gsap.set(document.body, { textShadow: textShadowNight });
          return;
        }
      }

      if (newMode === 'day') {
        const tl = gsap.timeline({ paused: true });
        tl.to('.beach.night-stars',          { opacity: 0, duration: 3 });
        tl.set('#lighthouse',                { opacity: 0 });

        tl.fromTo('.beach.night-sky',        { filter: 'brightness(1)' }, { filter: 'brightness(1.9)', duration: 3 });

        tl.set(document.body, { textShadow: textShadowDay, duration: 5 });

        tl.to('.beach.day-foreground',       { opacity: 1, duration: 10 }, '<');
        tl.to('.beach.day-sky',              { opacity: 1, duration: 6 }, '<+1');

        tl.set('.beach.night-foreground',    { filter: 'brightness(1)' });
        tl.set('.beach.night-sky',           { filter: 'brightness(1)' });

        tl.play();
        return;
      }

      if (newMode === 'night') {
        const tl = gsap.timeline({ paused: true });

        tl.fromTo('.beach.day-foreground', { filter: 'brightness(1)' }, { filter: 'brightness(0.2)', duration: 3 });
        tl.fromTo('.beach.day-sky',        { filter: 'brightness(1)' }, { filter: 'brightness(0.2)', duration: 3 }, '<');
        tl.to('.beach.day-foreground',     { opacity: 0, duration: 6 }, '>-1');
        tl.to('.beach.day-sky',            { opacity: 0, duration: 6 }, '<');

        tl.set(document.body, { textShadow: textShadowNight, duration: 5 }, '<');

        // show lighthouse anim
        tl.to('#lighthouse',               { opacity: 1, duration: 2 });
        tl.to('.beach.night-stars', { opacity: 1, duration: 5 });

        // reset
        tl.set('.beach.day-foreground',    { filter: 'brightness(1)' });
        tl.set('.beach.day-sky',           { filter: 'brightness(1)' });

        // play
        tl.play();
        return;
      }
    });
  }
}
