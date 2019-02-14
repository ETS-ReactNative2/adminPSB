import React from 'react';
import Categories from './Categories';
import {shallow} from 'enzyme';

describe('First React component test with Enzyme', () => {
    it('renders without crashing', () => {
       const wrapper = shallow(<Categories />);
       expect(wrapper.find('.content')).toBeDefined();
     });
 });