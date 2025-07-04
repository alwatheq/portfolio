import { Helmet } from 'react-helmet-async';

export const SEO = ({ project }) => (
  <Helmet>
    <title>{project.title} | Your Portfolio</title>
    <meta name="description" content={project.description} />
    <meta property="og:title" content={project.title} />
    <meta property="og:description" content={project.description} />
    <meta property="og:image" content={project.images[0]} />
    <meta property="og:type" content="website" />
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": project.title,
        "description": project.description,
        "image": project.images,
        "url": project.demoUrl,
        "author": {
          "@type": "Person",
          "name": "Abdulrahman Alharbi"
        }
      })}
    </script>
  </Helmet>
);