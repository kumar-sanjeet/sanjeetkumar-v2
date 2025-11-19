import clsx from 'clsx';
import { m } from 'framer-motion';
import Image from 'next/image';

function HeaderImage() {
  return (
    <div className={clsx('relative flex items-center justify-center')}>
      <m.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={clsx('relative')}
      >
        <div
          className={clsx(
            'from-accent-400/20 via-accent-400/0 absolute -inset-4 rounded-full bg-gradient-to-br blur-2xl',
            'dark:from-accent-600/20 dark:via-accent-600/0'
          )}
        />
        <Image
          alt="Sanjeet Kumar"
          src="/assets/images/sanjeet-photo.jpg"
          width={400}
          height={400}
          className={clsx(
            'relative rounded-full border-4 border-white shadow-2xl brightness-90',
            'dark:border-slate-800 dark:brightness-75',
            'hidden lg:block'
          )}
          quality={100}
          priority
        />
      </m.div>
    </div>
  );
}

export default HeaderImage;
