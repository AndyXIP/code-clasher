import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HeroSection from '../../components/HeroSection'; // Adjust path if needed

describe('HeroSection Component', () => {
  test('renders the main heading', () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/Test your programming skills now/i)
    ).toBeInTheDocument();
  });

  test('renders the description', () => {
    render(<HeroSection />);
    expect(
      screen.getByText(/Daily easy and hard questions for you to practice before taking on those interviews./i)
    ).toBeInTheDocument();
  });

  test('renders the "Signup Now" button', () => {
    render(<HeroSection />);
    const signupButton = screen.getByRole('link', { name: /Signup Now/i });
    expect(signupButton).toBeInTheDocument();
    expect(signupButton).toHaveAttribute('href', '/signup');
  });

  test('renders the "View on GitHub" link', () => {
    render(<HeroSection />);
    const githubLink = screen.getByRole('link', { name: /View on GitHub/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/AndyXIP/sse-team-project/');
  });

  test('renders the "Daily Questions" badge with a link to /problems', () => {
    render(<HeroSection />);
    const dailyQuestionsLink = screen.getByRole('link', { name: /Daily Questions/i });
    expect(dailyQuestionsLink).toBeInTheDocument();
    expect(dailyQuestionsLink).toHaveAttribute('href', '/problems');
  });

  test('renders the embedded C++ code block', () => {
    render(<HeroSection />);
    expect(screen.getByText(/#include <iostream>/i)).toBeInTheDocument();
    expect(screen.getByText(/cout << "Hello, World!"/i)).toBeInTheDocument();
  });
});
