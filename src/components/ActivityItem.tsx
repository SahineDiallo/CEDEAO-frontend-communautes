import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { ActivityItemProps } from "../types";

const ACTION_TRANSLATIONS: { [key: string]: string } = {
  resource_created: "a créé une ressource",
  discussion_created: "a créé une discussion",
};

export function ActivityItem({
  user,
  action,
  discussion,
  fichier,
  community
}: ActivityItemProps) {
  const domain = import.meta.env.VITE_MAIN_DOMAIN;
  const actionText = ACTION_TRANSLATIONS[action] || action;

  // Construct the message
  let activityMessage;
  if (discussion && fichier) {
    // Case 1: Both discussion and fichier exist
    activityMessage = (
      <>
        {actionText}{" "}
        <a
          href={fichier.fichier_url}
          className="text-blue-500 hover:underline"
        >
          {fichier.nom}
        </a>{" "}
        dans la discussion{" "}
        <a
          href={`/communities/${community.pkId}/posts/${discussion.pkId}/`}
          className="text-blue-500 hover:underline"
        >
          {discussion.titre}
        </a>
      </>
    );
  } else if (discussion) {
    // Case 2: Only discussion exists
    activityMessage = (
      <>
        {actionText}{" "}
        <a
          href={`/communities/${community.pkId}/posts/${discussion.pkId}/`}
          className="text-blue-500 hover:underline"
        >
          {discussion.titre}
        </a>
      </>
    );
  } else if (fichier) {
    // Case 3: Only fichier exists
    activityMessage = (
      <>
        {actionText}{" "}
        <a
          href={fichier.fichier_url}
          target="_blank"
          className="text-blue-500 hover:underline"
        >
          {fichier.nom}
        </a>
      </>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar className="h-8 w-8">
        {user?.profile?.image_url ? (
          <AvatarImage src={`${domain}${user.profile.image_url}`} alt={user.full_name} />
        ) : (
          <AvatarFallback>{user.first_name[0]}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium text-orange-500">{user.full_name}</span>{" "}
          {activityMessage}
        </p>
      </div>
    </div>
  );
}
