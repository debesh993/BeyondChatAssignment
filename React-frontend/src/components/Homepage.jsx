import { useEffect, useState } from "react";

export default function Homepage() {
  const [originalArticles, setOriginalArticles] = useState([]);
  const [updatedArticles, setUpdatedArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/original-articles")
      .then((res) => res.json())
      .then((data) => setOriginalArticles(data));

    fetch("http://127.0.0.1:8000/api/updated-articles")
      .then((res) => res.json())
      .then((data) => setUpdatedArticles(data));
  }, []);

  const isUpdated = (articleId) =>
    updatedArticles.some((ua) => ua.original_article_id === articleId);

  const getUpdatedArticle = (articleId) =>
    updatedArticles.find((ua) => ua.original_article_id === articleId);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Click on each card to see details
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {originalArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-2xl transition"
            onClick={() => setSelectedArticle(article)}
          >
            <h2 className="font-semibold text-lg mb-2">{article.title}</h2>
            <p className="text-gray-700 text-sm line-clamp-3">
              {article.content}
            </p>
            <span
              className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                isUpdated(article.id)
                  ? "bg-green-200 text-green-800"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {isUpdated(article.id) ? "Updated" : "Original"}
            </span>
          </div>
        ))}
      </div>

      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedArticle(null);
          }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{selectedArticle.title}</h2>

            {isUpdated(selectedArticle.id) ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-gray-100 p-4 rounded">
                  <h3 className="font-semibold mb-2">Original Article</h3>
                  <p>{selectedArticle.content}</p>
                </div>

                <div className="flex-1 bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Updated Article</h3>
                  <p>{getUpdatedArticle(selectedArticle.id).content}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold text-blue-700 mb-1">
                      References:
                    </h4>
                    <ul className="list-disc list-inside text-blue-600 text-sm">
                      {getUpdatedArticle(selectedArticle.id)
                        .references.split(",")
                        .map((ref, idx) => (
                          <li key={idx}>{ref.trim()}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p>{selectedArticle.content}</p>
              </div>
            )}

            <button
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setSelectedArticle(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
