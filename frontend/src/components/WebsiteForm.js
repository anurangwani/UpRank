import React, { useState } from "react";

const WebsiteForm = ({ fetchData }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(url);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Enter website URL" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
      />
      <button type="submit">Get SEO Data</button>
    </form>
  );
};

export default WebsiteForm;
