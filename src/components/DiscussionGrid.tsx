import DOMPurify from 'dompurify';
import { EllipsisVertical, MessageSquare } from 'lucide-react'; // Import icons// Import your Button component
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation
import { Button } from './ui/Button';
import { useAppSelector } from '../hooks/useAppSelector';
import { RootState } from '../store/store';
import { Member } from '../types';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';


interface DiscussionPostProps {
  title: string;
  author?: string;
  authorPkId?: string;
  date: string;
  is_active: boolean;
  deletion_requested: boolean;
  excerpt?: string;
  headlineDescription: string;
  commentCount?: number;
  admins: Member[];
  pkId: string; // Post ID
  communityPkId: string; // Community ID
}
  
  // Helper function to format the date
  function formatDateToFrench(dateString: string): string {
    const date = new Date(dateString);
  
    // Define options with the correct type
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short', // "Thu"
      day: '2-digit',   // "06"
      month: '2-digit', // "04"
      year: 'numeric',  // "2023"
      hour: '2-digit',  // "19"
      minute: '2-digit', // "31"
      hour12: false,     // Use 24-hour format
    };
  
    // Format the date in French locale
    const formattedDate = date.toLocaleString('fr-FR', options);
  
    // Replace the default separator with " - "
    return formattedDate.replace(/\s/, ' - ');
  }

  
  // Helper function to truncate HTML content to 4 lines
  const truncateExcerpt = (html: string, maxLength: number = 300) => {
    // Create a temporary element to parse the HTML
    const div = document.createElement('div');
    div.innerHTML = html;
  
    // Function to recursively truncate the content
    const truncateNode = (node: ChildNode, remainingLength: number): number => {
      if (remainingLength <= 0) return 0;
  
      if (node.nodeType === Node.TEXT_NODE) {
        // Truncate text nodes
        const text = node.textContent || '';
        if (text.length > remainingLength) {
          node.textContent = text.slice(0, remainingLength) + '...';
          return 0; // No remaining length after truncation
        }
        return remainingLength - text.length;
      }
  
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Process child nodes for element nodes
        for (let i = 0; i < node.childNodes.length; i++) {
          remainingLength = truncateNode(node.childNodes[i], remainingLength);
          if (remainingLength <= 0) break;
        }
      }
  
      return remainingLength;
    };
  
    // Start truncating from the root element
    truncateNode(div, maxLength);
  
    // Return the truncated HTML
    return div.innerHTML;
  };
  
  export function DiscussionPost( {title,
    author,
    authorPkId,
    date,
    excerpt,
    is_active,
    deletion_requested,
    commentCount = 0,
    pkId,
    admins,
    headlineDescription,
    communityPkId, // Add communityPkId to props
  }: DiscussionPostProps) {
    const contentToRender = excerpt ? excerpt : headlineDescription;
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const domain = import.meta.env.VITE_MAIN_DOMAIN
    // Get current user from Redux store
    const user = useAppSelector((state: RootState) => state.auth.user);
    const token = useAppSelector((state: RootState) => state.auth.token)
    const [isActive, setIsActive] = useState(is_active);
    const [isDeletionRequested, setIsDeletionRequested] = useState(deletion_requested);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    // Check if user is admin (you'll need to get admins from props or API)
    const isAdmin = user && admins.some(
      admin => admin.user.pkId === user.pkId && admin.role === 'admin'
    );

      const handleDeleteRequest = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${domain}/api/request-deletion/discussion/${pkId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }, 
        // body: JSON.stringify({ model_name: 'discussion', object_id: pkId })
      });
      
      if (response.ok) {
        const newDeletionRequested = !isDeletionRequested;
        setIsDeletionRequested(newDeletionRequested);
        toast(`${isDeletionRequested ? 'Demande de suppression annulée' : 'Demande de suppression envoyée'} avec succès`);
      } else {
        const errorData = await response.json();
        toast(`Erreur: ${errorData.error || 'Une erreur est survenue'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast('Erreur de connexion au serveur');
    } finally {
      setIsProcessing(false);
      setShowDropdown(false);
    }
  };


  const handleToggleActivation = async () => {
    try {
      const response = await fetch(`${domain}/api/toggle/discussion/${pkId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ model_name: 'discussion' })
      });
      
      if (response.ok) {
        const newActiveState = !isActive;
        setIsActive(newActiveState);
        toast(`Discussion ${isActive ? 'activée' : 'désactivée'} avec succès`);
      } else {
        alert('Erreur lors de la modification du statut');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Une erreur est survenue');
    }
    setShowDropdown(false);
  };
    // Function to handle the "Lire plus" button click
    const handleReadMoreClick = () => {     // Navigate to the post details page
      navigate(`/communities/${communityPkId}/posts/${pkId}`);
      // Force a page refresh
      window.location.reload();
    };

    // Sanitize and truncate the content
    const sanitizedContent = DOMPurify.sanitize(truncateExcerpt(contentToRender, 300), {
      ALLOWED_TAGS: [
        'iframe', 'div', 'img', 'a', 'p', 
        'strong', 'em', 'u', 'b', 'i', 
        'ul', 'ol', 'li', 'br', 'span',
        'h1', 'h2', 'h3', 'h4'
      ],
      ALLOWED_ATTR: [
        'src', 'width', 'height', 'allowfullscreen', 
        'data-youtube-video', 'href', 'alt', 'id',
        'class', 'style', 'target'
      ],
    });

    if (!isActive && !isAdmin) {
      return null;
    }
  
    return (
      <article className="py-5 border-b border-gray-200 text-sm discussion_inst">
        <div className="relative">
          {/* Comment count badge */}
          {/* <div className="absolute right-0 top-0 flex items-center gap-2 text-[#e86928]">
            <MessageSquare className="w-5 h-5" />
            <span>
              {commentCount} comment{commentCount !== 1 ? 's' : ''}
            </span>
          </div> */}
          {/* Admin dropdown (only visible to admins) */}
          {isAdmin && (
            <div className="absolute right-0 top-0">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <EllipsisVertical className="w-5 h-5" />
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => handleToggleActivation()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {isActive ? "Désactiver" : "Activer"}
                      
                    </button>
                    {/* <button
                      onClick={() => handleToggleActivation(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Désactiver
                    </button> */}
                    <button
                      onClick={handleDeleteRequest}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      {isDeletionRequested ? "Annuler demande de suppression" : "Demande de suppression"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Inactive badge for admins */}
        {!isActive && isAdmin && (
          <div className="absolute left-0 -top-6 bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded-br">
            Inactive
          </div>
        )}

        {/* Title with different style if inactive */}
        <h6 className={`text-lg font-medium mb-1 pr-32 ${
            !isActive ? 'text-gray-500' : 'text-[#e86928]'
          }`}>
            {title}
            {!isActive && " (Inactive)"}
            {(isDeletionRequested && isAdmin)  && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded">
                Suppression en attente
              </span>
            )}
        </h6>
          {/* Title */}
          {/* <h6 className="text-lg font-medium text-[#e86928] mb-1 pr-32">{title}</h6> */}
  
          {/* Author and date */}
          <div className="text-gray-600 mb-4" style={{ fontWeight: 100, fontStyle: "Italic" }}>
            {'Publié par '}
            <Link
              to={`/accounts/profile/${authorPkId}`} // Link to author's profile
            >
              <span className="text-[#e86928] italic">{author || 'Anonymous'}</span>
            </Link>
            {' le '}
            {formatDateToFrench(date)}
          </div>
  
          {/* Content (sanitized and truncated) */}
          <div
            className="text-gray-700 mb-6 line-clamp-3" // Tailwind's line-clamp for truncation
            dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Safely render HTML
          />
  
          {/* Read more button */}
          <Button onClick={handleReadMoreClick} asChild className="hover:bg-[#d25a1f] hover:color-white bg-primary hover:text-white border rounded-none text-white">
            <Link to={`/communities/${communityPkId}/posts/${pkId}`}>Lire plus</Link>
          </Button>
        </div>
        {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la demande de suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir demander la suppression de cette discussion?
              Cette action nécessitera l'approbation d'un administrateur.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button disabled={isProcessing}>Annuler</button>
            <button 
              onClick={handleDeleteRequest}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing ? 'Envoi en cours...' : 'Confirmer'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </article>
    );
  }