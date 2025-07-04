import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Github, Calendar, Eye, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { marked } from 'marked';
import { projectService } from '@/services/projectService';
import { cn } from '@/lib/utils';
import { StarBackground } from '@/components/StarBackground';
import { useAnalytics } from '@/hooks/useAnalytics';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

// Simple markdown to HTML converter
const markdownToHtml = (markdown) => {
  if (!markdown) return '';
  
  return marked(markdown, {
    gfm: true,
    breaks: true,
  });
};

function getYouTubeEmbedUrl(url) {
  // Regular expressions for different YouTube URL formats
  const patterns = [
    // Standard YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    // YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
    // Short YouTube URLs: https://youtu.be/VIDEO_ID
    /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]+)/,
    // Mobile YouTube URLs: https://m.youtube.com/watch?v=VIDEO_ID
    /(?:https?:\/\/)?m\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    // YouTube embed URLs: https://www.youtube.com/embed/VIDEO_ID
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
  ];

  // Try each pattern to extract video ID
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // If no pattern matches, return null or throw an error
  return null;
}

export const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { trackProjectView } = useAnalytics();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectService.getProjectBySlug(slug);
        
        if (response.success) {
          setProject(response.data);
          trackProjectView(response.data.id, response.data.title);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProject();
    }
  }, [slug, trackProjectView]);

  const nextImage = () => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <StarBackground />
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <StarBackground />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'The project you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="cosmic-button flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StarBackground />
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border z-40">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Portfolio
            </button>
            
            <div className="flex items-center gap-4">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cosmic-button flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                  View Code
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h1 className="text-4xl font-bold">{project.title}</h1>
              {project.featured && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-xl text-muted-foreground mb-6">{project.description}</p>
            
            {/* Project Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              {project.view_count > 0 && (
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{project.view_count} views</span>
                </div>
              )}
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium",
                project.status === 'completed' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                project.status === 'in-progress' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              )}>
                {project.status.replace('-', ' ').toUpperCase()}
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>


          {/* Image Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="mb-8">
              <div className="relative aspect-video bg-secondary rounded-lg overflow-hidden mb-4">
                <img
                  src={project.images[currentImageIndex]}
                  alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>
              
              {/* Image Thumbnails */}
              {project.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {project.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors",
                        index === currentImageIndex ? "border-primary" : "border-transparent hover:border-border"
                      )}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Markdown Content */}
          {project.long_description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Project Details</h2>
              <div>
              <MarkdownRenderer 
  content={project.long_description}
  className="prose prose-lg max-w-3xl w-full text-justify"
/>
              </div>
            </div>
          )}


          {/* Videos */}
          {project.videos && project.videos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Demo Videos</h2>
              <div className="space-y-4">
                {project.videos.map((video, index) => {
                      const embedUrl = getYouTubeEmbedUrl(video);

                  return (

                    <div key={index} className="aspect-video bg-secondary rounded-lg overflow-hidden">
                      <iframe
                        src={embedUrl}
                        title={`${project.title} Demo Video ${index + 1}`}
                        className="w-full h-full"
                        allowFullScreen />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <div className="bg-card p-6 rounded-lg border border-border text-center">
            <h3 className="text-xl font-semibold mb-2">Interested in this project?</h3>
            <p className="text-muted-foreground mb-4">
              Check out the live demo or view the source code to learn more about how it was built.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cosmic-button flex items-center gap-2"
                >
                  <ExternalLink size={16} />
                  View Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors flex items-center gap-2"
                >
                  <Github size={16} />
                  View Source Code
                </a>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};