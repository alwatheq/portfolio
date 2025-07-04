// services/projectService.js
import { supabase } from '../config/supabase';

// Simple search cache - ONLY for search performance
let searchCache = null;
let cacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const isValidCache = () => {
  return searchCache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION);
};

const clearCache = () => {
  searchCache = null;
  cacheTime = null;
};

// Clear cache on page refresh
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', clearCache);
}

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const projectService = {
  async getProjects(params = {}) {
    try {
      // Check if we can use cache for search/filter operations
      const hasFilters = (params.category && params.category !== 'all') ||
                        (params.technology && params.technology !== 'all') ||
                        params.search;

      // If we have filters and valid cache, use client-side filtering
      if (hasFilters && isValidCache()) {
        console.log('Using cached data for filtering');
        return this.filterCachedData(searchCache, params);
      }

      console.log('Fetching projects from Supabase...');

      let query = supabase
        .from('projects')
        .select('*')
        .eq('is_published', true)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: true });

      // Apply filters
      if (params.category && params.category !== 'all') {
        query = query.eq('category', params.category);
      }

      if (params.technology && params.technology !== 'all') {
        query = query.contains('technologies', [params.technology]);
      }

      if (params.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`);
      }

      // Handle pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query.range(from, to);

      console.log('Supabase response:', { data, error, count });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      // Cache data for future filtering (only if no filters applied)
      if (!hasFilters && data && data.length > 0) {
        // Fetch all data for cache (without pagination)
        const { data: allData } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });
        
        if (allData) {
          searchCache = allData;
          cacheTime = Date.now();
          console.log('Data cached for future searches');
        }
      }

      return {
        success: true,
        data: {
          projects: data || [],
          pagination: {
            currentPage: page,
            totalPages: Math.ceil((count || 0) / limit),
            totalItems: count || 0,
            itemsPerPage: limit,
          },
        },
      };
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  },

  // Helper method for client-side filtering of cached data
  filterCachedData(cachedData, params) {
    let filtered = [...cachedData];

    // Apply category filter
    if (params.category && params.category !== 'all') {
      filtered = filtered.filter(project => project.category === params.category);
    }

    // Apply technology filter
    if (params.technology && params.technology !== 'all') {
      filtered = filtered.filter(project => 
        project.technologies && project.technologies.includes(params.technology)
      );
    }

    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm)
      );
    }

    // Handle pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / limit);
    const from = (page - 1) * limit;
    const to = from + limit;
    
    const paginatedProjects = filtered.slice(from, to);

    return {
      success: true,
      data: {
        projects: paginatedProjects,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
        },
      },
    };
  },

  async createProject(projectData) {
    try {
      console.log('Creating project:', projectData);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const dataToInsert = {
        title: projectData.title,
        slug: slugify(projectData.title),
        description: projectData.description,
        long_description: projectData.longDescription || '',
        category: projectData.category,
        technologies: projectData.technologies || [],
        tags: projectData.tags || [],
        images: projectData.images || [],
        videos: projectData.videos || [],
        demo_url: projectData.demoUrl || null,
        github_url: projectData.githubUrl || null,
        featured: projectData.featured || false,
        status: projectData.status,
        is_published: true,
        created_by: user.id,
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw new Error(error.message);
      }

      // Clear cache when new project is created
      clearCache();

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Create project error:', error);
      throw error;
    }
  },

  async updateProject(id, projectData) {
    try {
      console.log('Updating project:', id, projectData);

      const dataToUpdate = {
        title: projectData.title,
        description: projectData.description,
        long_description: projectData.longDescription || '',
        category: projectData.category,
        technologies: projectData.technologies || [],
        tags: projectData.tags || [],
        images: projectData.images || [],
        videos: projectData.videos || [],
        demo_url: projectData.demoUrl || null,
        github_url: projectData.githubUrl || null,
        featured: projectData.featured || false,
        status: projectData.status,
        updated_at: new Date().toISOString(),
      };

      if (projectData.title) {
        dataToUpdate.slug = slugify(projectData.title);
      }

      const { data, error } = await supabase
        .from('projects')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        throw new Error(error.message);
      }

      // Clear cache when project is updated
      clearCache();

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Update project error:', error);
      throw error;
    }
  },

  async deleteProject(id) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      // Clear cache when project is deleted
      clearCache();

      return {
        success: true
      };
    } catch (error) {
      console.error('Delete project error:', error);
      throw error;
    }
  },

  async getProjectById(id) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Increment view count
      await supabase
        .from('projects')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Get project error:', error);
      throw error;
    }
  },

  async getProjectStats() {
    try {
      const { count: totalProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      const { count: featuredProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .eq('featured', true);

      const { count: completedProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .eq('status', 'completed');

      const { count: inProgressProjects } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .eq('status', 'in-progress');

      return {
        success: true,
        data: {
          overview: {
            total: totalProjects || 0,
            featured: featuredProjects || 0,
            completed: completedProjects || 0,
            inProgress: inProgressProjects || 0
          }
        }
      };
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  async getProjectBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      // Increment view count
      await supabase
        .from('projects')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Get project by slug error:', error);
      throw error;
    }
  }
};