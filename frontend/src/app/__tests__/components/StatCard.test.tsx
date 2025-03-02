// src/components/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import StatCard from '../../components/StatCard'; // Adjust path if necessary
import '@testing-library/jest-dom'; // For the 'toBeInTheDocument' matcher

describe('StatCard Component', () => {
  test('renders Last 7 days heading', async () => {
    render(<StatCard />);

    // Use waitFor to handle any async rendering
    const heading = await screen.findByText('Last 7 days');
    expect(heading).toBeInTheDocument();
  });

  test('renders each stat with correct name and value', async () => {
    render(<StatCard />);

    // Wait for all the stats to render
    const stat1Name = await screen.findByText('Easy Questions Completed');
    const stat2Name = await screen.findByText('Hard Questions Completed');
    const stat3Name = await screen.findByText('Total Questions Completed');
    const stat4Name = await screen.findByText('Easy Questions Completion Rate');
    const stat5Name = await screen.findByText('Hard Questions Completion Rate');
    const stat6Name = await screen.findByText('Total Questions Completion Rate');

    // Assert that each stat is present in the document
    expect(stat1Name).toBeInTheDocument();
    expect(stat2Name).toBeInTheDocument();
    expect(stat3Name).toBeInTheDocument();
    expect(stat4Name).toBeInTheDocument();
    expect(stat5Name).toBeInTheDocument();
    expect(stat6Name).toBeInTheDocument();
  });
});
