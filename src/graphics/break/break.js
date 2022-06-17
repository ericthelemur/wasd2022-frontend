import m from 'mithril';
import gsap from 'gsap';
import { get } from 'lodash';

import '../common.css';
import './break.css';

import BeachBackground from '../beach/beach.js';
import BarComponent from '../bar/bar.js';
import { nextRuns } from '../nextRuns/nextRuns.js';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  runArray: NodeCG.Replicant('runDataArray', 'nodecg-speedcontrol'),
  countdown: NodeCG.Replicant('countdown', 'wasd'),
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  challenges: NodeCG.Replicant('challenges', 'nodecg-tiltify'),
  polls: NodeCG.Replicant('donationpolls', 'nodecg-tiltify'),
};

class Incentive {
  view(vnode) {
    const { name, amount, totalAmountRaised } = vnode.attrs.incentive;
    const [ gameName, incentiveName ] = name.split('-').map(s => s.trim());

    return m('.break-incentive-container', [
      m('.break-incentive-game', gameName),
      m('.break-incentive-name', incentiveName),
      m('.break-incentive-bar', [
        m('.break-incentive-progress'),
        m('.break-incentive-amount', `£${totalAmountRaised} / £${amount}`),
      ]),
    ]);
  }

  onupdate(vnode) {
    const bar = vnode.dom.children[2].children[0];

    const current = Number(vnode.attrs.incentive.totalAmountRaised);
    const max = Number(vnode.attrs.incentive.amount);

    const width = Math.min(((current / max) * 100), 100);

    gsap.to(bar, { width: `${width}%`, ease: 'expo.out', duration: 3 });
  }
}

class Incentives {
  view(vnode) {
    return m('.break-incentives-container', [
      m('.break-h-space'),
      m('.break-right-label', 'Donation Incentives'),
      m('.break-incentives-list', ...vnode.attrs.incentives.filter(i => i.active)
                                                           .sort((left, right) => left.endsAt < right.endsAt) // tmp
                                                           .map((i) => {
        return m(Incentive, { incentive: i, key: i.id });
      })),
    ]);
  }
}

class BreakMultiBox {
  view(vnode) {
    return m('.break-multibox', [
      m('.break-multibox-item', [
        m('.break-later-on', [
          m('.break-h-space'),
          m('.break-right-label', 'Later On'),
          (
            (vnode.attrs.nextRuns.length < 2)
            ? m('.break-next-run-game', 'NO RUNS!')
            : vnode.attrs.nextRuns.slice(1).map(run => m(Run, { run: run }))
          ),
        ]),
      ]),
      m('.break-multibox-item', [
        m(Incentives, { incentives: vnode.attrs.incentives }),
      ]),
    ]);
  }


  oncreate(vnode) {
    const boxes = Array.from(vnode.dom.children);

    const tl = gsap.timeline({ repeat: -1, paused: true });

    const hold = 20;

    boxes.forEach((box) => {
      gsap.set(box, { opacity: 0 });
      tl.to(box, { opacity: 1 });
      tl.to({}, hold, {});
      tl.to(box, { opacity: 0 });
      tl
    });

    this.anim = tl;

    tl.play();
  }

  onremove(vnode) {
    if (this.anim) {
      this.anim.kill();
    }
  }
}

class Run {
  view(vnode) {
    return m('.break-next-run-container', [
      m('.break-next-run-bg'),
      m('.break-next-run-game', vnode.attrs.run.game),
      m('.break-next-run-details', [
        m('span', vnode.attrs.run.category),
        m('span', '·'),
        m('span', vnode.attrs.run.system),
        m('span', '·'),
        m('span', get(vnode, 'attrs.run.teams[0].players', []).map(p => p.name).join(', ')),
        m('span', '·'),
        m('span', vnode.attrs.run.estimate),
      ])
    ]);
  }
}

class BreakComponent {
  view(vnode) {
    return m('.graphic .fullscreen', [
      m(BeachBackground, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.break-container', [
          m('.break-left', [
            m('.break-logo-multi .wasd', [
              m('.break-logo .wasd-light'),
              m('.break-logo .wasd-dark'),
            ]),
            m('.break-logo-multi .special-effect', [
              m('.break-logo .special-effect-white'),
              m('.break-logo .special-effect-orange'),
            ]),
            m('.countdown-container', [
              m('.countdown-label', 'BACK SOON'),
              m('.countdown-time', vnode.attrs.countdown.display),
            ])
          ]),
          m('.break-v-space'),
          m('.break-right', [
            m('.break-right-label', 'Coming Up Next'),
            ((vnode.attrs.nextRuns.length === 0)
              ? m('.break-next-run-game', 'NO RUNS!')
              : m(Run, { run: vnode.attrs.nextRuns[0] })),
            m(BreakMultiBox, {
              nextRuns: vnode.attrs.nextRuns,
              incentives: vnode.attrs.incentives,
              dayAmount: vnode.attrs.dayAmount,
              nightAmount: vnode.attrs.nightAmount,
            }),
          ]),
        ]),
      ]),
      m(BarComponent, { total: vnode.attrs.total }),
    ]);
  }
}

NodeCG.waitForReplicants(...Object.values(replicants)).then(() => {
  m.mount(document.body, {
    view: () => {
      return m(BreakComponent, {
        total: Math.floor(replicants.total.value),
        countdown: replicants.countdown.value,
        backgroundModeRep: replicants.backgroundMode,
        nextRuns: nextRuns(replicants.run.value, replicants.runArray.value),
        incentives: replicants.challenges.value,
        dayAmount: Math.floor(get(replicants.polls,'value[1].options[0].totalAmountRaised', 0)),
        nightAmount: Math.floor(get(replicants.polls,'value[1].options[1].totalAmountRaised', 0)),
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});
