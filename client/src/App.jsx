import React from "react";
import MergePDF from "./components/MergePDF";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-center text-3xl font-bold p-6">
        PDF - Merge
      </h1>
      <MergePDF />
    </div>
  );
}

export default App;
