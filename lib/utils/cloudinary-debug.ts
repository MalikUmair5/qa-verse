/**
 * Development utility to help debug Cloudinary upload preset issues
 * This file can be deleted once upload presets are properly configured
 */

export const checkCloudinaryConfig = async () => {
  const cloudName = 'dp6ieblt3'
  const testPresets = ['ml_default', 'unsigned_uploads', 'upload_preset', 'default_preset']
  
  console.log('🔍 Checking Cloudinary configuration...')
  console.log(`Cloud name: ${cloudName}`)
  
  // Create a tiny test file (1x1 transparent PNG)
  const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII='
  
  // Convert data URL to blob
  const response = await fetch(testImageData)
  const blob = await response.blob()
  const testFile = new File([blob], 'test.png', { type: 'image/png' })
  
  for (const preset of testPresets) {
    try {
      console.log(`🧪 Testing preset: ${preset}`)
      
      const formData = new FormData()
      formData.append('file', testFile)
      formData.append('upload_preset', preset)
      
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      
      const result = await uploadResponse.json()
      
      if (uploadResponse.ok) {
        console.log(`✅ Preset '${preset}' works! URL: ${result.secure_url}`)
        return { success: true, preset, url: result.secure_url }
      } else {
        console.log(`❌ Preset '${preset}' failed: ${result.error?.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.log(`❌ Preset '${preset}' error:`, error)
    }
  }
  
  console.log('❌ No working presets found!')
  console.log('📝 Please create an unsigned upload preset:')
  console.log('1. Go to https://cloudinary.com/console')
  console.log('2. Settings > Upload > Add upload preset')
  console.log('3. Name: ml_default, Signing mode: Unsigned')
  
  return { success: false }
}

// Run this function in browser console to debug
if (typeof window !== 'undefined') {
  (window as any).checkCloudinaryConfig = checkCloudinaryConfig
  console.log('💡 Run checkCloudinaryConfig() in console to test your Cloudinary setup')
}