import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ExternalLink, Github, Search, Filter, Eye } from "lucide-react";
import { useProjects } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';
import { useAnalytics } from '../hooks/useAnalytics';

export const ProjectsSection = () => {
  const { 
    filteredProjects, 
    filters, 
    categories, 
    technologies, 
    setFilter, 
    clearFilters,
    loading,
    error 
  } = useProjects();

  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.searchTerm);
  const { trackProjectView, trackProjectInteraction } = useAnalytics();
  const navigate = useNavigate();

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm !== filters.searchTerm) {
        setFilter('searchTerm', searchTerm);
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm, filters.searchTerm, setFilter]);

  const handleProjectClick = (project, action) => {
    trackProjectInteraction(project.id, action, project.title);
  };

const handleSearchChange = (e) => {
  const value = e.target.value;
  setSearchTerm(value);
  
  // Clear any existing timeout
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  // Set immediate update for short searches, debounced for longer ones
  if (value.length <= 2) {
    setFilter('searchTerm', value);
  } else {
    searchTimeoutRef.current = setTimeout(() => {
      setFilter('searchTerm', value);
    }, 300); // Reduced debounce time for faster response
  }
};

// Add this ref at the top of your component
const searchTimeoutRef = useRef(null);

// Clean up timeout on unmount
useEffect(() => {
  return () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };
}, []);

  const handleCategoryChange = (category) => {
    setFilter('category', category);
  };

  const handleTechnologyChange = (technology) => {
    setFilter('technology', technology);
  };

  if (loading) {
    return (
      <section id="projects" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-24 px-4 relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center text-red-500">
            <p>Error loading projects: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Featured <span className="text-primary">Projects</span>
        </h2>

        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Here are some of my recent projects.
        </p>

        {/* Search and Filters */}
        {/* <div className="mb-8 space-y-4"> */}
          {/* Search Bar */}
{/* <div className="relative max-w-md mx-auto">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
  <input
    type="text"
    placeholder="Search projects..."
    value={searchTerm}
    onChange={handleSearchChange}
    onInput={handleSearchChange} // Add this for better browser compatibility
    className="w-full pl-10 pr-4 py-2 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
  />
  {searchTerm && (
    <button
      onClick={() => setSearchTerm('')}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
    >
      <X size={16} />
    </button>
  )}
</div> */}

          {/* Filter Toggle */}
        {/* Results Count */}
        <div className="text-center mb-6 text-sm text-muted-foreground">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No projects found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="cosmic-button"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onViewDetails={() => {
                  trackProjectView(project.id, project.title, 'grid');
                  navigate(`/project/${project.slug}`);
                }}
                onDemoClick={() => handleProjectClick(project, 'demo_click')}
                onGithubClick={() => handleProjectClick(project, 'github_click')}
              />
            ))}
          </div>
        )}

        {/* <div className="text-center mt-12">
          <a
            className="cosmic-button w-fit flex items-center mx-auto gap-2"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/p1407"
          >
            View All Projects <ArrowRight size={16} />
          </a>
        </div> */}
      </div>
    </section>
  );
};

// Project Card Component
const ProjectCard = ({ project, onViewDetails, onDemoClick, onGithubClick }) => {
  return (
    <div className="group bg-card rounded-lg overflow-hidden shadow-sm card-hover">
      <div className="h-48 overflow-hidden relative">
        <img
          src={project.images[0] || "/projects/placeholder.png"}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {project.featured && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <span 
              key={tech}
              className="px-2 py-1 text-xs font-medium border rounded-full bg-secondary text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium text-muted-foreground">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                onClick={onDemoClick}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors duration-300"
                title="View Live Demo"
              >
                <ExternalLink size={20} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                onClick={onGithubClick}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors duration-300"
                title="View Source Code"
              >
                <Github size={20} />
              </a>
            )}
          </div>
          <button
            onClick={onViewDetails}
            className="text-foreground/80 hover:text-primary transition-colors duration-300"
            title="View Details"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
