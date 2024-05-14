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
          <p key={index}>
            Store ID : {pharmacy.pharmacy_id}, Price: {pharmacy.selling_price}
          </p>
        ));
      }
    }
  }
  return <p>No Store Is Selling This Product Near You.</p>;
};


  return (
    <div>
      {/* <h1>Salt Search</h1>
      <input
        type="text"
        placeholder="Search for a salt..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredResults.length > 0 ? (
        filteredResults.map((suggestion) => (
          <div key={suggestion.id}>
            <h2>{suggestion.salt}</h2>
            <p>Form: {suggestion.most_common.Form}</p>
            <p>Strength: {suggestion.most_common.Strength}</p>
            <p>Packing: {suggestion.most_common.Packing}</p>

            {renderPharmacyInfo(suggestion.most_common)}
          </div>
        ))
      ) : searchTerm && (
        <p>No results found</p>
      )} */}


    <h1>Salt Search</h1>
    <input
        className=''
        type="text"
        placeholder="Search for a salt..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
    />
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Salt
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Form
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Strength
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Packing
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Availability & Price
                    </th>
                </tr>
            </thead>

            <tbody>
            {filteredResults.length > 0 ? (
            filteredResults.map((suggestion) => (
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                key={suggestion.id}>
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {suggestion.salt}
                    </th>
                    <td class="px-6 py-4">
                        {suggestion.most_common.Form}
                    </td>
                    <td class="px-6 py-4">
                        {suggestion.most_common.Strength}
                    </td>
                    <td class="px-6 py-4">
                        {suggestion.most_common.Packing}
                    </td>
                    <td class="px-6 py-4">
                        {renderPharmacyInfo(suggestion.most_common)}
                    </td>
                </tr>
                ))
            ) : searchTerm && (
                <p>No results found</p>
            )}
            </tbody>
        </table>
    </div>
  );
}

export default Salt;
