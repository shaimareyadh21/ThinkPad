import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

describe('App Component', () => {

    it('renders without crashing', () => {
        render(<App />);
        // Check if the component renders
        expect(screen.getByText(/Welcome to FinQuizz!/i)).toBeInTheDocument();
    });

    it('renders a button', () => {
        render(<App />);
        // Check if any button is present
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});