import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

export const Content = ({ sessionId }) => {
  const [contents, setContents] = useState([]);
  const [selectedContents, setSelectedContents] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/contents?populate=Material,Cover&filters[session][id][$eq]=${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      setContents(data.data);
    })
    .catch(error => {
      console.error('Error fetching content:', error);
      setError('Failed to fetch content. Please try again later.');
    });
  }, [sessionId]);

  const handleContentClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  const handleSelectContent = (contentId) => {
    setSelectedContents(prevSelected => {
      if (prevSelected.includes(contentId)) {
        return prevSelected.filter(id => id !== contentId);
      } else {
        return [...prevSelected, contentId];
      }
    });
  };

  const downloadFile = async (url, fileName) => {
    try {
      console.log(`Downloading: ${fileName} from ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download ${fileName}`);
      }
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleDownload = () => {
    if (selectedContents.length === 0) {
      console.log('No content selected for download');
      return;
    }

    selectedContents.forEach(contentId => {
      const content = contents.find(c => c.id === contentId);
      if (content && content.attributes.Material.data.length > 0) {
        const downloadUrl = content.attributes.Material.data[0].attributes.url;
        const fileName = content.attributes.Title;
        downloadFile(downloadUrl, fileName);
      } else {
        console.log(`No material found for content ID: ${contentId}`);
      }
    });
  };

  return (
    <div>
      <div className="bg-[#ffffff]">
        <div className="p-4 my-4 rounded-lg">
          <div className="mb-2">
            <strong className="font-normal text-lg">Resources</strong>
            <button
              className="inline-block bg-yellow-500 rounded-full px-3 py-1 text-sm font-semibold text-white"
              onClick={handleDownload}
              disabled={selectedContents.length === 0}
            >
              Download Selected
            </button>
            <div className="grid grid-cols-2 gap-4">
              {error && <p className="text-red-500">{error}</p>}
              {contents.length > 0 ? (
                contents.map(content => (
                  <div key={content.id} className="max-w-sm rounded overflow-hidden shadow-lg my-2">
                    <input
                      type="checkbox"
                      checked={selectedContents.includes(content.id)}
                      onChange={() => handleSelectContent(content.id)}
                      className="m-2"
                    />
                    <img
                      className="w-[500px] h-[200px] object-cover"
                      src={`${content.attributes.Cover.data.attributes.url}`}
                      alt={content.attributes.Title}
                    />
                    <div className="px-6 py-4" style={{ height: '150px', overflowY: 'auto' }}>
                      <div className="font-bold text-xl mb-2">{content.attributes.Type} - {content.attributes.Title}</div>
                      <p className="text-gray-700 text-base">
                        {content.attributes.Description}
                      </p>
                    </div>
                    <div className="px-6 pt-4 pb-2">
                      {content.attributes.Type === 'Video' && (
                        <button
                          className="inline-block bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
                          onClick={() => handleContentClick(content.id)}
                          style={{ width: '120px' }}
                        >
                          <i className="far fa-eye"></i> Watch
                        </button>
                      )}
                      {content.attributes.Type === 'PDF' && (
                        <button
                          className="inline-block bg-green-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
                          onClick={() => handleContentClick(content.id)}
                          style={{ width: '120px' }}
                        >
                          <i className="fas fa-book"></i> Read
                        </button>
                      )}
                      {content.attributes.Type === 'PowerPoint' && (
                        <button
                          className="inline-block bg-red-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
                          onClick={() => handleContentClick(content.id)}
                          style={{ width: '120px' }}
                        >
                          <i className="fas fa-download"></i> Download
                        </button>
                      )}
                      {content.attributes.Type === 'Word' && (
                        <button
                          className="inline-block bg-purple-500 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
                          onClick={() => handleContentClick(content.id)}
                          style={{ width: '120px' }}
                        >
                          <i className="fas fa-file-word"></i> Open
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                !error && <p>No resources available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
