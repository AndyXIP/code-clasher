const stats = [
  { name: "Easy Questions Completed", stat: "5" },
  { name: "Hard Questions Completed", stat: "3" },
  { name: "Total Questions Completed", stat: "8" },
  { name: "Easy Questions Completion Rate", stat: "100%" },
  { name: "Hard Questions Completion Rate", stat: "33%" },
  { name: "Total Questions Completion Rate", stat: "75%" },
];

export default function StatCard() {
  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200">
        Last 7 days
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3 ">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 py-5 shadow dark:shadow-md sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
