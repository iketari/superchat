import 'milligram/dist/milligram.css';

import { Loader } from './loader';

const searchParams = new URLSearchParams(location.search);
const loader = new Loader;

const blockName = searchParams.get('block');
const blockParams = JSON.parse(searchParams.get('params'));
const block = loader.getBlock(blockName, blockParams, document.createElement('div'));

document.querySelector('.storybook').append(block.el);

block.render();

console.log('ready for screenshot');