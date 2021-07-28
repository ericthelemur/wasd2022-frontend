import m from 'mithril';

import '../common.css';
import './backgroundMode.css';

const backgroundModeRep = NodeCG.Replicant('backgroundMode', 'wasd');

class BackgroundModeControl {
  view(vnode) {
    const rep = vnode.attrs.backgroundModeRep;

    const isDay = (rep.value === 'day');
    const isNight = (rep.value === 'night');

    return m('.bgmode-container', [
      m('.bgmode-status', `Current mode: ${rep.value}`),
      m('.bgmode-controls', [
        m('button.bgmode-button', { disabled: isDay, onclick: () => { rep.value = 'day'; } }, 'Set Day'),
        m('button.bgmode-button', { disabled: isNight, onclick: () => { rep.value = 'night'; } }, 'Set Night'),
      ]),
    ]);
  }
}

NodeCG.waitForReplicants(backgroundModeRep).then(() => {
  m.mount(document.body, {
    view: () => m(BackgroundModeControl, { backgroundModeRep: backgroundModeRep })
  });
});

backgroundModeRep.on('change', () => { m.redraw(); });
