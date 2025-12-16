import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/Accordion";
import { HeroSection } from "../home/Hero-section";
import { CountrySelect } from "../ui/SelectButton";
import { countries } from 'countries-list';

const API_URL = import.meta.env.VITE_MAIN_DOMAIN || 'http://localhost:8000/api';

interface Member {
  pkId: string;
  first_name: string;
  last_name: string;
  email: string;
  country: {
    name: string;
    code: string;
  };
  communities: {
    role: string;
    communities: string[];
  }[];
}

export default function RechercheMembre() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    country: "",
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/comptes/all-members/`;
        
        // Add query parameters based on filters and search
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (filters.role) params.append('memberships__role', filters.role);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMembers(data);
      } catch (err) {
        if(err instanceof Error) {
          setError(err.message || 'Failed to fetch members');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [searchTerm, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will trigger automatically with the new searchTerm
  };

  const handleRoleFilter = (role: string) => {
    setFilters(prev => ({ ...prev, role }));
  };

  const handleCountryFilter = (countryCode: string) => {
    setFilters(prev => ({ ...prev, country: countryCode }));
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading members...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <HeroSection title="Membres de nos Communautés" />

      <div className="container mx-auto p-6">
        {/* Fil d'Ariane */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link to="/" className="text-primary hover:underline">
            Connect
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Recherche de membres</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Barre latérale de recherche avancée - À gauche */}
          <div className="lg:col-span-1">
            <div className="border-r border-[#128C4F] p-6">
              <h2 className="text-2xl font-semibold text-primary mb-6">Recherche avancée</h2>

              <div className="space-y-6">
                <form onSubmit={handleSearch}>
                  <div>
                    <h3 className="font-medium mb-2">Rechercher des membres</h3>
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="w-full border-[#128C4F] rounded-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button 
                      type="submit"
                      className="w-full mt-4 bg-primary hover:bg-[#df7440] rounded-none"
                    >
                      Appliquer
                    </Button>
                  </div>
                </form>

                <div className="border-t border-[#128C4F] pt-6">
                  <h3 className="text-xl font-semibold mb-4">Filtres</h3>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="types">
                      <AccordionTrigger className="text-primary">
                        Institutions
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {Array.from(new Set(
                            members.flatMap(m => 
                              m.communities.map(c => c.role)
                            )
                          )).map(role => (
                            <div key={role} className="flex items-center">
                              <input
                                type="checkbox"
                                id={`role-${role}`}
                                checked={filters.role === role}
                                onChange={() => 
                                  handleRoleFilter(filters.role === role ? "" : role)
                                }
                              />
                              <label htmlFor={`role-${role}`} className="ml-2">
                                {role}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="countries">
                      <AccordionTrigger className="text-primary">
                        Pays
                      </AccordionTrigger>
                      <AccordionContent>
                        <CountrySelect 
                          onChange={() => handleCountryFilter}
                          value={filters.country}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu de la recherche de membres - À droite */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-semibold text-primary mb-4">Recherche de membres</h1>
            <p className="text-gray-600 mb-8">
              {members.length} membres trouvés
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {members.map((member) => (
                <div 
                  key={member.pkId} 
                  className="border border-[#128C4F] p-4 flex items-start gap-4"
                >
                  <Avatar className="w-16 h-16 rounded-none">
                    <AvatarFallback className="rounded-none bg-[#f3f3f3]">
                      {member.first_name[0]}{member.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-primary mb-1 font-medium hover:underline">
                      <Link to={`/accounts/profile/${member.pkId}`}>
                        {member.first_name} {member.last_name}
                      </Link>
                    </h3>
                    {member.communities.length > 0 && (
                      <p className="text-sm text-gray-500">
                        {member.communities[0].role}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {countries[member.country]?.name || member.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}