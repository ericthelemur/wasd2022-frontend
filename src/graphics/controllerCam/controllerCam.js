import m from 'mithril';
import { get } from 'lodash';

import '../common.css'
import './ControllerCam.css';

import TimerComponent from '../timer/timer.js';
import RunnersComponent from '../runners/runners.js';
import CouchComponent from '../couch/couch.js';
import Background from '../cleanBg/cleanBg.js';
import BarComponent from '../bar/bar.js';

const replicants = {
  run: NodeCG.Replicant('runDataActiveRun', 'nodecg-speedcontrol'),
  timer: NodeCG.Replicant('timer', 'nodecg-speedcontrol'),
  total: NodeCG.Replicant('total', 'nodecg-tiltify'),
  backgroundMode: NodeCG.Replicant('backgroundMode', 'wasd'),
};

const sep = '/';

class ControllerCamComponent {
  view(vnode) {
    return m('.graphic .fullscreen', [
      m(Background, { backgroundModeRep: vnode.attrs.backgroundModeRep }),
      m('.graphic .overlay', [
        m('.game'),
        m('.left', [
          m('.cam'),
          m('.cam'),
          m(RunnersComponent, {
            players: get(vnode, 'attrs.run.teams[0].players'),
            customData: get(vnode, 'attrs.run.customData'),
          }),
          m(CouchComponent, { customData: get(vnode, 'attrs.run.customData') }),
          m('.logos', [
            m('.logo-multi', [
              m('.logo .wasd-light'),
              m('.logo .wasd-dark'),
            ]),
            // m('.logo-multi', [
            //   m('.logo .special-effect-white'),
            //   m('.logo .special-effect-orange'),
            // ]),
          ]),
        ]),
        m('.bottom',[
          m('.run-details', [
            m('.run-game', String(get(vnode, 'attrs.run.game'))),
            m('.run-details-row', [
              m('div', String(get(vnode, 'attrs.run.system'))),
              m('div', sep),
              m('div', String(get(vnode, 'attrs.run.release'))),
              m('div', sep),
              m('div', String(get(vnode, 'attrs.run.category'))),
            ]),
          ]),
          m('.run-timing', [
            m(TimerComponent, { time: vnode.attrs.time }),
            m('.estimate', `Estimate: ${get(vnode, 'attrs.run.estimate')}`),
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
      return m(ControllerCamComponent, {
        run: replicants.run.value,
        time: replicants.timer.value.time,
        total: Math.floor(replicants.total.value),
        backgroundModeRep: replicants.backgroundMode,
      });
    }
  });
});

Object.values(replicants).forEach((rep) => {
  rep.on('change', () => { m.redraw(); });
});
