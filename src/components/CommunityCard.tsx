const NewsCard = () => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white ml-5">
      <img
        src="/image_7.jpg"
        alt="People gathering in garden"
        className="w-full h-48 object-cover"
      />
      <div className="p-0">
        <h3 className="text-sm font-semibold text-gray-800 my-4">
          Donner un nouveau legs pour le paysage rural
        </h3>
        <p className="text-gray-600 text-sm">
          A l'aide de plusieurs legs-patrimoniaux, nous protégeons et
          développons durablement l'espace rural pour les générations futures.
        </p>
        {/* <div className="mt-4 flex items-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            En savoir plus →
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default NewsCard;
