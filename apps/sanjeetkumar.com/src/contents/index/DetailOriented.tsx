import clsx from 'clsx';

import SectionTitle from '@/components/sections/SectionTitle';

function DetailOriented() {
  return (
    <header className={clsx('mb-8')}>
      <SectionTitle
        title="Intelligent Process Automation & AI Solutions."
        caption="AI & Automation"
        description="Harvard AI certified with expertise in Agentic AI frameworks, RPA (UiPath, Blue Prism), and rapid prototyping for business process automation."
      />
    </header>
  );
}

export default DetailOriented;
