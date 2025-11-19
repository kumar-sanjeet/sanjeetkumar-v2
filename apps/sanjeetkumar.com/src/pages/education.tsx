import EducationContents from '@/contents/Education';
import HeaderImage from '@/contents/Education/HeaderImage';
import Page from '@/contents-layouts/Page';

function Education() {
  return (
    <Page
      frontMatter={{
        title: 'Education & Certifications',
        description: `Academic background and professional certifications.`,
      }}
      headerImage={<HeaderImage />}
    >
      <EducationContents />
    </Page>
  );
}

export default Education;
