import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { MedicationForm } from '../MedicationForm';
import { Medication } from '../../../types/medication';

// Helper to render component with router
const renderWithRouter = (mode: 'new' | 'edit', medicationId?: number) => {
  const path = mode === 'new' ? '/medications/new' : `/medications/${medicationId}/edit`;
  const routePath = mode === 'new' ? '/medications/new' : '/medications/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<MedicationForm mode={mode} />} />
        <Route path="/medications/:id" element={<div>Medication Show Page</div>} />
        <Route path="/medications" element={<div>Medications Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockMedication: Medication = {
  id: 1,
  name: 'Aspirin',
  amount: '100mg',
  purpose: 'Pain relief',
  expiration_date: '2025-12-31',
};

describe('MedicationForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', () => {
      renderWithRouter('new');

      expect(screen.getByText('New Medication')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Amount/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Purpose/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Expiration Date/)).toBeInTheDocument();
      expect(screen.getByText('Create Medication')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockMedication }),
      });

      renderWithRouter('new');

      const nameInput = screen.getByLabelText(/Name/);
      const amountInput = screen.getByLabelText(/Amount/);
      const purposeInput = screen.getByLabelText(/Purpose/);
      const expirationInput = screen.getByLabelText(/Expiration Date/);

      fireEvent.change(nameInput, { target: { value: 'Aspirin' } });
      fireEvent.change(amountInput, { target: { value: '100mg' } });
      fireEvent.change(purposeInput, { target: { value: 'Pain relief' } });
      fireEvent.change(expirationInput, { target: { value: '2025-12-31' } });

      const submitButton = screen.getByText('Create Medication');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/medications', expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('"name":"Aspirin"'),
        }));
      });
    });

    it('displays error message when submission fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ errors: ['Name is required'] }),
      });

      renderWithRouter('new');

      const nameInput = screen.getByLabelText(/Name/);
      const amountInput = screen.getByLabelText(/Amount/);
      const purposeInput = screen.getByLabelText(/Purpose/);
      const expirationInput = screen.getByLabelText(/Expiration Date/);

      fireEvent.change(nameInput, { target: { value: 'Test Med' } });
      fireEvent.change(amountInput, { target: { value: '100mg' } });
      fireEvent.change(purposeInput, { target: { value: 'Test' } });
      fireEvent.change(expirationInput, { target: { value: '2025-12-31' } });

      const submitButton = screen.getByText('Create Medication');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();
      });
    });

    it('disables submit button while submitting', async () => {
      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      renderWithRouter('new');

      const nameInput = screen.getByLabelText(/Name/);
      const amountInput = screen.getByLabelText(/Amount/);
      const purposeInput = screen.getByLabelText(/Purpose/);
      const expirationInput = screen.getByLabelText(/Expiration Date/);

      fireEvent.change(nameInput, { target: { value: 'Test Med' } });
      fireEvent.change(amountInput, { target: { value: '100mg' } });
      fireEvent.change(purposeInput, { target: { value: 'Test' } });
      fireEvent.change(expirationInput, { target: { value: '2025-12-31' } });

      const submitButton = screen.getByText('Create Medication');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing medication data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockMedication,
      });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/Name/) as HTMLInputElement;
        expect(nameInput.value).toBe('Aspirin');
      });

      const amountInput = screen.getByLabelText(/Amount/) as HTMLInputElement;
      const purposeInput = screen.getByLabelText(/Purpose/) as HTMLInputElement;
      const expirationInput = screen.getByLabelText(/Expiration Date/) as HTMLInputElement;

      expect(amountInput.value).toBe('100mg');
      expect(purposeInput.value).toBe('Pain relief');
      expect(expirationInput.value).toBe('2025-12-31');
      expect(screen.getByText('Edit Medication')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockMedication,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockMedication, amount: '200mg' }),
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('100mg')).toBeInTheDocument();
      });

      const amountInput = screen.getByLabelText(/Amount/);
      fireEvent.change(amountInput, { target: { value: '200mg' } });

      const submitButton = screen.getByText('Update Medication');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/medications/1', expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"amount":"200mg"'),
        }));
      });
    });

    it('displays error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch medication'));

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch medication/)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    it('displays back button linking to medications index', () => {
      renderWithRouter('new');

      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/medications');
    });
  });
});
