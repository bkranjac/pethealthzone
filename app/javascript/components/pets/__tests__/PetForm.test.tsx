import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { PetForm } from '../PetForm';
import { Pet } from '../../../types/pet';

// Helper to render component with router
const renderWithRouter = (mode: 'new' | 'edit', petId?: number) => {
  const path = mode === 'new' ? '/pets/new' : `/pets/${petId}/edit`;
  const routePath = mode === 'new' ? '/pets/new' : '/pets/:id/edit';

  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path={routePath} element={<PetForm mode={mode} />} />
        <Route path="/pets/:id" element={<div>Pet Show Page</div>} />
        <Route path="/pets" element={<div>Pets Index Page</div>} />
      </Routes>
    </MemoryRouter>
  );
};

const mockPet: Pet = {
  id: 1,
  name: 'Buddy',
  nickname: 'Bud',
  pet_type: 'Dog',
  breed: 'Labrador',
  gender: 'Male',
  birthday: '2020-01-15',
  date_admitted: '2020-02-01',
  notes: 'Friendly dog',
};

describe('PetForm', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('New Mode', () => {
    it('renders form in new mode', () => {
      renderWithRouter('new');

      expect(screen.getByText('Add New Pet')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Birthday/)).toBeInTheDocument();
      expect(screen.getByText('Add Pet')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPet }),
      });

      renderWithRouter('new');

      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.selectOptions(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Breed/), 'Labrador');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');

      const submitButton = screen.getByText('Add Pet');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets', expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: expect.stringContaining('Buddy'),
        }));
      });

      // Note: Navigation via window.location.assign() cannot be tested in JSDOM
      // The form submission is verified by confirming the POST API call was made
    });

    it('displays error message when submission fails', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ errors: ['Name is required', 'Type is required'] }),
      });

      renderWithRouter('new');

      // Fill in required fields
      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.selectOptions(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');

      const submitButton = screen.getByText('Add Pet');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();
      });
    });

    it('disables submit button while submitting', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      renderWithRouter('new');

      // Fill in required fields
      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.selectOptions(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');

      const submitButton = screen.getByText('Add Pet');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it('sets default date_admitted to today', () => {
      renderWithRouter('new');

      const dateInput = screen.getByLabelText(/Date Admitted/) as HTMLInputElement;
      const today = new Date().toISOString().split('T')[0];

      expect(dateInput.value).toBe(today);
    });
  });

  describe('Edit Mode', () => {
    it('fetches and displays existing pet data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPet,
      });

      renderWithRouter('edit', 1);

      // Wait for the data to be loaded into the form fields
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/^Name/) as HTMLInputElement;
        expect(nameInput.value).toBe('Buddy');
      });

      const nameInput = screen.getByLabelText(/^Name/) as HTMLInputElement;
      const typeInput = screen.getByLabelText(/Type/) as HTMLInputElement;

      expect(nameInput.value).toBe('Buddy');
      expect(typeInput.value).toBe('Dog');
      expect(screen.getByText('Edit Pet')).toBeInTheDocument();
    });

    it('submits updated data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPet,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockPet, name: 'Max' }),
        });

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByDisplayValue('Buddy')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/^Name/);
      await user.clear(nameInput);
      await user.type(nameInput, 'Max');

      const submitButton = screen.getByText('Update Pet');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets/1', expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('Max'),
        }));
      });

      // Note: Navigation via window.location.assign() cannot be tested in JSDOM
      // The update is verified by confirming the PUT API call was made
    });

    it('displays error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch pet'));

      renderWithRouter('edit', 1);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch pet/)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('marks required fields', () => {
      renderWithRouter('new');

      expect(screen.getAllByText('*').length).toBeGreaterThan(0);
    });

    it('includes gender dropdown with options', () => {
      renderWithRouter('new');

      const genderSelect = screen.getByLabelText(/Gender/) as HTMLSelectElement;

      expect(genderSelect).toBeInTheDocument();
      expect(screen.getByText('Select gender')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
    });

    it('allows selecting gender', async () => {
      const user = userEvent.setup();
      renderWithRouter('new');

      const genderSelect = screen.getByLabelText(/Gender/);
      await user.selectOptions(genderSelect, 'Male');

      expect((genderSelect as HTMLSelectElement).value).toBe('Male');
    });
  });

  describe('Navigation', () => {
    it('displays cancel button linking to pets index', () => {
      renderWithRouter('new');

      const cancelLink = screen.getByText('Cancel');
      expect(cancelLink).toHaveAttribute('href', '/pets');
    });
  });

  describe('All Form Fields', () => {
    it('renders all input fields', () => {
      renderWithRouter('new');

      expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nickname/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Breed/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Gender/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Birthday/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date Admitted/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Upload Picture/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/)).toBeInTheDocument();
    });

    it('allows entering data in text fields', async () => {
      const user = userEvent.setup();
      renderWithRouter('new');

      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.type(screen.getByLabelText(/Nickname/), 'Bud');
      await user.selectOptions(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Breed/), 'Labrador');
      await user.selectOptions(screen.getByLabelText(/Gender/), 'Male');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');
      await user.type(screen.getByLabelText(/Notes/), 'Friendly dog');

      expect((screen.getByLabelText(/^Name/) as HTMLInputElement).value).toBe('Buddy');
      expect((screen.getByLabelText(/Nickname/) as HTMLInputElement).value).toBe('Bud');
      expect((screen.getByLabelText(/Type/) as HTMLSelectElement).value).toBe('Dog');
      expect((screen.getByLabelText(/Breed/) as HTMLInputElement).value).toBe('Labrador');
      expect((screen.getByLabelText(/Notes/) as HTMLTextAreaElement).value).toBe('Friendly dog');
    });
  });
});
