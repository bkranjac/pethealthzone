import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PetForm } from '../PetForm';
import { Pet } from '../../../types/pet';

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
      render(<PetForm mode="new" />);

      expect(screen.getByText('New Pet')).toBeInTheDocument();
      expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Birthday/)).toBeInTheDocument();
      expect(screen.getByText('Create Pet')).toBeInTheDocument();
    });

    it('submits form with valid data', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockPet }),
      });

      render(<PetForm mode="new" />);

      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.type(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Breed/), 'Labrador');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');

      const submitButton = screen.getByText('Create Pet');
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

      render(<PetForm mode="new" />);

      // Fill in required fields
      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.type(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');

      const submitButton = screen.getByText('Create Pet');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Name is required, Type is required/)).toBeInTheDocument();
      });
    });

    it('disables submit button while submitting', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(() =>
        new Promise(() => {}) // Never resolves
      );

      render(<PetForm mode="new" />);

      // Fill in required fields
      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.type(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');

      const submitButton = screen.getByText('Create Pet');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });

    it('sets default date_admitted to today', () => {
      render(<PetForm mode="new" />);

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

      render(<PetForm mode="edit" petId={1} />);

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

      render(<PetForm mode="edit" petId={1} />);

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

      render(<PetForm mode="edit" petId={1} />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to fetch pet/)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    it('marks required fields', () => {
      render(<PetForm mode="new" />);

      expect(screen.getAllByText('*').length).toBeGreaterThan(0);
    });

    it('includes gender dropdown with options', () => {
      render(<PetForm mode="new" />);

      const genderSelect = screen.getByLabelText(/Gender/) as HTMLSelectElement;

      expect(genderSelect).toBeInTheDocument();
      expect(screen.getByText('Select gender')).toBeInTheDocument();
      expect(screen.getByText('Male')).toBeInTheDocument();
      expect(screen.getByText('Female')).toBeInTheDocument();
    });

    it('allows selecting gender', async () => {
      const user = userEvent.setup();
      render(<PetForm mode="new" />);

      const genderSelect = screen.getByLabelText(/Gender/);
      await user.selectOptions(genderSelect, 'Male');

      expect((genderSelect as HTMLSelectElement).value).toBe('Male');
    });
  });

  describe('Navigation', () => {
    it('displays cancel button linking to pets index', () => {
      render(<PetForm mode="new" />);

      const cancelLink = screen.getByText('Cancel');
      expect(cancelLink).toHaveAttribute('href', '/pets');
    });
  });

  describe('All Form Fields', () => {
    it('renders all input fields', () => {
      render(<PetForm mode="new" />);

      expect(screen.getByLabelText(/^Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nickname/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Type/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Breed/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Gender/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Birthday/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date Admitted/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Picture URL/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/)).toBeInTheDocument();
    });

    it('allows entering data in all fields', async () => {
      const user = userEvent.setup();
      render(<PetForm mode="new" />);

      await user.type(screen.getByLabelText(/^Name/), 'Buddy');
      await user.type(screen.getByLabelText(/Nickname/), 'Bud');
      await user.type(screen.getByLabelText(/Type/), 'Dog');
      await user.type(screen.getByLabelText(/Breed/), 'Labrador');
      await user.selectOptions(screen.getByLabelText(/Gender/), 'Male');
      await user.type(screen.getByLabelText(/Birthday/), '2020-01-15');
      await user.type(screen.getByLabelText(/Picture URL/), 'http://example.com/buddy.jpg');
      await user.type(screen.getByLabelText(/Notes/), 'Friendly dog');

      expect((screen.getByLabelText(/^Name/) as HTMLInputElement).value).toBe('Buddy');
      expect((screen.getByLabelText(/Nickname/) as HTMLInputElement).value).toBe('Bud');
      expect((screen.getByLabelText(/Type/) as HTMLInputElement).value).toBe('Dog');
    });
  });
});
