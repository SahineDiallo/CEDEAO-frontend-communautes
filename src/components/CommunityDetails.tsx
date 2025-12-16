"use client"

import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"
import MenuPageDetail from "./MenuPageDetail"
import { DetailPageMenuItems } from "../utils/Menus"
import { fetchCommunityDetails } from "../store/features/communities/CommunityDetailsSlice"
import { useAppDispatch } from "../hooks/useAppDispatch"
import CommunityTabContent from "./CommunityTabContent"
import { Users, MessageSquare, FileText } from "lucide-react"
import Footer from "./Footer"

const CommunityDetails = () => {
  const { pkId } = useParams<{ pkId: string }>()
  const dispatch = useAppDispatch()
  const { data: community, status, error } = useAppSelector((state) => state.communityDetails)

  useEffect(() => {
    if (pkId) {
      dispatch(fetchCommunityDetails(pkId))
    }
  }, [pkId, dispatch])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "failed") {
    return <div>Error: {error}</div>
  }

  if (!community) {
    return <div>Community not found</div>
  }

  return (
    <>
      {/* Hero Section with Banner and Overlay */}
      <div className="relative h-[450px] w-full overflow-hidden lg:mt-32 md:mt-20">
        <img
          src={community.banner_image || "/placeholder.svg"}
          alt={community.nom}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 text-white">
          <div className="container mx-auto px-4 md:px-8 pb-8">
            {/* Category badges */}
            {community?.categories?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {community.categories.map((cat, index) => (
                  <span key={index} className="bg-[#f9de4f] text-black px-4 py-1 text-sm font-medium">
                    {cat.nom}
                  </span>
                ))}
              </div>
            )}

            {/* Community name */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{community.nom}</h1>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-lg font-medium">{community.members_count || 0} Membres</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-lg font-medium">{community.discussions_count || 0} Discussions</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <span className="text-lg font-medium">{community.resources_count || 0} Ressources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Content */}
      <div className="bg-white border-b-2 border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <MenuPageDetail MenuItems={DetailPageMenuItems} communityPkId={community.pkId} />
        </div>
      </div>

      <CommunityTabContent />
      <Footer />
    </>
  )
}

export default CommunityDetails
