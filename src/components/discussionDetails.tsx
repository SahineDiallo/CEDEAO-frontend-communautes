import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import Skeleton from './skeleton/Skeleton';
import { ActivityItemProps, Discussion, File } from '../types';
import { useAppSelector } from '../hooks/useAppSelector';
import { ActivityItem } from './ActivityItem';
import { DetailPageMenuItems } from '../utils/Menus';
import MenuPageDetail from './MenuPageDetail';
import FichiersList from './FichierList';
import { useNavigate } from "react-router-dom";

// Define the type for the post data
interface Post {
  discussion: Discussion;
  fichiers: File[];
  pkId: string;
  titre: string;
  contenu: string;
  // Add other fields as needed
}

const fetchPostDetails = async (
  postId: string,
  pkId: string,
  navigate: (path: string) => void
): Promise<Post | undefined> => {
  const token = localStorage.getItem("token");
  const domain = import.meta.env.VITE_MAIN_DOMAIN;

  if (!token) {
    navigate("/login"); // Redirect using React Router
    return;
  }

  try {
    const response = await fetch(`${domain}/api/discussions/${postId}/?communaute_id=${pkId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching post details:", error);
    return undefined;
  }
};


const PostDetails = () => {
  // Use useParams with explicit types
  const { pkId, postId } = useParams<{ pkId: string, postId: string }>();
  // Define state with proper types
  const [post, setPost] = useState<Discussion>();
  const [loading, setLoading] = useState<boolean>(true);
  const [discussionFichiers, setDiscussionFichiers] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null);
  const { data: community} = useAppSelector((state) => state.communityDetails);
  const domain = import.meta.env.VITE_MAIN_DOMAIN
  const [recentActivities, setRecentActivities] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  
  useEffect(() => {
    // if (!token) window.location.href = "/login";
    fetch(`${domain}/api/recent-activities/?community_id=${community?.pkId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecentActivities(data)});
  }, [community?.pkId, domain, token]);
  useEffect(() => {
    
    if (pkId && postId) {
        const fetchPost = async () => {
          if (!postId) {
            setError('Post ID is missing');
            setLoading(false);
            return;
          }
    
          try {
            const data = await fetchPostDetails(postId, pkId, navigate);
            if (data) {
          
              if (data.discussion) setPost(data.discussion);
              if (data.fichiers) {
                setDiscussionFichiers(data.fichiers)
              }
            }
            
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch post details');
          } finally {
            setLoading(false);
          }

        }
        fetchPost();
    };

  }, [postId, pkId, navigate]);

  // Render loading state
  if (loading) {
    return <Skeleton />;
  }

  // Render error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Render post not found state
  if (!post) {
    return <p>Post not found</p>;
  }

  const sanitizedContent = DOMPurify.sanitize(post.contenu, {
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

  // Render post details
  return (
    <>
        <div className="bg-gradient-to-b from-[#ffcaa1] to-white-500">
            <div className="container mx-auto md:px-4">
                <div className="w-full">
                <img src={community?.banner_image} alt="" className="w-full h-auto object-cover" />
                </div>
            </div>
        </div>
        <div className="communaute-header-info container w-full mx-auto px-2 md:px-8 py-2 md:py-4">
            <MenuPageDetail MenuItems={DetailPageMenuItems} communityPkId={pkId} />
        </div>
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Column (col-md-4) */}
            <div className="md:col-span-4 bg-white p-4 shadow">
              {
                (discussionFichiers && discussionFichiers.length !== 0) && (
                  <div className="mb-3">
                    <h2 className="text-lg custom-header">Ressources de la discussion</h2>
                      <FichiersList fichiers={discussionFichiers} />
                  </div>
                )
              }
              <div className='mb-3'>
                  <h2 className="text-lg custom-header">Activités Récentes</h2>
                  {recentActivities.map((activity: ActivityItemProps, i) => (
                    <ActivityItem
                      key={i}
                      user={activity.user}
                      action={activity.action}
                      discussion={activity?.discussion}
                      fichier={activity?.fichier}
                      community={activity.community}
                  />
                  ))}
              </div>
              <div className='mb-3'>
              <h2 className="text-lg custom-header">Administrateurs</h2>
              </div>

            </div>

            {/* Right Column (col-md-8) */}
            <div className="md:col-span-8 bg-white p-4 shadow">
                <h1 className="text-2xl font-bold mb-4">{post.titre}</h1>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                />
            </div>
        </div>
          
    </>
  );
};

export default PostDetails;