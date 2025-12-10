import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PetShow } from '../PetShow';
import { Pet } from '../../../types/pet';

// Helper to render component with router
const renderWithRouter = (petId: number) => {
  return render(
    <MemoryRouter initialEntries={[`/pets/${petId}`]}>
      <Routes>
        <Route path="/pets/:id" element={<PetShow />} />
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
  notes: 'Friendly and energetic dog',
};

describe('PetShow', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    (global.confirm as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter(1);
    expect(screen.getByText('Loading pet...')).toBeInTheDocument();
  });

  it('fetches and displays pet details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPet,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    expect(screen.getByText('"Bud"')).toBeInTheDocument();
    expect(screen.getByText('Dog')).toBeInTheDocument();
    expect(screen.getByText('Labrador')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Friendly and energetic dog')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ errors: ['Failed to fetch pet'] }),
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch pet/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPet,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets/1', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'test-csrf-token',
        },
      });
    });
  });

  it('formats dates correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPet,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    // Dates should be formatted as locale strings
    const birthdayDate = new Date('2020-01-15').toLocaleDateString();
    const admittedDate = new Date('2020-02-01').toLocaleDateString();

    expect(screen.getByText(birthdayDate)).toBeInTheDocument();
    expect(screen.getByText(admittedDate)).toBeInTheDocument();
  });

  it('displays edit and delete buttons', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPet,
    });

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Edit this pet')).toBeInTheDocument();
      expect(screen.getByText('Destroy this pet')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit this pet');
    expect(editLink).toHaveAttribute('href', '/pets/1/edit');
  });

  it('handles delete with confirmation and redirects', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPet,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this pet');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this pet?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    // Note: Navigation via window.location.assign() cannot be tested in JSDOM
    // The delete functionality is verified by confirming the DELETE API call was made
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPet,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter(1);

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Destroy this pet');
    fireEvent.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();

    // Verify that fetch was NOT called when user cancels
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1); // Only the initial fetch for pet data
    });
  });

  it('displays back to pets link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPet,
    });

    renderWithRouter(1);

    await waitFor(() => {
      const backLink = screen.getByText('Back');
      expect(backLink).toHaveAttribute('href', '/pets');
    });
  });

  it('handles pet without optional fields', async () => {
    const minimalPet: Pet = {
      id: 2,
      name: 'Rex',
      pet_type: 'Dog',
      breed: 'Mixed',
      birthday: '2021-03-10',
      date_admitted: '2021-04-01',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => minimalPet,
    });

    renderWithRouter(2);

    await waitFor(() => {
      expect(screen.getByText('Rex')).toBeInTheDocument();
    });

    // Should not display nickname and notes fields
    expect(screen.queryByText('"')).not.toBeInTheDocument(); // No nickname quotes
    // Notes section should not be present
    const noteLabels = screen.queryAllByText('Notes:');
    expect(noteLabels.length).toBe(0);
  });
});
