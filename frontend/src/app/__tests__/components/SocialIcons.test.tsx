import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GitHubIcon } from '../../components/SocialIcons'; // Adjust the import path as needed

describe('GitHubIcon Component', () => {
  test('renders an SVG element with the correct attributes', () => {
    render(<GitHubIcon data-testid="github-icon" className="custom-class" />);
    
    const svgElement = screen.getByTestId('github-icon');

    // Check if the SVG element is in the document
    expect(svgElement).toBeInTheDocument();

    // Ensure it has the correct viewBox attribute
    expect(svgElement).toHaveAttribute('viewBox', '0 0 24 24');

    // Ensure it has the correct aria-hidden attribute
    expect(svgElement).toHaveAttribute('aria-hidden', 'true');

    // Ensure the class is applied correctly
    expect(svgElement).toHaveClass('custom-class');
  });
});
