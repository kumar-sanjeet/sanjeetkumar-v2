import clsx from 'clsx';

import Contents from '@/contents/Education/Contents.mdx';

function EducationContents() {
  return (
    <div className={clsx('content-wrapper mdx-contents')}>
      <Contents />
    </div>
  );
}

export default EducationContents;
