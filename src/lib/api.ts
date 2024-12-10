interface Profile {
  id?: number;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  createdAt?: string;
}

const API_URL = 'http://localhost:3001/api';

export const profileService = {
  async createProfile(profile: Omit<Profile, 'id' | 'createdAt'>) {
    const response = await fetch(`${API_URL}/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create profile');
    }
    
    return response.json();
  },

  async getProfiles(): Promise<Profile[]> {
    const response = await fetch(`${API_URL}/profiles`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch profiles');
    }
    
    return response.json();
  },

  async getProfile(id: number): Promise<Profile> {
    const response = await fetch(`${API_URL}/profiles/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },

  async updateProfile(id: number, profile: Partial<Profile>) {
    const response = await fetch(`${API_URL}/profiles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }
    
    return response.json();
  },

  async deleteProfile(id: number) {
    const response = await fetch(`${API_URL}/profiles/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete profile');
    }
    
    return response.json();
  },
};
