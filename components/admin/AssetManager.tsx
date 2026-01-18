'use client';

import { useState, useEffect } from 'react';
import { getAdminSession } from '@/lib/adminAuth';
import type { MiniGameAsset } from '@/lib/mini-games';

interface AssetManagerProps {
  adminId: string;
}

export default function AssetManager({ adminId }: AssetManagerProps) {
  const [assets, setAssets] = useState<MiniGameAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'audio' | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAssets();
  }, [adminId, activeTab]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/assets?adminId=${adminId}&type=${activeTab === 'all' ? '' : activeTab}`);
      const data = await response.json();

      if (data.success) {
        setAssets(data.assets);
      }
    } catch (error) {
      console.error('Failed to load assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('adminId', adminId);

        const response = await fetch('/api/admin/assets/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        return data.success ? data.asset : null;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(asset => asset !== null);

      if (successfulUploads.length > 0) {
        setAssets(prev => [...successfulUploads, ...prev]);
        alert(`${successfulUploads.length} file(s) uploaded successfully!`);
      }
    } catch (error) {
      console.error('Failed to upload files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/assets/${assetId}?adminId=${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setAssets(prev => prev.filter(asset => asset.id !== assetId));
      }
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || asset.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 font-mono flex items-center justify-center">
        <div className="text-yellow-400">Loading assets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-2 border-yellow-400 p-6 shadow-[0_0_20px_rgba(255,255,0,0.3)] mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">ASSET MANAGER</h1>
              <p className="text-cyan-300 mt-2">Upload and manage images, audio, and other game assets</p>
            </div>
            <div>
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*,audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className={`border-2 border-yellow-400 px-6 py-3 text-yellow-400 font-bold transition-all duration-200 cursor-pointer inline-block ${
                  uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400 hover:text-black'
                }`}
              >
                {uploading ? 'UPLOADING...' : 'UPLOAD ASSETS'}
              </label>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="border border-cyan-400 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              {[
                { key: 'all', label: 'All Assets', count: assets.length },
                { key: 'images', label: 'Images', count: assets.filter(a => a.type === 'image').length },
                { key: 'audio', label: 'Audio', count: assets.filter(a => a.type === 'audio').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 border transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'border-yellow-400 text-yellow-400 bg-yellow-900/20'
                      : 'border-cyan-400 text-cyan-400 hover:border-yellow-400'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-cyan-800 text-cyan-200 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search assets..."
                className="bg-black border border-cyan-400 px-4 py-2 text-cyan-400 focus:outline-none focus:border-yellow-400"
              />
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="border border-yellow-400 p-4 mb-6 bg-yellow-900/20">
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
              <span className="text-yellow-400">Uploading files...</span>
            </div>
          </div>
        )}

        {/* Assets Grid */}
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12 border border-cyan-400">
            <div className="text-cyan-300 mb-4">
              {searchTerm ? 'No assets found matching your search' : 'No assets uploaded yet'}
            </div>
            {!searchTerm && (
              <div>
                <input
                  type="file"
                  id="empty-file-upload"
                  multiple
                  accept="image/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="empty-file-upload"
                  className="border border-yellow-400 px-6 py-3 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200 cursor-pointer inline-block"
                >
                  UPLOAD FIRST ASSET
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div key={asset.id} className="border border-cyan-400 p-4 hover:border-yellow-400 transition-all duration-200">
                {/* Asset Preview */}
                <div className="aspect-square bg-gray-900 border border-gray-700 rounded mb-4 flex items-center justify-center overflow-hidden">
                  {asset.type === 'image' ? (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-cyan-400 text-4xl">🎵</div>
                  )}
                </div>

                {/* Asset Info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-yellow-400 truncate" title={asset.name}>
                    {asset.name}
                  </h3>
                  
                  <div className="flex justify-between text-xs text-cyan-500">
                    <span>{asset.type.toUpperCase()}</span>
                    <span>{formatFileSize(asset.size)}</span>
                  </div>
                  
                  <div className="text-xs text-cyan-600">
                    {formatDate(asset.uploadedAt)}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => window.open(asset.url, '_blank')}
                      className="flex-1 border border-cyan-400 px-2 py-1 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all duration-200 text-xs"
                    >
                      VIEW
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(asset.url);
                        alert('URL copied to clipboard!');
                      }}
                      className="flex-1 border border-yellow-400 px-2 py-1 text-yellow-400 hover:bg-yellow-400 hover:text-black transition-all duration-200 text-xs"
                    >
                      COPY URL
                    </button>
                    <button
                      onClick={() => handleDeleteAsset(asset.id)}
                      className="border border-red-400 px-2 py-1 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-200 text-xs"
                    >
                      DEL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Asset Statistics */}
        {assets.length > 0 && (
          <div className="mt-8 border border-cyan-400 p-4">
            <h2 className="text-lg text-yellow-400 font-semibold mb-4">ASSET STATISTICS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-cyan-400">Total Assets:</span>
                <span className="text-yellow-400 font-bold ml-2">{assets.length}</span>
              </div>
              <div>
                <span className="text-cyan-400">Images:</span>
                <span className="text-yellow-400 font-bold ml-2">
                  {assets.filter(a => a.type === 'image').length}
                </span>
              </div>
              <div>
                <span className="text-cyan-400">Audio:</span>
                <span className="text-yellow-400 font-bold ml-2">
                  {assets.filter(a => a.type === 'audio').length}
                </span>
              </div>
              <div>
                <span className="text-cyan-400">Total Size:</span>
                <span className="text-yellow-400 font-bold ml-2">
                  {formatFileSize(assets.reduce((total, asset) => total + asset.size, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}