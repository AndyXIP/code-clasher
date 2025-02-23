import { activityItems } from './data';

export default function LeaderBoard() {
  // Sort the activity items by score in descending order
  const sortedItems = [...activityItems].sort((a, b) => b.score - a.score);

  return (
    <div className= "py-10">
      <h2 className="px-4 text-2xl font-semibold dark:text-gray-200 sm:px-6 lg:px-8">
        Leaderboard
      </h2>
      <table className="mt-6 w-full whitespace-nowrap text-left">
        <thead className="border-b border-white/10 dark:border-gray-600 text-sm dark:text-gray-300">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              Rank
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
              User
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
            >
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 dark:divide-gray-600">
          {sortedItems.map((item, index) => (
            <tr
              key={item.user.name}
              className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm font-medium dark:text-gray-200">
                    {index + 1}
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                  <div className="truncate text-sm font-medium dark:text-gray-200">
                    {item.user.name}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm sm:pr-8 lg:pr-20">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  <div className="dark:text-gray-200">{item.score}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
