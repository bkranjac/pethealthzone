import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { InjuryForm } from '../InjuryForm';
import { Injury } from '../../../types/injury';

// Helper to render component with router
const renderWithRouter = (mode: 'new' | 'edit', injuryId?: number) => {
  const path = mode === 'new' ? '/injuries/new' : `/injuries/${injuryId}/edit`;
  const routePath = mode === 'new' ? '/injuries/new' : '/injuries/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<InjuryForm mode={mode} />} />
        <Route path="/injuries/:id" element={<div>Injury Show Page</div>} />
        <Route path="/injuries" element={<div>Injuries Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

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
      renderWithRouter('new');

      expect(screen.getByText('Report New Injury')).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Severity/)).toBeInTheDocument();
      expect(screen.getByText('Report Injury')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockInjury }),
      });

      renderWithRouter('new');

      await user.type(screen.getByLabelText(/Description/), 'Broken leg from fall');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'High');

      const submitButton = screen.getByText('Report Injury');
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

      renderWithRouter('new');

      await user.type(screen.getByLabelText(/Description/), 'Test injury');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'Low');

      const submitButton = screen.getByText('Report Injury');
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

      renderWithRouter('new');

      await user.type(screen.getByLabelText(/Description/), 'Test injury');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'Medium');

      const submitButton = screen.getByText('Report Injury');
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

      renderWithRouter('edit', 1);

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

      renderWithRouter('edit', 1);

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

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch injury/)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('marks required fields', () => {
      renderWithRouter('new');

      expect(screen.getAllByText('*').length).toBeGreaterThan(0);
    });

    it('includes severity dropdown with options', () => {
      renderWithRouter('new');

      const severitySelect = screen.getByLabelText(/Severity/) as HTMLSelectElement;

      expect(severitySelect).toBeInTheDocument();
      expect(screen.getByText('Select severity level')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('High')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('allows selecting severity', async () => {
      const user = userEvent.setup();
      renderWithRouter('new');

      const severitySelect = screen.getByLabelText(/Severity/);
      await user.selectOptions(severitySelect, 'Critical');

      expect((severitySelect as HTMLSelectElement).value).toBe('Critical');
    });
  });

  describe('Navigation', () => {
    it('displays cancel button linking to injuries index', () => {
      renderWithRouter('new');

      const cancelLink = screen.getByText('Cancel');
      expect(cancelLink).toHaveAttribute('href', '/injuries');
    });
  });

  describe('All Form Fields', () => {
    it('renders all input fields', () => {
      renderWithRouter('new');

      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Severity/)).toBeInTheDocument();
    });

    it('allows entering data in all fields', async () => {
      const user = userEvent.setup();
      renderWithRouter('new');

      await user.type(screen.getByLabelText(/Description/), 'Test injury description');
      await user.selectOptions(screen.getByLabelText(/Severity/), 'Medium');

      expect((screen.getByLabelText(/Description/) as HTMLTextAreaElement).value).toBe('Test injury description');
      expect((screen.getByLabelText(/Severity/) as HTMLSelectElement).value).toBe('Medium');
    });
  });
});
