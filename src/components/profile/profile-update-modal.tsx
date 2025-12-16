import { useState } from "react"
import { Button } from "../ui/Button"
import { Input } from "../ui/input"
import Modal from "../ui/Modal"
import TextArea from "../ui/Textarea"
import { UserProfile } from "../pages/UserProfilPage"

interface ProfileUpdateModalProps {
    isOpen: boolean
    onClose: () => void
    userProfile: UserProfile
    onProfileUpdate: (updatedData: UserProfile) => void
  }
  
  export function ProfileUpdateModal({ 
    isOpen, 
    onClose, 
    userProfile,
    onProfileUpdate 
  }: ProfileUpdateModalProps) {
    const [formData, setFormData] = useState({
      email: userProfile.utilisateur.email,
      first_name: userProfile.utilisateur.first_name,
      last_name: userProfile.utilisateur.last_name,
      country: userProfile.utilisateur.country,
      biographie: userProfile.biographie,
      lieu: userProfile.lieu,
      organisation: userProfile.organisation,
      poste: userProfile.poste,
      x_profile_url: userProfile.x_profile_url,
      linkedin_url: userProfile.linkedin_url
    })
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const updatedProfile = await onProfileUpdate(formData)
        onClose()
      } catch (error) {
        console.error("Update failed:", error)
      }
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <Input
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
  
          <TextArea
            label="Bio"
            name="biographie"
            value={formData.biographie}
            onChange={handleChange}
            rows={3}
          />
  
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Input
              label="Position"
              name="poste"
              value={formData.poste}
              onChange={handleChange}
            />
            <Input
              label="Organization"
              name="organisation"
              value={formData.organisation}
              onChange={handleChange}
            />
            <Input
              label="Location"
              name="lieu"
              value={formData.lieu}
              onChange={handleChange}
            />
          </div>
  
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#1d4b44] text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    )
  }