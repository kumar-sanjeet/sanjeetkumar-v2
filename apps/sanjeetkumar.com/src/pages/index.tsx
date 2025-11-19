import Head from '@/components/meta/Head';

import { getBaseUrl } from '@/helpers/url';

import IndexContents from '@/contents/index';

function Index() {
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sanjeet Kumar',
    url: 'https://www.sanjeetkumar.com',
    jobTitle: 'Enterprise Architecture Director',
    worksFor: {
      '@type': 'Organization',
      name: 'LandSure Systems Ltd.',
    },
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of California, Berkeley',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Indian Institute of Technology Kharagpur',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'Harvard University',
      },
    ],
    knowsAbout: [
      'Enterprise Architecture',
      'AI Architecture',
      'RPA',
      'Business Process Automation',
      'TOGAF',
      'Digital Transformation',
      'IT Governance',
      'Agentic AI',
    ],
    sameAs: [
      'https://www.linkedin.com/in/sanjeetkumar',
      'https://twitter.com/sanjeet_kumar',
    ],
  });

  return (
    <>
      <Head
        title="Sanjeet Kumar · Enterprise Architect · Enterprise Architecture Director · AI Architect"
        description="Sanjeet Kumar - Enterprise Architect & Enterprise Architecture Director at LandSure Systems. Available for Enterprise Architecture Manager, Chief Enterprise Architect, and Principal Enterprise Architect roles. TOGAF & Harvard AI certified with 20+ years experience in Enterprise Architecture, AI/RPA, Business Process Automation, IT Governance, and Digital Transformation. Expertise in UiPath, Blue Prism, Agentic AI, CGEIT, COBIT 5, PMP."
        ogImage={`${getBaseUrl()}/assets/images/og-image.png`}
        overrideTitle
        structuredData={structuredData}
      />
      <IndexContents />
    </>
  );
}

export default Index;
