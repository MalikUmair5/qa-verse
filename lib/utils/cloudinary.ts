import { Cloudinary } from '@cloudinary/url-gen'

// Initialize Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dp6ieblt3'
  }
})

export { cld }

/**
 * Upload file to Cloudinary using unsigned upload
 * @param file - The file to upload
 * @param folder - The folder to upload to (optional)
 * @returns Promise<string> - The secure URL of the uploaded file
 */
export const uploadToCloudinary = async (
  file: File, 
  folder: string = 'bug-attachments'
): Promise<string> => {
  // List of common unsigned presets to try
  const presets = ['ml_default', 'unsigned_uploads', 'upload_preset', 'default_preset']
  
  for (const preset of presets) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', preset)
      formData.append('folder', folder)
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dp6ieblt3/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      
      const data = await response.json()
      
      if (response.ok) {
        return data.secure_url
      }
      
      // If this preset failed but response has error details, log it
      console.warn(`Preset '${preset}' failed:`, data.error?.message || 'Unknown error')
      
      // If it's not a preset error, throw immediately
      if (!data.error?.message?.includes('Upload preset not found') && 
          !data.error?.message?.includes('preset') &&
          !data.error?.message?.includes('Preset')) {
        throw new Error(data.error?.message || 'Failed to upload file to Cloudinary')
      }
    } catch (error) {
      // Only log for preset-related errors, continue trying other presets
      if (error instanceof Error && error.message.includes('preset')) {
        console.warn(`Failed with preset '${preset}':`, error.message)
        continue
      }
      // For non-preset errors, throw immediately
      throw error
    }
  }
  
  // If all presets failed, provide helpful error message
  throw new Error(
    'No valid upload preset found. Please create an unsigned upload preset in your Cloudinary console:\n' +
    '1. Go to Settings > Upload in Cloudinary console\n' +
    '2. Click "Add upload preset"\n' +
    '3. Set "Signing mode" to "Unsigned"\n' +
    '4. Name it "ml_default" or "unsigned_uploads"\n' +
    '5. Save the preset'
  )
}

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of files to upload
 * @param folder - The folder to upload to (optional)
 * @returns Promise<string[]> - Array of secure URLs of uploaded files
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  folder: string = 'bug-attachments'
): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder))
    return await Promise.all(uploadPromises)
  } catch (error) {
    console.error('Error uploading multiple files to Cloudinary:', error)
    throw new Error('Failed to upload files')
  }
}