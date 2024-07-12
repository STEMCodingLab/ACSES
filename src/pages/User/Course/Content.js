import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const Content = ({ sessionId }) => {
  const [contents, setContents] = useState([]);
  const [selectedContents, setSelectedContents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState(null);
  const [programTitle, setProgramTitle] = useState('');
  const [sessionTitle, setSessionTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    fetch(`https://vivid-bloom-0edc0dd8df.strapiapp.com/api/contents?populate=session.program,Material,Cover&filters[session][id][$eq]=${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setContents(data.data);
        if (data.data.length > 0) {
          setProgramTitle(data.data[0].attributes.session.data.attributes.program.data.attributes.Title);
          setSessionTitle(data.data[0].attributes.session.data.attributes.Title);
        }
      })
      .catch(error => {
        console.error('Error fetching content:', error);
        setError('Failed to fetch content. Please try again later.');
      });
  }, [sessionId]);

  const handleContentClick = (contentId) => {
    navigate(`/content/${contentId}`);
  };

  const toggleSelectAll = () => {
    setSelectAll(prevSelectAll => {
      if (prevSelectAll) {
        setSelectedContents([]);
      } else {
        setSelectedContents(contents.map(content => content.id));
      }
      return !prevSelectAll;
    });
  };

  const handleSelectContent = (contentId) => {
    setSelectedContents(prevSelected => {
      if (prevSelected.includes(contentId)) {
        const newSelected = prevSelected.filter(id => id !== contentId);
        if (newSelected.length !== contents.length) {
          setSelectAll(false);
        }
        return newSelected;
      } else {
        const newSelected = [...prevSelected, contentId];
        if (newSelected.length === contents.length) {
          setSelectAll(true);
        }
        return newSelected;
      }
    });
  };

  const downloadFile = async (url, fileName) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download ${fileName}`);
      }
      const blob = await response.blob();
      return { fileName, blob };
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  };

  const handleDownload = async () => {
    if (selectedContents.length === 0) {
      console.log('No content selected for download');
      return;
    }

    const zip = new JSZip();

    await Promise.all(selectedContents.map(async (contentId) => {
      const content = contents.find(c => c.id === contentId);
      if (content && content.attributes.Material.data.length > 0) {
        const downloadUrl = content.attributes.Material.data[0].attributes.url;
        const fileName = content.attributes.Title + getFileExtension(content.attributes.Type);
        const file = await downloadFile(downloadUrl, fileName);
        zip.file(file.fileName, file.blob);
      } else {
        console.log(`No material found for content ID: ${contentId}`);
      }
    }));

    zip.generateAsync({ type: 'blob' })
      .then((blob) => {
        const zipFileName = `${programTitle}_${sessionTitle}.zip`;
        saveAs(blob, zipFileName);
      })
      .catch(error => {
        console.error('Error generating Zip file:', error);
      });
  };

  const getFileExtension = (type) => {
    switch(type) {
      case 'PDF':
        return '.pdf';
      case 'Word':
        return '.docx';
      case 'PowerPoint':
        return '.pptx';
      case 'Video':
        return '.mp4';
      default:
        return '';
    }
  };

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-2" style={{ paddingLeft: '1.5rem' }}>
        <button
          className="inline-block bg-yellow-500 rounded-full px-3 py-1 text-sm font-semibold text-white"
          onClick={handleDownload}
          disabled={selectedContents.length === 0}
        >
          Download Selected
        </button>
      </div>
      <div className="bg-[#ffffff] overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          <li className="px-6 py-4">
            <div className="flex justify-between">
              <div className="w-1/3 text-sm font-medium text-gray-500 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="mr-2"
                />
                Title
              </div>
              <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">Description</div>
              <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">Operation</div>
            </div>
          </li>
          {contents.map(content => (
            <li key={content.id} className="flex justify-between items-center px-6 py-4 mb-2 transition duration-300 ease-in-out hover:shadow-lg hover:border-transparent border-b border-gray-200">
              <div className="w-1/3 text-sm font-medium text-blue-500">
                <input
                  type="checkbox"
                  checked={selectedContents.includes(content.id)}
                  onChange={() => handleSelectContent(content.id)}
                  className="mr-2"
                />
                {content.attributes.Title}
              </div>
              <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">{content.attributes.Description}</div>
              <div className="w-1/3 text-sm font-medium text-gray-500 ml-16">
                {content.attributes.Type === 'Video' && (
                  <button
                    className="bg-blue-500 rounded-full px-3 py-1 text-sm font-semibold text-white"
                    onClick={() => handleContentClick(content.id)}
                  >
                    Watch
                  </button>
                )}
                {content.attributes.Type === 'PDF' && (
                  <button
                    className="bg-green-500 rounded-full px-3 py-1 text-sm font-semibold text-white"
                    onClick={() => handleContentClick(content.id)}
                  >
                    Read
                  </button>
                )}
                {content.attributes.Type === 'PowerPoint' && (
                  <button
                    className="bg-red-500 rounded-full px-3 py-1 text-sm font-semibold text-white"
                    onClick={() => handleContentClick(content.id)}
                  >
                    Download
                  </button>
                )}
                {content.attributes.Type === 'Word' && (
                  <button
                    className="bg-purple-500 rounded-full px-3 py-1 text-sm font-semibold text-white"
                    onClick={() => handleContentClick(content.id)}
                  >
                    Open
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
