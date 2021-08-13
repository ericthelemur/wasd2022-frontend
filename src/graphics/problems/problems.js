import m from 'mithril';
import gsap from 'gsap';

import '../common.css';
import './problems.css';

import BeachBackground from '../beach/beach.js';

const replicants = {
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
};

class ProblemsImages {
  view() {
    return m('div', [
      m('div', [
        m('.problems-image .wasd'),
        m('.problems-image .wasd-shadow'),
      ]),
      m('.problems-image .notlikethis'),
    ]);
  }

  onremove(vnode) {
    if (this.anim) {
      this.anim.kill();
    }
  }

  oncreate(vnode) {
    if (this.anim) {
      this.anim.kill();
    }

    const tl = gsap.timeline({ repeat: -1 });

    Array.from(vnode.dom.children).forEach((child) => {
      tl.from(child, { opacity: 0 });
      tl.to({}, 20, {});
      tl.to(child, { opacity: 0});
    });

    this.anim = tl;
  }
}

class ProblemsComponent {
  view(vnode) {
    return m('.graphic .fullscreen', [
      m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m(ProblemsImages),
      m('.problems-text', 'Technical Difficulties'),
    ]);
  }
}

NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => m(ProblemsComponent, {
      backgroundModeRep: replicants.backgroundMode,
    })
  });
});
