import find from 'lodash/find'
import findIndex from 'lodash/findIndex'

const data = [
  {
    id: 'board-room',
    location: 'Board Room',
    title: 'Support climate policy',
    text: 'Proactively support high-level initiatives to reduce emissions, including carbon pricing, cap-and-trade, renewable energy standards, renewable fuel standards, and direct emission regulation.',
    position: [3, 18, 4.5]
  },
  {
    id: 'financial-analysis',
    location: 'Financial Analysis',
    title: 'Divest from fossil fuels',
    text: 'Update financial models to plan for low-carbon technologies and a divestment from fossil fuels, disclose to the SEC the risks that climate change poses to the business.',
    position: [-6, 13, 4.5]
  },
  {
    id: 'marketing-department',
    location: 'Marketing Department',
    title: 'Create demand for green products',
    text: 'Stop misinforming the public about the severity of climate change, stop funding front groups or spin doctors to divert responsibility from the problem.',
    position: [4.5, 10.5, 4.5]
  },
  {
    id: 'research-lab',
    location: 'Research Lab',
    title: 'Research low-carbon technology',
    text: 'Support and fund science and technological expertise that promotes low-carbon energy technologies.',
    position: [-6, 8, 4.5]
  },
  {
    id: 'refinery',
    location: 'Refinery',
    title: 'Set carbon neutral targets',
    text: 'Cut emissions from current operations and stop flaring natural gas immediately.',
    position: [12, 8, 4.5]
  },
  {
    id: 'global',
    location: 'Global',
    title: 'Support affected communities',
    text: 'Support communities disproportionately affected by climate change and pay reparations for climate damages.',
    position: [-15, 8, 4.5]
  },
  {
    id: 'lobby',
    location: 'Lobby',
    title: 'Own up to the public',
    text: 'Publicly accept responsibility for current and past emissions and their direct contribution to global warming.',
    position: [0, 3, 0]
  }
];

let index = 0;
for (let demand of data) {
  demand.index = index;
  index++;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default {
    get: (id) => find(data, {id: id}),
    next: (id) => {
      const index = findIndex(data, {id: id});
      const nextIndex = mod(index + 1, data.length);
      return data[nextIndex];
    },
    prev: (id) => {
      const index = findIndex(data, {id: id});
      const prevIndex = mod(index - 1, data.length);
      return data[prevIndex];
    },
    list: () => data
}