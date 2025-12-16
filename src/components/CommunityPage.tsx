"use client"

import type React from "react"

import { useEffect, useCallback } from "react"
import { useSearchParams } from "react-router-dom"
// import { StatsSection } from "./Stats-section"
import { NewsCard } from "./News-Cards"
// import CommunityImage from "../assets/Comunaute-de-pratique-global---.jpg"
import type { Community, FilterParams } from "../types"
import type { RootState } from "../store/store"
import {
  fetchCommunities,
  fetchFilteredCommunities,
  resetCommunityState,
  resetFilteredCommunities,
} from "../store/features/communities/CommunitySlice"
import { FeaturedSection } from "./Featured-section"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { fetchCategories } from "../store/features/categories/categoriesSlice"
import { ReusableFilter } from "./Search-section"
import Footer from "./Footer"

const CommunitiesPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialQuery = searchParams.get("query") || ""
  const initialType = searchParams.get("type") || "all"
  const initialCategory = searchParams.get("category") || "all"

  const initialFilters: FilterParams = {
    query: initialQuery,
    type: initialType,
    category: initialCategory,
  }

  const communities = useAppSelector((state: RootState) => state.communities.data)
  const filteredCommunities = useAppSelector((state: RootState) => state.communities.filteredData)
  const categories = useAppSelector((state: RootState) => state.categories.data)
  const status = useAppSelector((state: RootState) => state.communities.status)
  const filteredStatus = useAppSelector((state: RootState) => state.communities.filteredStatus)
  const error = useAppSelector((state: RootState) => state.communities.error)
  const filteredError = useAppSelector((state: RootState) => state.communities.filteredError)
  const featuredCommunity = useAppSelector((state: RootState) => state.communities.featuredCommunity)

  useEffect(() => {
    dispatch(resetCommunityState())
    dispatch(fetchCommunities())
    dispatch(fetchCategories())
  }, [dispatch])

  useEffect(() => {
    if (!(initialQuery || initialType !== "all" || initialCategory !== "all")) {
      dispatch(resetFilteredCommunities())
    }
  }, [dispatch, initialQuery, initialType, initialCategory])

  const filtersActive = initialQuery !== "" || initialType !== "all" || initialCategory !== "all"

  const communitiesToDisplay = filtersActive ? filteredCommunities : communities

  const handleFilterChange = useCallback(
    (filters: { query: string; type: string; category: string }) => {
      const params: Record<string, string> = {}
      if (filters.query) params.query = filters.query
      if (filters.type && filters.type !== "all") params.type = filters.type
      if (filters.category && filters.category !== "all") params.category = filters.category
      setSearchParams(params)

      dispatch(fetchFilteredCommunities(filters))
    },
    [dispatch, setSearchParams],
  )

  const firstThreeCommunities = communitiesToDisplay.slice(0, 3)
  const remainingCommunities = communitiesToDisplay.slice(3)

  if (status === "loading" || filteredStatus === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground text-lg">Loading...</div>
      </div>
    )
  }
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">Error: {error}</div>
      </div>
    )
  }
  if (filteredStatus === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-destructive">Error: {filteredError}</div>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen lg:mt-20">
      <section className="relative bg-green-50/30 overflow-hidden z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-gradient-to-bl from-green-300/60 to-transparent transform rotate-12 translate-x-1/4 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-gradient-to-tr from-green-300/50 to-transparent transform -rotate-12 -translate-x-1/4 translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* <div className="inline-block px-4 py-1.5 bg-violet-100 text-violet-700 text-sm font-medium">Notre blog</div> */}

            <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-tight text-balance">
              Communautés de pratiques
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed text-balance">
              Les dernières nouvelles, interviews, technologies et ressources de nos communautés.
            </p>

          </div>
          <div className="pt-4 max-w-5xl mx-auto">
            <ReusableFilter
              categories={categories}
              initialFilters={initialFilters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </section>

      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <StatsSection />
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="aspect-[4/3] overflow-hidden border border-border">
              <img src={CommunityImage || "/placeholder.svg"} alt="Community" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section> */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 z-20">
        <div className="space-y-20">
          {firstThreeCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {firstThreeCommunities.map((community: Community) => (
                <NewsCard
                  key={community.pkId}
                  pkId={community.pkId}
                  title={community.nom}
                  description={community.description}
                  imageUrl={community.thumbnail_image}
                />
              ))}
            </div>
          ) : (
            filtersActive && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-muted mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 text-muted-foreground"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
                <p className="text-muted-foreground text-lg font-medium">Aucune communauté trouvée</p>
                <p className="text-muted-foreground text-sm mt-2">Essayez d'ajuster vos filtres de recherche</p>
              </div>
            )
          )}

          {featuredCommunity && (
            <div className="my-20">
              <FeaturedSection
                featuredCommunity={{
                  pkId: featuredCommunity.pkId,
                  title: featuredCommunity.nom,
                  description: featuredCommunity.description,
                  imageUrl: featuredCommunity.thumbnail_image,
                }}
                activities={[
                  {
                    id: featuredCommunity.pkId,
                    user: {
                      name: featuredCommunity.nom,
                      avatar: featuredCommunity.thumbnail_image,
                    },
                    action: "est à la une",
                    timestamp: new Date().toLocaleDateString(),
                  },
                ]}
              />
            </div>
          )}

          {remainingCommunities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {remainingCommunities.map((community: Community) => (
                <NewsCard
                  key={community.pkId}
                  pkId={community.pkId}
                  title={community.nom}
                  description={community.description}
                  imageUrl={community.thumbnail_image}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default CommunitiesPage
