import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PetsIndex } from '../PetsIndex';
import { Pet } from '../../../types/pet';

// Helper to render component with router
const renderWithRouter = () => {
  return render(
    <MemoryRouter>
      <PetsIndex />
    </MemoryRouter>
  );
};

const mockPets: Pet[] = [
  {
    id: 1,
    name: 'Buddy',
    nickname: 'Bud',
    pet_type: 'Dog',
    breed: 'Labrador',
    gender: 'Male',
    birthday: '2020-01-15',
    date_admitted: '2020-02-01',
    notes: 'Friendly dog',
  },
  {
    id: 2,
    name: 'Whiskers',
    nickname: 'Whisk',
    pet_type: 'Cat',
    breed: 'Siamese',
    gender: 'Female',
    birthday: '2019-05-20',
    date_admitted: '2019-06-10',
  },
];

describe('PetsIndex', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('displays loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves
    );

    renderWithRouter();
    expect(screen.getByText('Loading pets...')).toBeInTheDocument();
  });

  it('fetches and displays pets', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });

    expect(screen.getByText('"Bud"')).toBeInTheDocument();
    expect(screen.getByText('"Whisk"')).toBeInTheDocument();
    expect(screen.getAllByText('Type:').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Dog').length).toBeGreaterThan(0); // Dog appears in filter dropdown too
    expect(screen.getAllByText('Breed:').length).toBeGreaterThan(0);
    expect(screen.getByText('Labrador')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Failed to fetch data')
    );

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  it('displays "no pets found" message when pets array is empty', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText(/No pets found/)).toBeInTheDocument();
    });
  });

  it('calls fetch with correct URL', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets', {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'test-csrf-token',
        },
      });
    });
  });

  it('handles delete with confirmation', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockPets,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        json: async () => null,
      });

    (global.confirm as jest.Mock).mockReturnValue(true);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this pet?');

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/v1/pets/1', expect.objectContaining({
        method: 'DELETE',
      }));
    });

    await waitFor(() => {
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    (global.confirm as jest.Mock).mockReturnValue(false);

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(global.confirm).toHaveBeenCalled();
    expect(screen.getByText('Buddy')).toBeInTheDocument();
  });

  it('displays correct buttons for each pet', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    // Check for inline action buttons (More, Edit, Delete)
    const moreButtons = screen.getAllByText('▼ More');
    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');

    // Verify buttons exist for each pet
    expect(moreButtons.length).toBeGreaterThan(0);
    expect(editButtons.length).toBeGreaterThan(0);
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it('displays new pet link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      const newLink = screen.getByText('+ Add New Pet');
      expect(newLink).toHaveAttribute('href', '/pets/new');
    });
  });

  // Search and Filter tests
  it('filters pets by search term (name)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name, breed, type...');
    fireEvent.change(searchInput, { target: { value: 'Buddy' } });

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();
    });
  });

  it('filters pets by search term (breed)', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name, breed, type...');
    fireEvent.change(searchInput, { target: { value: 'Siamese' } });

    await waitFor(() => {
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });
  });

  it('filters pets by pet type', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });

    const typeFilter = screen.getByLabelText('Pet Type');
    fireEvent.change(typeFilter, { target: { value: 'Dog' } });

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();
    });
  });

  it('filters pets by gender', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });

    const genderFilter = screen.getByLabelText('Gender');
    fireEvent.change(genderFilter, { target: { value: 'Female' } });

    await waitFor(() => {
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });
  });

  it('combines search and filters', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name, breed, type...');
    const typeFilter = screen.getByLabelText('Pet Type');

    fireEvent.change(searchInput, { target: { value: 'Bu' } });
    fireEvent.change(typeFilter, { target: { value: 'Dog' } });

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();
    });
  });

  it('shows clear filters button when filters are active', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    expect(screen.queryByText('Clear Filters')).not.toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Search by name, breed, type...');
    fireEvent.change(searchInput, { target: { value: 'Buddy' } }); // Use matching term

    await waitFor(() => {
      expect(screen.getAllByText('Clear Filters').length).toBeGreaterThan(0);
    });
  });

  it('clears all filters when clear button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name, breed, type...') as HTMLInputElement;
    const typeFilter = screen.getByLabelText('Pet Type') as HTMLSelectElement;

    fireEvent.change(searchInput, { target: { value: 'Buddy' } });
    fireEvent.change(typeFilter, { target: { value: 'Dog' } });

    await waitFor(() => {
      expect(screen.getByText('Clear Filters')).toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(searchInput.value).toBe('');
      expect(typeFilter.value).toBe('');
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Whiskers')).toBeInTheDocument();
    });
  });

  it('displays filtered count correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Showing 2 of 2 pets')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name, breed, type...');
    fireEvent.change(searchInput, { target: { value: 'Buddy' } });

    await waitFor(() => {
      expect(screen.getByText('Showing 1 of 2 pets (filtered)')).toBeInTheDocument();
    });
  });

  it('shows no matches message when filters match no pets', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPets,
    });

    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Buddy')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name, breed, type...');
    fireEvent.change(searchInput, { target: { value: 'NonexistentPet' } });

    await waitFor(() => {
      expect(screen.getByText('No pets match your filters.')).toBeInTheDocument();
      expect(screen.queryByText('Buddy')).not.toBeInTheDocument();
      expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();
    });
  });
});
