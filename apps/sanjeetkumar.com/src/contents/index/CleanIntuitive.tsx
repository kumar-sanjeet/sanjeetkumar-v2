import clsx from 'clsx';
import { useState } from 'react';

import { SectionButton } from '@/components/sections/SectionButton';
import SectionContent from '@/components/sections/SectionContent';
import SectionTitle from '@/components/sections/SectionTitle';

import type { TodoItemState } from '@/contents/index/Cards/TodoItem';

type Content = {
  state: TodoItemState;
  shows: Array<TodoItemState>;
  title: string;
  description: string;
};

const content: Array<Content> = [
  {
    state: 'typography',
    shows: ['typography'],
    title: 'Simple Solutions',
    description:
      'Complexity is the enemy of execution. Keep it simple, scalable, and effective.',
  },
  {
    state: 'spacing',
    shows: ['typography', 'spacing'],
    title: 'Standardization',
    description:
      'Establish common frameworks and patterns for consistency across the enterprise.',
  },
  {
    state: 'colors',
    shows: ['typography', 'spacing', 'colors'],
    title: 'Business First',
    description:
      'Technology serves business goals. Align every solution with strategic objectives.',
  },
  {
    state: 'effects',
    shows: ['typography', 'spacing', 'colors', 'effects'],
    title: 'Decentralized',
    description:
      'Empower teams with autonomy while maintaining governance and architectural principles.',
  },
];

function CleanIntuitive() {
  const [currentState, setCurrentState] = useState<Content | null>(null);

  return (
    <>
      <header className={clsx('mb-8')}>
        <SectionTitle
          title="Strategic Technology Planning & Framework Design."
          caption="Enterprise Architecture"
          description="TOGAF certified architect with proven experience in designing enterprise frameworks, technology roadmaps, and aligning IT strategy with business objectives."
        />
      </header>
      <SectionContent>
        <div className={clsx('flex', 'lg:gap-12')}>
          <div
            className={clsx('-mt-8 hidden flex-1 flex-col gap-3', 'lg:flex')}
          >
            {content.map((item, i) => (
              <SectionButton
                key={item.state}
                title={item.title}
                description={item.description}
                icon={i + 1}
                active={currentState?.state === item.state}
                onClick={() => setCurrentState(item)}
              />
            ))}
          </div>
          <div
            className={clsx('relative flex flex-1 items-center justify-center')}
          >
            <div
              className={clsx(
                'flex flex-col items-center justify-center gap-6 p-8'
              )}
            >
              {!currentState && (
                <div
                  className={clsx(
                    'text-center text-slate-500 dark:text-slate-400'
                  )}
                >
                  <div className={clsx('mb-4 text-6xl')}>🏢</div>
                  <h3 className={clsx('mb-2 text-xl font-bold')}>
                    Enterprise Architecture Principles
                  </h3>
                  <p>Click on a card to learn more</p>
                </div>
              )}
              {currentState?.state === 'typography' && (
                <div
                  className={clsx(
                    'text-center text-slate-600 dark:text-slate-300'
                  )}
                >
                  <div className={clsx('mb-4 text-6xl')}>✨</div>
                  <h3 className={clsx('mb-2 text-xl font-bold')}>
                    Simple Solutions
                  </h3>
                  <p className={clsx('text-slate-500 dark:text-slate-400')}>
                    Elegant architectures that solve complex problems with
                    minimal overhead
                  </p>
                </div>
              )}
              {currentState?.state === 'spacing' && (
                <div
                  className={clsx(
                    'text-center text-slate-600 dark:text-slate-300'
                  )}
                >
                  <div className={clsx('mb-4 text-6xl')}>📐</div>
                  <h3 className={clsx('mb-2 text-xl font-bold')}>
                    Standardization
                  </h3>
                  <p className={clsx('text-slate-500 dark:text-slate-400')}>
                    Consistent patterns and frameworks across the enterprise
                  </p>
                </div>
              )}
              {currentState?.state === 'colors' && (
                <div
                  className={clsx(
                    'text-center text-slate-600 dark:text-slate-300'
                  )}
                >
                  <div className={clsx('mb-4 text-6xl')}>🎯</div>
                  <h3 className={clsx('mb-2 text-xl font-bold')}>
                    Business First
                  </h3>
                  <p className={clsx('text-slate-500 dark:text-slate-400')}>
                    Technology decisions driven by business value and strategic
                    goals
                  </p>
                </div>
              )}
              {currentState?.state === 'effects' && (
                <div
                  className={clsx(
                    'text-center text-slate-600 dark:text-slate-300'
                  )}
                >
                  <div className={clsx('mb-4 text-6xl')}>🌐</div>
                  <h3 className={clsx('mb-2 text-xl font-bold')}>
                    Decentralized
                  </h3>
                  <p className={clsx('text-slate-500 dark:text-slate-400')}>
                    Empowered teams with clear governance and architectural
                    guardrails
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionContent>
    </>
  );
}

export default CleanIntuitive;
