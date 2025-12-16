import { Link } from "react-router-dom"
import { formatIsoDate } from "../lib/utils"
import { Member, Membership } from "../types"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAppSelector } from "../hooks/useAppSelector"
import { RootState } from "../store/store"
import { MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownTrigger } from "./ui/membersDropdown"
import IssueWarningForm from "./forms/WarningForm"
import { useState } from "react"
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
// import { Card, CardContent } from "./ui/card"



interface MemberGridProps {
  members: Membership[]
  admins: Member[]
}

export function MemberGrid({ members, admins }: MemberGridProps) {
  const domain = import.meta.env.VITE_MAIN_DOMAIN
  const  user  = useAppSelector((state: RootState) => state.auth.user);
  const isAdmin = user && admins.some(
    admin => admin.user.pkId === user.pkId && admin.role === 'admin'
  );



  // State for warning modal
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Handler functions for dropdown actions
const [selectedMember, setSelectedMember] = useState<(Membership & { shouldSuspend?: boolean }) | null>(null);

// Update the handler
const handleWarnMember = (memberId: string, shouldSuspend: boolean = false) => {
  const member = members.find(m => m.user.pkId === memberId);
  if (member) {
    setSelectedMember({
      ...member,
      shouldSuspend 
    });
    setShowWarningModal(true);
  }
};



  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
      {members.map((member) => (
        <div key={member.user.pkId} className="border border-[#128C4F] p-4 flex items-start gap-4 relative">
          {/* Ellipsis menu (top-right) */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownTrigger>
                <div className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                  <MoreVertical className="w-4 h-4 text-gray-500" />
                </div>
              </DropdownTrigger>
              
              <DropdownMenuContent className="w-48" align="end">
                {isAdmin && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleWarnMember(member.user.pkId, false)}
                      className="text-yellow-600 hover:bg-yellow-50"
                    >
                      Avertir
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleWarnMember(member.user.pkId, true)}
                      className="text-orange-600 hover:bg-orange-50"
                    >
                      Avertir avec suspension
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem 
                      onClick={() => handleRemoveMember(member.user.pkId)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Retirer de la communauté
                    </DropdownMenuItem> */}
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Member card content */}
          <Avatar className="w-16 h-16 rounded-none">
            {member.user?.profile?.image_url ? (
              <AvatarImage 
                className="bg-[#f2f2f3]" 
                src={`${domain}${member.user.profile.image_url}`} 
                alt={member.user.full_name} 
              />
            ) : (
              <AvatarFallback className="rounded-none">
                {member.user.full_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div>
            <h3 className="text-primary underline-none font-medium hover:underline mb-1">
              <Link to={`/accounts/profile/${member.user.pkId}`}>
                {member.user.full_name}
              </Link>
            </h3>
            <p className="text-sm text-gray-500">
              Membre depuis: {formatIsoDate(member.date_joined)}
            </p>
            <p className="text-sm text-gray-600">
              {member.user.country}
            </p>
          </div>
        </div>
      ))}

      {/* Warning Modal */}
      {showWarningModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-lg max-w-md w-full relative">
            {/* Close button */}
            <button
              onClick={() => {
                setShowWarningModal(false);
                setSelectedMember(null);
              }}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            {showWarningModal && selectedMember && (
              <IssueWarningForm
                member={selectedMember}
                shouldSuspend={selectedMember.shouldSuspend} // Pass the flag
                onClose={() => {
                  setShowWarningModal(false);
                  setSelectedMember(null);
                }} 
              />
            )}
          </div>
        </div>
      )}

    </div>
  )
}