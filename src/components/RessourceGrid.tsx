import { FileText } from 'lucide-react'; // Icon for files
import { Link } from 'react-router-dom'; // Navigation
import { Community, Discussion, User } from '../types';

interface FichierPostProps {
  nom: string; // File name
  fichierUrl: string; // URL to the file
  author?: User; // Optional author
  date: string; // Upload date
  pkId: string; // File ID
  community?: Community; // Community ID (optional)
  discussion?: Discussion; // Discussion ID (optional)
}

// Helper function to format the date to French
function formatDateToFrench(dateString: string): string {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  return date.toLocaleString('fr-FR', options).replace(/\s/, ' - ');
}

export function FichierPost({
  nom,
  fichierUrl,
  author,
  date,
  pkId,
  community,
  discussion,
}: FichierPostProps) {
    // const domain = import.meta.env.VITE_MAIN_DOMAIN
  return (
    <article className="py-5 border-b border-gray-200 text-sm fichier_inst" data-pk={pkId}>
      <div className="relative flex items-start gap-4">
        {/* File icon */}
        <div>
          <FileText className="w-8 h-8 text-[#e86928]" />
        </div>

        <div className="flex-1">
          {/* File name */}
          <h6 className="text-lg font-medium text-[#e86928] mb-1">
            {nom}
          </h6>

          {/* Author and date */}
          <div className="text-gray-600 mb-2 italic" style={{ fontWeight: 100 }}>
            {'Ajouté par '}
            <span className="text-[#e86928]">{author?.full_name || 'Anonymous'}</span>
            {' le '}
            {formatDateToFrench(date)}
          </div>

          {/* Associated community link */}
          {community && (
            <div className="mb-2">
              <Link
                to={`/communities/${community?.pkId}`}
                className="text-[#e86928] hover:underline"
              >
                {community.nom}
              </Link>
            </div>
          )}

          {/* Associated discussion link */}
          {discussion && (
            <div className="mb-2">
              <Link
                to={`/discussions/${discussion.pkId}`}
                className="text-[#e86928] hover:underline"
              >
                {discussion.titre}
              </Link>
            </div>
          )}

          {/* File download link */}
          <div className="text-gray-700">
            <a
              href={fichierUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e86928] hover:underline"
            >
              Télécharger le fichier
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
