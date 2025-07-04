import { useState } from 'react';
import { X, ExternalLink, ChevronLeft, ChevronRight, Play, Github as GithubIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { marked } from 'marked';



// Simple markdown to HTML converter
const markdownToHtml = (markdown) => {
    if (!markdown) return '';

  return marked(markdown, {
    gfm: true,
    breaks: true,
  });
};

export const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "px-2 py-1 rounded-full text-xs font-medium",
                project.status === 'completed' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                project.status === 'in-progress' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" :
                "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              )}>
                {project.status}
              </span>
              {project.featured && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Featured
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Image Gallery */}
          {project.images && project.images.length > 0 && (
            <div className="relative h-64 bg-secondary">
              <img
                src={project.images[currentImageIndex]}
                alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              
              {project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {project.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          index === currentImageIndex ? "bg-primary" : "bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>

            {/* Long Description (Markdown rendered as HTML) */}
          {project.long_description && (
  <div className="flex justify-center">
    <div className="prose prose-sm dark:prose-invert max-w-3xl w-full text-center markdown-content"
         dangerouslySetInnerHTML={{ 
           __html: markdownToHtml(project.long_description) 
         }} 
    />
  </div>
)}

            {/* Technologies */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies && project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Videos */}
            {project.videos && project.videos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Demo Videos</h3>
                <div className="space-y-3">
                  {project.videos.map((video, index) => (
                    <div key={index} className="relative">
                      <a
                        href={video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-secondary transition-colors"
                      >
                        <Play size={16} />
                        <span>Demo Video {index + 1}</span>
                        <ExternalLink size={14} className="ml-auto" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Links */}
            <div className="flex gap-4 pt-4">
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
                  <GithubIcon size={16} />
                  Source Code
                </a>
              )}
            </div>

            {/* Project Info */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border text-sm">
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p>{new Date(project.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last Updated:</span>
                <p>{new Date(project.updated_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};