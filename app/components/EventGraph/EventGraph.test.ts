import React from 'react';
import { render } from '@testing-library/react-native';
import configureStore from 'redux-mock-store';
import EventGraph from './EventGraph';
import { RootState } from 'app/services/root';

test('renders event items from eventData', () => {
    // Render the component with mock data
    render(<EventGraph />);
  
    // Find elements and assert their presence
    const events = screen.getAllByText(/event/i);
    expect(events.length).toBe(2);
  
    const timestamps = screen.getAllByText(/:\d{2}$/i);
    expect(timestamps.length).toBe(2);
  });
  
