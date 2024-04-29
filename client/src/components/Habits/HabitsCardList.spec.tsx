import { render } from '@testing-library/react'
import { HabitsCardList } from './HabitsCardList'

describe('HabitsCardList', () => {
  it('renders the correct number of HabitsCard components', () => {
    const { getAllByTestId } = render(<HabitsCardList />)
    const cards = getAllByTestId('habits-card');
    expect(cards.length).toBe(6);
  })
});