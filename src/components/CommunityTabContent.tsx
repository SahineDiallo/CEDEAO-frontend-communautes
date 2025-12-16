"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../hooks/useAppSelector"
import Skeleton from "./skeleton/Skeleton"
import { ActivityItem } from "./ActivityItem"
import TabContent from "./tabContent"
import type { ActivityItemProps, CommunityAdminsResponse, Member } from "../types"
import { Clock, Shield } from "lucide-react"

const CommunityTabContent = () => {
  const { pkId, tab } = useParams<{ pkId: string; tab: string }>()
  const [communityData, setCommunityData] = useState<string | null>(null)
  const [loadingState, setLoadingState] = useState<boolean>(false)
  const [errorState, setErrorState] = useState<string | null>(null)
  const [fetchingTab, setFetchingTab] = useState<string | null>(null)
  const [admins, setAdmins] = useState<Member[]>([])
  const [adminsLoading, setAdminsLoading] = useState<boolean>(false)
  const [recentActivities, setRecentActivities] = useState([])
  const domain = import.meta.env.VITE_MAIN_DOMAIN
  const [pagination, setPagination] = useState<{
    count: number
    next: string | null
    previous: string | null
  } | null>(null)
  const { data: community } = useAppSelector((state) => state.communityDetails)

  const fetchTabData = async (tab: string, pkId: string) => {
    const domain = import.meta.env.VITE_MAIN_DOMAIN
    let url = ""
    switch (tab) {
      case "membres":
        url = `${domain}/api/community-members/${pkId}/`
        break
      case "discussions":
        url = `${domain}/api/discussions/?communaute_id=${pkId}`
        break
      case "ressources":
        url = `${domain}/api/fichiers/?communaute_id=${pkId}`
        break
      default:
        throw new Error(`Unknown tab: ${tab}`)
    }
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error("Failed to fetch data")
    }
    return response.json()
  }

  const handleNextPage = async () => {
    if (!pagination?.next) return

    setLoadingState(true)
    try {
      const response = await fetch(pagination.next)
      if (!response.ok) {
        throw new Error("Failed to fetch next page")
      }
      const data = await response.json()
      setCommunityData(data.results)
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      })
    } catch (error) {
      console.error("Error fetching next page:", error)
    } finally {
      setLoadingState(false)
    }
  }

  const handlePreviousPage = async () => {
    if (!pagination?.previous) return

    setLoadingState(true)
    try {
      const response = await fetch(pagination.previous)
      if (!response.ok) {
        throw new Error("Failed to fetch previous page")
      }
      const data = await response.json()
      setCommunityData(data.results)
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      })
    } catch (error) {
      console.error("Error fetching previous page:", error)
    } finally {
      setLoadingState(false)
    }
  }

  useEffect(() => {
    const fetchAdmins = async () => {
      if (!community?.pkId) return

      setAdminsLoading(true)
      try {
        const response = await fetch(`${domain}/api/community-admins/${community.pkId}/`)
        if (!response.ok) throw new Error("Failed to fetch administrators")
        const data: CommunityAdminsResponse = await response.json()
        setAdmins(data.results)
      } catch (error) {
        console.error("Error fetching administrators:", error)
      } finally {
        setAdminsLoading(false)
      }
    }

    fetchAdmins()
  }, [community?.pkId, domain])

  useEffect(() => {
    if (!pkId || !tab) return

    setLoadingState(true)
    setCommunityData(null)
    setErrorState(null)
    setPagination(null)
    setFetchingTab(tab)

    const fetchDataForTab = async () => {
      try {
        const response = await fetchTabData(tab, pkId)
        setCommunityData(response)
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous,
        })
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorState(error.message)
        } else if (typeof error === "string") {
          setErrorState(error)
        } else {
          setErrorState("An unknown error occurred")
        }
      } finally {
        setLoadingState(false)
      }
    }

    if (tab === "a-propos") {
      setLoadingState(false)
      setCommunityData(community?.description || null)
    } else {
      fetchDataForTab()
    }
  }, [pkId, tab, community?.description])

  useEffect(() => {
    fetch(`${domain}/api/recent-activities/?community_id=${community?.pkId}`)
      .then((res) => res.json())
      .then((data) => {
        setRecentActivities(data)
      })
  }, [community?.pkId, domain])

  if (!pkId || !tab) {
    return <div>Invalid URL parameters.</div>
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Left side, wider */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8">
              <h2 className="text-2xl font-bold mb-6 uppercase tracking-wide text-gray-900">{tab}</h2>
              {fetchingTab !== tab ? (
                <Skeleton />
              ) : loadingState ? (
                <Skeleton />
              ) : errorState ? (
                <p className="text-red-600">Error: {errorState}</p>
              ) : (
                <TabContent
                  tab={tab}
                  data={communityData}
                  loading={loadingState}
                  pagination={pagination}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  communityPkId={pkId}
                  admins={admins}
                />
              )}
            </div>
          </div>

          {/* Sidebar - Right side, narrower */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent Activities Card */}
            <div className="bg-white p-6 border-l-4 border-[#f9de4f]">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-[#128C4F]" />
                <h3 className="text-lg font-bold uppercase tracking-wide">Activités Récentes</h3>
              </div>

              {recentActivities.length !== 0 ? (
                <div className="space-y-4">
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
              ) : (
                <p className="text-gray-500 text-sm">Pas d'activités récentes</p>
              )}
            </div>

            {/* Administrators Card */}
            <div className="bg-white p-6 border-l-4 border-[#128C4F]">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-[#128C4F]" />
                <h3 className="text-lg font-bold uppercase tracking-wide">Administrateurs</h3>
              </div>

              {adminsLoading ? (
                <Skeleton />
              ) : (
                <div className="space-y-4">
                  {admins.length > 0 ? (
                    admins.map((admin) => (
                      <div
                        key={admin.user.pkId}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={admin.user.profile?.image_url || "/default_profile_image.jpg"}
                          alt={admin.user.full_name}
                          className="w-12 h-12 object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{admin.user.full_name}</p>
                          <p className="text-sm text-gray-600 truncate">{admin.user.profile?.poste || "Admin"}</p>
                          {admin.user.profile?.organisation && (
                            <p className="text-xs text-gray-500 truncate mt-1">{admin.user.profile.organisation}</p>
                          )}
                        </div>
                        <span className="bg-[#f9de4f] text-black text-xs px-2 py-1 font-medium">
                          {admin.role === "admin" ? "ADMIN" : "MOD"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Aucun administrateur trouvé</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityTabContent
