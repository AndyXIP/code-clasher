import { render, screen } from '@testing-library/react';
import TestCase from '../../components/TestCase';
import '@testing-library/jest-dom';

describe('TestCase Component', () => {
  test('does not render if input is null or undefined', () => {
    const { container } = render(<TestCase input={null} expected_output={10} actual_output={10} />);
    expect(container.firstChild).toBeNull();
  });

  test('renders input, expected output, actual output, and passed status correctly', () => {
    render(
      <TestCase
        input={{ a: 1, b: 2 }}
        expected_output={3}
        actual_output={3}
      />
    );

    expect(screen.getByText('Input:')).toBeInTheDocument();
    expect(screen.getByText(/"a":\s*1/i)).toBeInTheDocument();
    expect(screen.getByText('Expected Output:')).toBeInTheDocument();
    expect(screen.getAllByText('3')[0]).toBeInTheDocument();
    expect(screen.getByText('Actual Output:')).toBeInTheDocument();
    expect(screen.getAllByText('3')[1]).toBeInTheDocument();
  });

  test('renders correctly when test case fails', () => {
    render(
      <TestCase
        input={[1, 2, 3]}
        expected_output={6}
        actual_output={5}
      />
    );

    expect(screen.getByText('Input:')).toBeInTheDocument();
    expect(screen.getByText(/\[\s*1,\s*2,\s*3\s*\]/)).toBeInTheDocument();
    expect(screen.getByText('Expected Output:')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Actual Output:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});