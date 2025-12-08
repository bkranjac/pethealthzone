import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InjuryForm } from '../InjuryForm';
import { Injury } from '../../../types/injury';

const mockInjury: Injury = {
  id: 1,
  description: 'Broken leg from fall',
  severity: 'High',
};

describe('InjuryForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', () => {
      render(<InjuryForm mode="new" />);

      expect(screen.getByText('New Injury')).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Severity/)).toBeInTheDocument();
      expect(screen.getByText('Create Injury')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockInjury }),
      });

      render(<InjuryForm mode="new" />);

      await user.type(screen.getByLabelText(/Description/), 'Broken leg from fall');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'High');

      const submitButton = screen.getByText('Create Injury');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/injuries', expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('Broken leg from fall'),
        }));
      });

      // Note: Navigation via window.location.assign() cannot be tested in JSDOM
      // The form submission is verified by confirming the POST API call was made
    });

    it('displays error message when submission fails', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ errors: ['Description is required', 'Severity is required'] }),
      });

      render(<InjuryForm mode="new" />);

      await user.type(screen.getByLabelText(/Description/), 'Test injury');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'Low');

      const submitButton = screen.getByText('Create Injury');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Description is required, Severity is required/)).toBeInTheDocument();
      });
    });

    it('disables submit button while submitting', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      render(<InjuryForm mode="new" />);

      await user.type(screen.getByLabelText(/Description/), 'Test injury');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'Medium');

      const submitButton = screen.getByText('Create Injury');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing injury data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockInjury,
      });

      render(<InjuryForm mode="edit" injuryId={1} />);

      // Wait for the data to be loaded into the form fields
      await waitFor(() => {
        const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement;
        expect(descriptionInput.value).toBe('Broken leg from fall');
      });

      const descriptionInput = screen.getByLabelText(/Description/) as HTMLTextAreaElement;
      const severitySelect = screen.getByLabelText(/Severity/) as HTMLSelectElement;

      expect(descriptionInput.value).toBe('Broken leg from fall');
      expect(severitySelect.value).toBe('High');
      expect(screen.getByText('Edit Injury')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInjury,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockInjury, description: 'Updated description' }),
        });

      render(<InjuryForm mode="edit" injuryId={1} />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Broken leg from fall')).toBeInTheDocument();
      });

      const descriptionInput = screen.getByLabelText(/Description/);
      await user.clear(descriptionInput);
      await user.type(descriptionInput, 'Updated description');

      const submitButton = screen.getByText('Update Injury');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/injuries/1', expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('Updated description'),
        }));
      });

      // Note: Navigation via window.location.assign() cannot be tested in JSDOM
      // The update is verified by confirming the PUT API call was made
    });

    it('displays error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch injury'));

      render(<InjuryForm mode="edit" injuryId={1} />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch injury/)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('marks required fields', () => {
      render(<InjuryForm mode="new" />);

      expect(screen.getAllByText('*').length).toBeGreaterThan(0);
    });

    it('includes severity dropdown with options', () => {
      render(<InjuryForm mode="new" />);

      const severitySelect = screen.getByLabelText(/Severity/) as HTMLSelectElement;

      expect(severitySelect).toBeInTheDocument();
      expect(screen.getByText('Select severity')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('allows selecting severity', async () => {
      const user = userEvent.setup();
      render(<InjuryForm mode="new" />);

      const severitySelect = screen.getByLabelText(/Severity/);
      await user.selectOptions(severitySelect, 'Critical');

      expect((severitySelect as HTMLSelectElement).value).toBe('Critical');
    });
  });

  describe('Navigation', () => {
    it('displays cancel button linking to injuries index', () => {
      render(<InjuryForm mode="new" />);

      const cancelLink = screen.getByText('Back');
      expect(cancelLink).toHaveAttribute('href', '/injuries');
    });
  });

  describe('All Form Fields', () => {
    it('renders all input fields', () => {
      render(<InjuryForm mode="new" />);

      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Severity/)).toBeInTheDocument();
    });

    it('allows entering data in all fields', async () => {
      const user = userEvent.setup();
      render(<InjuryForm mode="new" />);

      await user.type(screen.getByLabelText(/Description/), 'Test injury description');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'Medium');

      expect((screen.getByLabelText(/Description/) as HTMLTextAreaElement).value).toBe('Test injury description');
      expect((screen.getByLabelText(/Severity/) as HTMLSelectElement).value).toBe('Medium');
    });
  });
});
