import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ImageUpload = ({ images = [], onChange, max = 5, className = '' }) => {
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const currentCount = images.length;
    const remainingSlots = max - currentCount;

    if (files.length > remainingSlots) {
      alert(`You can only upload ${max} images. ${remainingSlots} slots remaining.`);
      return;
    }

    // Create previews
    const newPreviews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setPreviews([...previews, ...newPreviews]);
    
    // Pass files to parent
    const allFiles = [...images, ...files];
    onChange(allFiles);
  };

  const removeImage = (index) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newFiles = images.filter((_, i) => i !== index);
    
    // Revoke URL to avoid memory leaks
    URL.revokeObjectURL(previews[index].url);
    
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Button */}
      {images.length < max && (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              {images.length}/{max} images uploaded
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview.url}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
