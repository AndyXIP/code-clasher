import { activityItems } from './data';

export default function LeaderBoard() {
  // Sort the activity items by score in descending order
  const sortedItems = [...activityItems].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-gray-900 py-10">
      <h2 className="px-4 text-base/7 font-semibold text-white sm:px-6 lg:px-8">Leaderboard</h2>
      <table className="mt-6 w-full whitespace-nowrap text-left">
        <thead className="border-b border-white/10 text-sm/6 text-white">
          <tr>
            <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
              Rank
            </th>
            <th scope="col" className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
              User
            </th>
            <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
              Score
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sortedItems.map((item, index) => (
            <tr key={item.user.name}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="truncate text-sm/6 font-medium text-white">{index + 1}</div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                  <div className="truncate text-sm/6 font-medium text-white">{item.user.name}</div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm/6 sm:pr-8 lg:pr-20">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  <div className="text-white">{item.score}</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
