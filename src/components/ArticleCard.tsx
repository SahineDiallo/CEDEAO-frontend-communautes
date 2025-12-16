const ArticleCard = () => {
  return (
    <div className="max-w-2xl">
      <img
        src="/image_7.jpg"
        alt="Femme souriante au marché"
        className="w-full h-80 object-cover rounded-lg mb-4"
      />

      <div className="space-y-2">
        <div className="text-gray-500 text-sm">06/03/2023</div>

        <h2 className="text-xl font-semibold text-gray-900">
          Burberry se redore le blason avec un nouveau logo antique
        </h2>

        <p className="text-gray-600 text-base">
          Le nouveau logo de Burberry redore le blason de la marque en adoptant
          une typographie antique et en récupérant son chevalier.
        </p>
      </div>
    </div>
  );
};

export default ArticleCard;
