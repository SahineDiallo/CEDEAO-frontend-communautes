import { Discussion, File, Membership, TabContentProps, TabData } from '../types';
import { DiscussionPost } from './DiscussionGrid';
import { MemberGrid } from './MemberGrid';
import { FichierPost } from './RessourceGrid';
import Skeleton from './skeleton/Skeleton'; // Import the Skeleton component

const TabContent = ({
  tab,
  data,
  loading,
  communityPkId,
  pagination,
  admins,
  onNextPage,
  onPreviousPage,
}: TabContentProps) => {
  console.log("pagination", pagination);
  console.log("onNextPage", onNextPage);
  console.log("onPreviousPage", onPreviousPage);

  if (loading) {
    return <Skeleton />; // Show the Skeleton component while loading
  }

  if (!data) {
    return <p>No data available for this tab.</p>; // Handle no data
  }

  if (tab !== 'a-propos' && (typeof data !== 'object' || data === null || !('results' in data))) {
    return <p>No data available for this tab.</p>;
  }
  console.log("here is the data", data)
  switch (tab) {
    case 'a-propos':
      return <p>{data as string}</p>; // Render the community description
    case 'membres':
      return (
        <div>
          {
            (data as TabData).results?.length === 0 ? ( // Check if results are empty
              <p>Devenez le premier Membre de cette communauté</p> // Display message if no discussions
            ) :
            <MemberGrid admins={admins} members={(data as TabData).results as Membership[] } />
          }
        </div>
      );
    case 'discussions':
      return (
        <div>
          {(data as TabData).results?.length === 0 ? ( // Check if results are empty
            <p>Pas de discussions trouvées</p> // Display message if no discussions
          ) : (
            ((data as TabData).results as Discussion[]).map((discussion) => (
              <DiscussionPost
                key={discussion.pkId}
                title={discussion.titre}
                admins={admins}
                author={
                  discussion.auteur?.first_name && discussion.auteur?.last_name
                    ? `${discussion.auteur.first_name} ${discussion.auteur.last_name}` // Combine first and last name
                    : discussion.auteur?.first_name || discussion.auteur?.last_name || 'Anonymous' // Fallback to first name, last name, or 'Anonymous'
                }
                authorPkId={discussion.auteur?.pkId}
                date={discussion.date_creation}
                is_active={discussion.is_active}
                deletion_requested={discussion.deletion_requested}
                headlineDescription={discussion.headlineDescription}
                // excerpt={discussion.contenu} // Use the full content or truncate it for an excerpt
                commentCount={discussion.commentCount || 0} // Replace with actual comment count if available
                pkId={discussion.pkId}
                communityPkId={communityPkId}
              />
            ))
          )}
        </div>
      );
    case 'ressources':
      return (
        <div>
          <h3>Fichiers Partagés {
            (data as TabData).count  && (
              <span>({(data as TabData).count})</span>
            )
          }</h3>
          <ul>
          {(data as TabData).results?.length !== 0 ?
            ((data as TabData).results as File[]).map((file) => (
              <FichierPost
                key={file.pkId}
                nom={file.nom}
                fichierUrl={file.fichier_url}
                author={file.auteur}
                date={file.date_creation}
                community={file?.community}
                discussion={file?.discussion}
                pkId={file.pkId}
              />
            )) : (
              <p>Pas de ressources trouvées</p>
            )
            }
          </ul>
        </div>
      );
    default:
      return <p>No data available for this tab.</p>;
  }
};

export default TabContent;