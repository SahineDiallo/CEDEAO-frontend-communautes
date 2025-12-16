import { UserCircle } from "lucide-react";

const CommunityActivity = () => {
  const activities = [
    {
      user: "Clara Ceravolo",
      action: "added a Community document",
      date: "Tue, 25/07/2023 - 11:20",
    },
    {
      user: "Lauren Whitehead",
      action: "added a Community event",
      date: "Thu, 06/04/2023 - 19:45",
    },
    {
      user: "Clara Ceravolo",
      action: "added a Community document",
      date: "Tue, 25/07/2023 - 11:20",
    },
    {
      user: "Clara Ceravolo",
      action: "added a Community document",
      date: "Tue, 25/07/2023 - 11:20",
    },
    {
      user: "Lauren Whitehead",
      action: "added a Community event",
      date: "Thu, 06/04/2023 - 19:45",
    },
  ];

  return (
    <div className="p-1">
      <h1 className="text-2xl font-bold mb-1">La communautés</h1>
      <h2 className="text-xl font-bold mb-4">A la une</h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-gray-300" />
            <div>
              <div>
                <span className="text-orange-400 font-medium">
                  {activity.user}
                </span>
                <span className="text-gray-500"> {activity.action}</span>
              </div>
              <div className="text-gray-400 text-sm">{activity.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityActivity;
