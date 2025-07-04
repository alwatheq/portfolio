import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { projectService } from '../services/projectService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '../config/supabase';

const ProjectContext = createContext();

// Initial state
const initialState = {
  projects: [],
  filteredProjects: [],
  loading: false,
  error: null,
  filters: {
    category: 'all',
    technology: 'all',
    searchTerm: '',
    page: 1,
    limit: 10
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  },
   categories : [
  "all",
  "Mobile Apps",
  "IoT & Robotics", 
  "Web Apps",
  "Embedded Systems",
  "Competition",
  "Other"
],
technologies : [
  "All Technologies",
  "Flutter",
  "ESP32/Arduino", 
  "ROS2",
  "Python",
  "Next.js",
  "Node.js",
  "C/C++",
  "Firebase",
  "MQTT",
  "React"
],
  stats: null
};

// Reducer function
const projectReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PROJECTS':
      return { 
        ...state, 
        projects: action.payload.projects,
        filteredProjects: action.payload.projects,
        pagination: action.payload.pagination,
        loading: false,
        error: null
      };
    
    case 'SET_FILTER':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
    
    case 'CLEAR_FILTERS':
      const clearedFilters = { 
        category: 'all', 
        technology: 'all', 
        searchTerm: '',
        page: 1,
        limit: 10
      };
      return {
        ...state,
        filters: clearedFilters
      };

    case 'SET_STATS':
      return {
        ...state,
        stats: action.payload
      };
    
    default:
      return state;
  }
};

// Provider component
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const { toast } = useToast();

  // Use useCallback to prevent infinite re-renders
  const fetchProjects = useCallback(async (filters) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const filtersToUse = filters || state.filters;
      
      const params = {
        page: filtersToUse.page,
        limit: filtersToUse.limit,
        ...(filtersToUse.category !== 'all' && { category: filtersToUse.category }),
        ...(filtersToUse.technology !== 'all' && { technology: filtersToUse.technology }),
        ...(filtersToUse.searchTerm && { search: filtersToUse.searchTerm })
      };

      const response = await projectService.getProjects(params);
      
      if (response.success) {
        dispatch({ 
          type: 'SET_PROJECTS', 
          payload: response.data 
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message });
      }
    } catch (error) {
      console.error('Fetch projects error:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error.message || 'Failed to fetch projects' 
      });
    }
  }, [state.filters]);

  // Fetch project stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await projectService.getProjectStats();
      if (response.success) {
        dispatch({ type: 'SET_STATS', payload: response.data });
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    const subscription = supabase
      .channel('projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, 
        (payload) => {
          console.log('Project changed:', payload);
          // Refresh projects when changes occur
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProjects]);

  // Load projects on mount and when filters change
  useEffect(() => {
    fetchProjects(state.filters);
  }, [state.filters, fetchProjects]);

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const actions = {
    addProject: async (projectData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await projectService.createProject(projectData);
        
        if (response.success) {
          await fetchProjects(); // Refresh projects list
          toast({
            title: "Success",
            description: "Project created successfully!"
          });
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        const errorMessage = error.message || 'Failed to create project';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        throw error;
      }
    },

    updateProject: async (id, projectData) => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await projectService.updateProject(id, projectData);
        
        if (response.success) {
          await fetchProjects(); // Refresh projects list
          toast({
            title: "Success",
            description: "Project updated successfully!"
          });
          return response.data;
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        const errorMessage = error.message || 'Failed to update project';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        throw error;
      }
    },

    deleteProject: async (id) => {
      try {
        const response = await projectService.deleteProject(id);
        
        if (response.success) {
          await fetchProjects(); // Refresh projects list
          toast({
            title: "Success",
            description: "Project deleted successfully!"
          });
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        const errorMessage = error.message || 'Failed to delete project';
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        });
        throw error;
      }
    },

    setFilter: (filterType, value) => {
      const newFilters = { [filterType]: value };
      
      // Reset page when changing filters
      if (filterType !== 'page') {
        newFilters.page = 1;
      }

      dispatch({ type: 'SET_FILTER', payload: newFilters });
    },

    clearFilters: () => {
      dispatch({ type: 'CLEAR_FILTERS' });
    },

    refreshProjects: () => {
      fetchProjects();
    },

    refreshStats: () => {
      fetchStats();
    }
  };

  return (
    <ProjectContext.Provider value={{ ...state, ...actions }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Custom hook
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};