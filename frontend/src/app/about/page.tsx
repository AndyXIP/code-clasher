import { LinkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { Container } from '../components/Container'
import { GitHubIcon } from '../components/SocialIcons'

/* 
  SocialLink component from your original code 
  (unchanged except for some extra spacing) 
*/
interface SocialLinkProps {
  className?: string
  href: string
  children: React.ReactNode
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
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
  )
}

export const metadata = {
  title: 'About',
  description: 'Code testing and questions for practice.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* HERO SECTION */}
      <div className="relative isolate overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-16 sm:py-24">
        <Container>
          <div className="mx-auto max-w-2xl text-center text-white lg:max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Code Clasher
            </h1>
            <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-100">
              A web application where you can sharpen your coding skills with daily
              challenges—ranging from easy to hard—while climbing the global leaderboard.
            </p>
          </div>
        </Container>
      </div>

      {/* MAIN CONTENT */}
      <Container>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-y-12 py-12 lg:grid-cols-3 lg:gap-x-12 lg:py-20">
          {/* Left column: Social & Extra Links */}
          <div className="order-2 lg:order-1 lg:col-span-1 lg:pr-8">
            <ul role="list" className="space-y-6">
              <SocialLink
                href="https://github.com/AndyXIP/sse-team-project"
                icon={GitHubIcon}
                className="mt-4"
              >
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

          {/* Right column: Features & Components */}
          <div className="order-1 lg:order-2 lg:col-span-2">
            <div className="mt-5">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
                Features Implemented
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Feature Card #1 */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Code Editor
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Solve both easy and hard coding questions in a built-in editor.
                  </p>
                </div>
                {/* Feature Card #2 */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    User Login System
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Track your weekly completed questions and maintain progress.
                  </p>
                </div>
                {/* Feature Card #3 */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Leaderboard
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    See how you stack up against other users from around the world.
                  </p>
                </div>
                {/* Feature Card #4 */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Dark/Light Mode
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Enjoy a seamless theme toggle that suits your coding style.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-4xl">
                Components
              </h2>
              <div className="mt-6 space-y-6">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Next.js Frontend
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Built with React and Next.js for handling components, code snippets, and
                    API requests.
                  </p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow dark:bg-zinc-800">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    AWS Backend
                  </h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Manages code compilation, API calls, and all question/answer logic on
                    the server side.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
