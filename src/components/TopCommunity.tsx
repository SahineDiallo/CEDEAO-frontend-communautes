import { Users, User, Handshake, FileText } from "lucide-react";
import NewsCard from "./CommunityCard";
import ArticleCard from "./ArticleCard";
import CommunityActivity from "./CommunityActivity";

const TopCommunity = () => {
  return (
    <div className="max-w-4xl mx-auto h-10 mt-8">
      {/* Texte et top photo */}
      <div className="grid grid-cols-12 gap-0">
        <div className="col-span-4 pl-0 text-center">
          {/* Title */}
          <h3 className="text-1xl font-bold text-left text-black-600 mb-4">
            Nos communautés de pratiques
          </h3>

          {/* Paragraph */}
          <p className="text-sm text-gray-700 leading-relaxed text-left">
            Ceci est un paragraphe d'exemple. Vous pouvez l'utiliser pour
            afficher du texte de manière claire et lisible grâce à Tailwind CSS.
            Utilisez les différentes classes utilitaires de Tailwind pour
            personnaliser la mise en forme selon vos besoins.
          </p>
        </div>
        <div className="col-span-8 ml-2.5 text-center">
          {/* Image that takes full width */}
          <img
            src="/image_3.jpg"
            alt="Image 3"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-12 gap-0 mt-6 ">
        <div className="col-span-4"></div>
        <div className="col-span-8 ml-2.5">
          <div className="grid grid-cols-12">
            <div className="col-span-3 text-center">
              <div className="flex flex-col items-center text-orange-400">
                <Users className="w-8 h-8 " />
                <span className=" text-sm my-2">Communaute</span>
                <span className="text-3xl font-semibold">10</span>
              </div>
            </div>

            <div className="col-span-3 text-center">
              <div className="flex flex-col items-center">
                <User className="w-8 h-8 text-gray-500" />
                <span className="text-gray-600 text-sm my-2">Membres</span>
                <span className="text-3xl font-semibold">33</span>
              </div>
            </div>

            <div className="col-span-3 text-center">
              <div className="flex flex-col items-center">
                <Handshake className="w-8 h-8 text-gray-600" />
                <span className="text-gray-600 text-sm my-2">Partenaires</span>
                <span className="text-3xl font-semibold">9</span>
              </div>
            </div>

            <div className="col-span-3 text-center">
              <div className="flex flex-col items-center">
                <FileText className="w-8 h-8 text-gray-500" />
                <span className="text-gray-600 text-sm my-2">Ressources</span>
                <span className="text-3xl font-semibold">25</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-8">
        <div className="col-span-4">
          <NewsCard />
        </div>
        <div className="col-span-4">
          <NewsCard />
        </div>
        <div className="col-span-4">
          <NewsCard />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-1 mt-8 mb-100">
        <div className="col-span-8 ml-5">
          <ArticleCard />
        </div>
        <div className="col-span-4 ml-5">
          <CommunityActivity />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-1 mt-8">
        <div className="col-span-4">
          <NewsCard />
        </div>
        <div className="col-span-4">
          <NewsCard />
        </div>
        <div className="col-span-4">
          <NewsCard />
        </div>
      </div>
    </div>
  );
};

export default TopCommunity;
