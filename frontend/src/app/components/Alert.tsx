import { XCircleIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

interface AlertProps {
  passed: boolean | null;
}

export default function Alert({ passed }: AlertProps) {
  // If passed is null, don't render anything
  if (passed === null) {
    return null;
  }

  if (passed) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <CheckCircleIcon aria-hidden="true" className="size-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Test Passed</h3>
            <div className="mt-2 text-sm text-green-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                <li>You have passed all the tests!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <XCircleIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Test Failed</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc space-y-1 pl-5">
                <li>You either failed the hidden test cases or the test cases below!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
