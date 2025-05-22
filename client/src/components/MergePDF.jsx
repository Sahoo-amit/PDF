import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const MergePDF = () => {
  const [files, setFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    onDrop: (acceptedFiles) => setFiles(acceptedFiles),
  });

  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("pdfs", file));

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/pdf/merge",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setDownloadUrl(`http://localhost:3000${res.data.downloadUrl}`);
    } catch (error) {
      console.error(error);
      alert("Failed to merge PDFs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const fileName = downloadUrl.split("/").pop();
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = fileName || "merged.pdf";
      downloadLink.click();
    } catch (err) {
      alert("Failed to download PDF");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-8 shadow rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Merge PDFs</h2>

      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-4 text-center cursor-pointer mb-4"
      >
        <input {...getInputProps()} />
        <p>Drag & drop PDF files here, or click to select</p>
      </div>

      <ul className="text-sm mb-2">
        {files.map((file, idx) => (
          <li key={idx}>{file.name}</li>
        ))}
      </ul>

      <button
        onClick={handleMerge}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Merging..." : "Merge PDFs"}
      </button>

      {downloadUrl && (
        <div className="mt-4">
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download Merged PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default MergePDF;
