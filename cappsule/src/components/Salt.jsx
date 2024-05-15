import React, { useState, useEffect } from 'react';

function Salt() {
  const [saltSuggestions, setSaltSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  

  useEffect(() => {
    const url = 'https://backend.cappsule.co.in/api/v1/new_search?q=paracetamol&pharmacyIds=1,2,3';
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setSaltSuggestions(data.data.saltSuggestions);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = saltSuggestions.filter(suggestion =>
        suggestion.salt.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]);
    }
  }, [searchTerm, saltSuggestions]);

  const renderPharmacyInfo = (commonForm) => {
  // Safe access using optional chaining and validation
  if (commonForm) {
    const formDetails = saltSuggestions.reduce((acc, suggestion) => {
      // Navigate down the JSON object safely
      return suggestion.salt_forms_json?.[commonForm.Form]?.[commonForm.Strength]?.[commonForm.Packing] || acc;
    }, null);

    if (formDetails) {
      // Flatten all entries into a single array to map over them
      const allPharmacies = Object.values(formDetails).filter(Boolean).flat();
      if (allPharmacies.length) {
        return allPharmacies.map((pharmacy, index) => (
          <p 
          className='font-bold text-2xl'
          key={index}>
          From ₹{pharmacy.selling_price}
          </p>
        ));
      }
    }
  }
  return <p>No Store Is Selling This Product Near You.</p>;
};

  return (

    <div className='mr-56 ml-56'>

      <h1 className='text-center text-2xl mt-6'>Cappsule web development test</h1> 

      <input
        className='p-4 mb-8 border border-gray-100 rounded-xl shadow'
        type="text"
        placeholder="Type your medicine name here..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <hr className=' p-4'  />

        {filteredResults.length > 0 ? (
        filteredResults.map((suggestion) => (

          <div
            className="mb-10  p-4 bg-white border border-gray-100 rounded-lg shadow  bg-gradient-to-r from-gray-100 from-60% to-green-100 to-80%"
            key={suggestion.id}>

            <div className='grid grid-cols-3 gap-4 content-center text-center'>
              <div>
              <h2>{suggestion.salt}</h2>
              <p>Form: {suggestion.most_common.Form}</p>
              <p>Strength: {suggestion.most_common.Strength}</p>
              <p>Packing: {suggestion.most_common.Packing}</p>
            </div>

            <div className='content-center text-center'>
              <h2  className='font-bold text-xl '>Salt A</h2>
              <p className=''>{suggestion.most_common.Form}|{suggestion.most_common.Strength}|{suggestion.most_common.Packing}</p>
            </div>

            <div className="content-center text-center">
              {renderPharmacyInfo(suggestion.most_common)}
            </div>
            </div>

          </div>

          



        ))   
      ) : searchTerm && (
        <p className='text-center color-red'>No Results Found</p>
      )}

    </div>
  );
}

export default Salt;
