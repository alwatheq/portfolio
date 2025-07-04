import { supabase } from '../config/supabase'

export const imageService = {
  async uploadImage(file, folder = 'projects') {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload file
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName)

      return {
        success: true,
        url: publicUrl,
        path: fileName
      }
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  },

  async deleteImage(path) {
    try {
      const { error } = await supabase.storage
        .from('project-images')
        .remove([path])

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Image delete error:', error)
      throw error
    }
  }
}