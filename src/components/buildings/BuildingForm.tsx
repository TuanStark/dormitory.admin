import React from 'react';
import { Building } from '../../types';

interface BuildingFormProps {
  building?: Building;
  onChange: (field: string, value: string | number) => void;
  formData: {
    name: string;
    address: string;
    description: string;
    floors: number;
    image?: string;
    latitude: number;
    longitude: number;
  };
}

const BuildingForm: React.FC<BuildingFormProps> = ({
  building,
  onChange,
  formData
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange(name, name === 'floors' ? parseInt(value) : value);
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Tên tòa nhà <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Nhập tên tòa nhà"
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Nhập địa chỉ tòa nhà"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Mô tả về tòa nhà"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Floors */}
        <div>
          <label htmlFor="floors" className="block text-sm font-medium text-gray-700 mb-1">
            Số tầng <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="floors"
            name="floors"
            value={formData.floors}
            onChange={handleInputChange}
            required
            min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            URL Hình ảnh
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="URL hình ảnh tòa nhà (tùy chọn)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latitude */}
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
            Vĩ độ <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            required
            step="0.000001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ví dụ: 21.028511"
          />
        </div>

        {/* Longitude */}
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
            Kinh độ <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            required
            step="0.000001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ví dụ: 105.804817"
          />
        </div>
      </div>

      {/* Map Preview */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Xem trước vị trí
        </label>
        <div className="bg-gray-100 rounded-lg overflow-hidden h-48">
          {formData.latitude && formData.longitude ? (
            <iframe 
              title="Building Location"
              width="100%" 
              height="100%" 
              frameBorder="0" 
              src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`} 
              allowFullScreen
            ></iframe>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Nhập vĩ độ và kinh độ để xem trước vị trí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuildingForm;