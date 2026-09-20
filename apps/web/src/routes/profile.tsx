import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ListingCard, type Listing } from '../components/ListingCard';
import './profile.css';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

const DUMMY_FAVORITES: Listing[] = [
  {
    id: '1',
    title: 'Sony Alpha a7 III Mirrorless Camera',
    price: 1400,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    valuation: 'great',
    location: 'San Francisco, CA',
    exchangeMethod: 'Pickup Only',
    createdAt: new Date().toISOString(),
    condition: 'used-like-new',
    tags: ['camera', 'sony'],
    description: 'Barely used Sony a7 III.'
  }
];

const DUMMY_BOOKMARK_FOLDERS = [
  { id: 'f1', name: 'Office Setup 🖥️', count: 4 },
  { id: 'f2', name: 'Summer Wardrobe 👕', count: 12 },
  { id: 'f3', name: '3D Print Ideas 🎨', count: 2 },
];

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'bookmarks' | 'settings'>('favorites');

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar-large">A</div>
        <div className="profile-info">
          <h1 className="profile-name">Alex Doe</h1>
          <p className="profile-meta">Member since Sep 2026 • San Francisco, CA</p>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favorites
        </button>
        <button 
          className={`profile-tab ${activeTab === 'bookmarks' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarks')}
        >
          📁 Bookmarks
        </button>
        <button 
          className={`profile-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'favorites' && (
          <div className="tab-pane">
            <h2>Your Favorites</h2>
            <p className="tab-subtitle">Items you've hearted.</p>
            <div className="grid-feed">
              {DUMMY_FAVORITES.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="tab-pane">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-4)' }}>
              <h2>Bookmark Folders</h2>
              <button className="btn btn-primary">+ New Folder</button>
            </div>
            <p className="tab-subtitle">Organize your saved listings into custom folders.</p>
            
            <div className="folders-grid">
              {DUMMY_BOOKMARK_FOLDERS.map(folder => (
                <div key={folder.id} className="folder-card">
                  <div className="folder-icon">📁</div>
                  <div className="folder-details">
                    <h3 className="folder-name">{folder.name}</h3>
                    <p className="folder-count">{folder.count} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-pane">
            <h2>Account Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" className="input" defaultValue="Alex Doe" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" className="input" defaultValue="alex@example.com" />
              </div>
              <div className="form-group">
                <label>Default Location</label>
                <input type="text" className="input" defaultValue="San Francisco, CA" />
              </div>
              <button className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)' }}>Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
