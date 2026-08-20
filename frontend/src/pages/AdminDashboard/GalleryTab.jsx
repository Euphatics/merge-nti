import React, { useState, useEffect } from 'react';
import { Trash2, UploadCloud, Image as ImageIcon, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL, secureFetch } from '../../config/api';
import Skeleton from '../../components/Skeleton';
import ConfirmModal from '../../components/ConfirmModal';

export default function GalleryTab() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  // Form State
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('');
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !name || !school || !className) {
      toast.error('Please fill in all fields and select an image');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('school', school);
      formData.append('className', className);

      const res = await secureFetch(`${API_BASE_URL}/api/admin/gallery`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      });

      if (res.ok) {
        toast.success('Image uploaded successfully');
        setShowForm(false);
        setFile(null);
        setPreview(null);
        setName('');
        setSchool('');
        setClassName('');
        fetchImages();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await secureFetch(`${API_BASE_URL}/api/admin/gallery/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Image deleted');
        setImages(images.filter((img) => img.id !== id));
      } else {
        toast.error('Failed to delete image');
      }
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ImageIcon className="text-[#007BFF]" /> Gallery Management
          </h2>
          <p className="text-gray-500 mt-1">Upload and manage images for the public gallery.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#007BFF] text-white rounded-md font-medium hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : <><Plus size={18} /> Add New Image</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Radhika Narang"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  required
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Vivek International Public School"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Class 9"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full min-h-[200px]">
                <div className="space-y-1 text-center flex flex-col justify-center items-center">
                  {preview ? (
                    <img src={preview} alt="Preview" className="mx-auto h-32 object-cover rounded-md mb-2" />
                  ) : (
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 15MB</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Save Image'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} width="100%" height="250px" borderRadius="8px" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 text-lg">No images in the gallery.</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add New Image" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div key={img.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm group">
              <div className="h-48 overflow-hidden relative bg-gray-100">
                <img src={`${API_BASE_URL}${img.image}`} alt={img.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setConfirmModal({ isOpen: true, id: img.id })}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-md"
                  title="Delete image"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 truncate">{img.name}</h4>
                <p className="text-xs text-gray-500 truncate mt-1">{img.school}</p>
                <p className="text-xs font-semibold text-[#007BFF] mt-1">{img.className}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={() => handleDelete(confirmModal.id)}
        onCancel={() => setConfirmModal({ isOpen: false, id: null })}
      />
    </div>
  );
}
