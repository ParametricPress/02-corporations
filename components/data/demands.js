import find from 'lodash/find'
import findIndex from 'lodash/findIndex'

const data = [
  {
    id: 'board-room',
    location: 'Board Room',
    text: 'Proactively support high-level initiatives to reduce emissions, including carbon pricing, cap-and-trade, renewable energy standards, renewable fuel standards, and direct emission regulation.',
    position: [25, 55, 0]
  },
  {
    id: 'financial-analysis',
    location: 'Financial Analysis',
    text: 'Update financial models to plan for low-carbon technologies and a divestment from fossil fuels, disclose to the SEC the risks that climate change poses to the business.',
    position: [0, 45, 0]
  },
  {
    id: 'marketing-department',
    location: 'Marketing Department',
    text: 'Stop misinforming the public about the severity of climate change, stop funding front groups or spin doctors to divert responsibility from the problem.',
    position: [25, 35, 0]
  },
  {
    id: 'research-lab',
    location: 'Research Lab',
    text: 'Support and fund science and technological expertise that promotes low-carbon energy technologies.',
    position: [-10, 25, 0]
  },
  {
    id: 'refinery',
    location: 'Refinery',
    text: 'Cut emissions from current operations and stop flaring natural gas immediately.',
    position: [50, 20, 0]
  },
  {
    id: 'community',
    location: 'Community',
    text: 'Support communities disproportionately affected by climate change and pay reparations for climate damages.',
    position: [-40, 10, 0]
  },
  {
    id: 'lobby',
    location: 'Lobby',
    text: 'Publicly accept responsibility for current and past emissions and their direct contribution to global warming.',
    position: [5, 5, 0]
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