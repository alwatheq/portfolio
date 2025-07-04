import { supabase } from '../config/supabase'

export const messageService = {
  async sendMessage(messageData) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          name: messageData.name,
          email: messageData.email,
          message: messageData.message,
        }])
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Send message error:', error)
      throw error
    }
  },

  async getMessages(params = {}) {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (params.status && params.status !== 'all') {
        query = query.eq('status', params.status)
      }

      if (params.search) {
        query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%,message.ilike.%${params.search}%`)
      }

      // Handle pagination
      const page = params.page || 1
      const limit = params.limit || 20
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await query
        .range(from, to)

      if (error) {
        throw new Error(error.message)
      }

      return {
        success: true,
        data: {
          messages: data || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil((count || 0) / limit),
            totalItems: count || 0,
            itemsPerPage: limit
          }
        }
      }
    } catch (error) {
      console.error('Get messages error:', error)
      throw error
    }
  },


}