import { Suspense } from "react"
import Loading from "../loading"
import ProfilePage from "./UserProfilPage"


const UserProfilePage = () => {
  return (
    <main className="min-h-screen bg-[#f9f5eb]">
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<Loading />}>
          <ProfilePage />
        </Suspense>
      </div>
    </main>
  )
}

export default UserProfilePage
