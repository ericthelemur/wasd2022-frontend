import m from 'mithril';
import gsap from 'gsap';

import './beach.css';

export default class BeachBackground {
  view(vnode) {
    return m('#beach-background', [
      m('.beach.night-sky'),
      m('.beach.night-foreground'),
      m('.beach.day-sky'),
      m('.beach.day-foreground'),
    ]);
  }

  oncreate(vnode) {
    const rep = vnode.attrs.backgroundModeRep;

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

  setGlobalsDay(duration = 0) {
    const dayTextColor = getComputedStyle(document.body).getPropertyValue('--wasd-dark');
    const dayTextColorInvert = getComputedStyle(document.body).getPropertyValue('--wasd-white');
    const daySpacerColor = getComputedStyle(document.body).getPropertyValue('--wasd-dark-muted');

    gsap.to('html', { '--night-element-opacity': 0, duration: duration});
    gsap.to('html', { '--day-element-opacity': 1, duration: duration });

    gsap.to('html', { '--text-color': dayTextColor, duration: duration });
    gsap.to('html', { '--text-color-invert': dayTextColorInvert, duration: duration });
    gsap.to('html', { '--spacer-color': daySpacerColor, duration: duration });
  }

  setGlobalsNight(duration = 0) {
    const nightTextColor = getComputedStyle(document.body).getPropertyValue('--wasd-white');
    const nightTextColorInvert = getComputedStyle(document.body).getPropertyValue('--wasd-dark');
    const nightSpacerColor = getComputedStyle(document.body).getPropertyValue('--wasd-white-muted');

    gsap.to('html', { '--night-element-opacity': 1, duration: duration });
    gsap.to('html', { '--day-element-opacity': 0, duration: duration });

    gsap.to('html', { '--text-color': nightTextColor, duration: duration });
    gsap.to('html', { '--text-color-invert': nightTextColorInvert, duration: duration });
    gsap.to('html', { '--spacer-color': nightSpacerColor, duration: duration });
  }

  resetAjustments() {
    gsap.set('.beach.day-foreground',   { filter: 'brightness(1)' });
    gsap.set('.beach.day-sky',          { filter: 'brightness(1)' });
    gsap.set('.beach.night-foreground', { filter: 'brightness(1)' });
    gsap.set('.beach.night-sky',        { filter: 'brightness(1)' });
  }

  setDay() {
    gsap.set('.beach.day-foreground', { opacity: 1 });
    gsap.set('.beach.day-sky',        { opacity: 1 });
    this.setGlobalsDay();
  }

  setNight() {
    gsap.set('.beach.day-foreground', { opacity: 0 });
    gsap.set('.beach.day-sky',        { opacity: 0 });
    this.setGlobalsNight();
  }

  transitionDay() {
    const tl = gsap.timeline({ paused: true });
    // tl.set('#lighthouse',                { opacity: 0 });

    tl.fromTo('.beach.night-sky',        { filter: 'brightness(1)' }, { filter: 'brightness(1.9)', duration: 3 });

    tl.to('.beach.day-foreground',       { opacity: 1, duration: 5 }, '<');
    tl.to('.beach.day-sky',              { opacity: 1, duration: 3 }, '<+1');

    this.setGlobalsDay(3);

    this.resetAjustments();

    tl.play();
  }

  transitionNight() {
    const tl = gsap.timeline({ paused: true });

    tl.fromTo('.beach.day-foreground', { filter: 'brightness(1)' }, { filter: 'brightness(0.2)', duration: 3 });
    tl.fromTo('.beach.day-sky',        { filter: 'brightness(1)' }, { filter: 'brightness(0.2)', duration: 3 }, '<');
    tl.to('.beach.day-foreground',     { opacity: 0, duration: 5 }, '>-1');
    tl.to('.beach.day-sky',            { opacity: 0, duration: 3 }, '<');

    this.setGlobalsNight(3);

    this.resetAjustments();

    tl.play();
  }
}
