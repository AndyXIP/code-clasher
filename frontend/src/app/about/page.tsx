import { LinkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Container } from '../components/Container';
import { GitHubIcon } from '../components/SocialIcons';

// Type for the SocialLink props
interface SocialLinkProps {
  className?: string;
  href: string;
  children: React.ReactNode;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function SocialLink({ className, href, children, icon: Icon }: SocialLinkProps) {
  return (
    <li className={clsx(className, 'flex')}>
      <a
        href={href}
        className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
      >
        <Icon className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
        <span className="ml-4">{children}</span>
      </a>
    </li>
  );
}

export const metadata = {
  title: 'About',
  description:
    'Code testing and questions for practice.',
};

export default function AboutPage() {
  return (
    <div>
      <Container>
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
          <div className="lg:pl-20">
            <div className="max-w-xs px-2.5 lg:max-w-none"></div>
          </div>
          <div className="lg:order-first lg:row-span-2 mt-5">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
              Code Clasher
            </h1>
            <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
              <p>
                Code Clasher is a web application that allows users complete daily programming challenges on easy and hard difficulties.
              </p>
            </div>
            <h3 className="mt-6 text-2xl font-bold tracking-tight text-zinc-800 sm:text-2xl dark:text-zinc-100">
              Features Implemented:
            </h3>
            <ul className="mt-4 list-disc list-inside text-base text-zinc-600 dark:text-zinc-400">
              <li>Code editor to solve easy/hard questions.</li>
              <li>User login system to track your weekly completed questions.</li>
              <li>View leaderboard of questions solver among other users.</li>
              <li>Dark mode and light mode support.</li>
            </ul>
            <h3 className="mt-6 text-2xl font-bold tracking-tight text-zinc-800 sm:text-2xl dark:text-zinc-100">
              Components:
            </h3>
            <ul className="mt-4 list-disc list-inside text-base text-zinc-600 dark:text-zinc-400">
              <li>
                <strong>Component 1:</strong> details
              </li>
              <li>
                <strong>Component 2:</strong> details
              </li>
            </ul>
          </div>
          <div className="lg:pl-20">
            <ul role="list">
              <SocialLink href="https://github.com/AndyXIP/sse-team-project" icon={GitHubIcon} className="mt-4">
                Follow on GitHub
              </SocialLink>
              <SocialLink
                href="/"
                icon={LinkIcon}
                className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-700/40"
              >
                Question API and database
              </SocialLink>
            </ul>
          </div>
        </div>
      </Container>
    </div>
  );
}
