import find from 'lodash/find'
import findIndex from 'lodash/findIndex'

const data = [
  {
    id: 'boardroom',
    location: 'Boardroom',
    title: 'Set environmental policy',
    text: 'Proactively support high-level initiatives to reduce emissions, including carbon pricing, cap-and-trade, renewable energy standards, and direct emissions regulation.',
    position: [3, 18, 4.5]
  },
  {
    id: 'finance-department',
    location: 'Finance Department',
    title: 'Update financial models',
    text: 'Update financial models to account for a carbon-neutral future, divest from fossil fuels, and disclose climate change risks to investors.',
    position: [-6, 13, 4.5]
  },
  {
    id: 'marketing-department',
    location: 'Marketing Department',
    title: 'Create demand for green products',
    text: 'Create demand for green consumer products and stop misinforming the public about the severity of climate change.',
    position: [4.5, 10.5, 4.5]
  },
  {
    id: 'research-lab',
    location: 'Research Lab',
    title: 'Research alternative energy',
    text: 'Fund research into alternative energy technologies, carbon abatement technology, and other green technology solutions.',
    position: [-6, 8, 4.5]
  },
  {
    id: 'refinery',
    location: 'Refinery',
    title: 'Set carbon-neutral target',
    text: 'Set aggresive targets for cutting direct emissions and reaching an end-to-end carbon-neutral supply chain.',
    position: [12, 8, 4.5]
  },
  {
    id: 'global',
    location: 'Global',
    title: 'Support affected communities',
    text: 'Pay reparations to the marginalized communities who are most affected and least able to afford the catastrophic costs of climate change.',
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