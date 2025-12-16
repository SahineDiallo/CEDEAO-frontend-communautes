"use client"

import { useState, useEffect } from "react"
import { Plus, Star, Users, UserPlus, Activity, Grid3X3 } from "lucide-react"
import { Button } from "../ui/Button"
import { formatIsoDate } from "../../lib/utils"
import { useParams } from "react-router-dom"
import { ProfileUpdateModal } from "../profile/profile-update-modal"
import { Discussion } from "../../types"
import { DiscussionPost } from "../DiscussionGrid"
import { countries } from 'countries-list';

export interface UserProfile {
  pkId: string
  image: string
  poste: string
  biographie: string
  lieu: string
  organisation: string
  x_profile_url: string
  linkedin_url: string
  utilisateur: {
    pkId: string,
    username:string,
    first_name: string,
    last_name: string,
    full_name: string,
    email: string,
    is_email_verified: boolean,
    country: string,
    date_joined: string,
  }
  statistics?: {
    activities: number
    subscriptions: number
    subscribers: number
    communities: number
  }
}


export default function ProfilePage() {
  const { pkId } = useParams()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [publications, setPublications] = useState<Discussion[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const BASE_URL = import.meta.env.VITE_MAIN_DOMAIN

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch user profile
        const profileResponse = await fetch(`${BASE_URL}/comptes/profile/${pkId}/`)
        if (!profileResponse.ok) throw new Error("Failed to fetch profile")
        const profileData = await profileResponse.json();
        setUserProfile(profileData)

        // Fetch user discussions
        const discussionsResponse = await fetch(`${BASE_URL}/comptes/profile/${pkId}/discussions/`)
        if (!discussionsResponse.ok) throw new Error("Failed to fetch discussions")
        const discussionsData = await discussionsResponse.json()
        setPublications(discussionsData || [])
        
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [pkId, BASE_URL]);

  const handleProfileUpdate = async (updatedData: Partial<UserProfile>) => {
    try {
      const response = await fetch(`/api/profile/${pkId}/update_profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(updatedData)
      })
      
      if (!response.ok) throw new Error("Update failed")
      const updatedProfile = await response.json()
      setUserProfile(updatedProfile)
      setIsModalOpen(false)
      
    } catch (error) {
      console.error("Update error:", error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!userProfile) {
    return <div className="text-center py-10">Profile not found</div>
  }
  const statItems = [
    { icon: <Activity />, label: 'Activités', value: userProfile.statistics?.activities || 0 },
    { icon: <UserPlus />, label: 'Abonnements', value: userProfile.statistics?.subscriptions || 0 },
    { icon: <Users />, label: 'Abonnés', value: userProfile.statistics?.subscribers || 0 },
    { icon: <Grid3X3 />, label: 'Communités', value: userProfile.statistics?.communities || 0 },
  ]

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <div className="w-full h-56 bg-[#1d4b44] mb-16">
        <div className="container mx-auto px-4 py-6 h-full relative">
          {/* Profile image */}
          <div className="absolute left-[20px] -bottom-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            <img
              src={userProfile.image ? `${BASE_URL}/${userProfile.image}` : "/placeholder.svg"}
              alt={userProfile.utilisateur.full_name}
              className="object-cover w-full h-full"
            />
          </div>

          {/* Action buttons */}
          <div className="absolute right-8 bottom-4 flex gap-4">
            <Button variant="outline" className="bg-transparent border-[#1d4b44] text-white">
              <Star className="h-5 w-5" />
              Follow
            </Button>
            <Button className="bg-white text-[#1d4b44]">Send message</Button>
          </div>

        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 px-4 mt-3 bg-gray-100 container mx-auto">
        {/* Left column - Profile info */}
        <div className="w-full md:w-1/3 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              {userProfile.utilisateur.full_name}
            </h1>
            <p className="text-gray-600 mb-4">
              Membre depuis {formatIsoDate(userProfile.utilisateur.date_joined)}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-4">
            {statItems.map((item, index) => (
              <StatBox
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
                className={index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}
              />
            ))}
          </div>


            {/* Position */}
            <div className="p-4 rounded-md shadow-sm mb-4">
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                {userProfile.poste}
              </h2>
              <div className="text-gray-600 flex flex-col gap-3">
                <h3 className="mb-1">Pays: </h3>
                <p className="text-gray-600 mb-0">
                  {countries[userProfile.utilisateur.country]?.name || userProfile.utilisateur.country}
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="p-4 rounded-md shadow-sm">
              <h2 className="text-xl font-medium text-gray-800 mb-2">Bio</h2>
              <p className="text-gray-600">
                {userProfile.biographie || "No information available"}
              </p>
            </div>

            {/* Edit profile button */}
            {pkId === "current" && ( // Only show if viewing own profile
              <Button
                variant="outline"
                className="w-full mt-4 border-[#1d4b44] text-[#1d4b44]"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Right column - Publications */}
        <div className="w-full md:w-2/3 py-6 bg-white">
          <div className="space-y-6 px-6">
            {publications.length === 0 ? ( // Check if results are empty
              <p>Pas de publications trouvées</p> // Display message if no discussions
            ) : (
              (publications.map((discussion) => (
                <DiscussionPost
                  key={discussion.pkId}
                  title={discussion.titre}
                  author={
                    discussion.auteur?.first_name && discussion.auteur?.last_name
                      ? `${discussion.auteur.first_name} ${discussion.auteur.last_name}` // Combine first and last name
                      : discussion.auteur?.first_name || discussion.auteur?.last_name || 'Anonymous' // Fallback to first name, last name, or 'Anonymous'
                  }
                  authorPkId={discussion.auteur?.pkId}
                  date={discussion.date_creation}
                  headlineDescription={discussion.headlineDescription}
                  // excerpt={discussion.contenu} // Use the full content or truncate it for an excerpt
                  commentCount={discussion.commentCount || 0} // Replace with actual comment count if available
                  pkId={discussion.pkId}
                  communityPkId={discussion.communaute.pkId}
                />
              ))
            ))}
          </div>
        </div>
      </div>

      {/* Profile update modal */}
      <ProfileUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  )
}

// Helper components
function StatBox({ icon, label, value, className = "" }: { icon: React.ReactNode, label: string, value: number, className?: string }) {
  return (
    <div className={`flex flex-col items-center p-2 rounded-md shadow-sm ${className}`}>
      <div className="h-5 w-5 text-[#1d4b44] mb-1">{icon}</div>
      <span className="text-xs text-gray-600">{label}</span>
      <span className="font-bold text-lg">{value}</span>
    </div>
  )
}
