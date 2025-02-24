import StatCard from "./components/StatCard";
import CodeTracker from "./components/CodeTracker";

export default function Home() {
  return (
    <div className="py-5 ml-4 mr-4">
      <div className="flex gap-10"> {/* Adds space between CodeTracker & StatCard */}
        {/* CodeTracker takes up 20% of the screen width */}
        <div className="w-[25%]">
          <CodeTracker />
        </div>
        {/* StatCard takes up 80% */}
        <div className="w-[70%]">
          <StatCard />
        </div>
      </div>
    </div>
  );
}
