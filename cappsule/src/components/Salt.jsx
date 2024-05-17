import React, { useState, useEffect } from 'react';

function Salt() {
  const [saltSuggestions, setSaltSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [salts, setSalts] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']);
  const [showAllForms, setShowAllForms] = useState(false);
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
        const initialSaltSuggestions = data.data.saltSuggestions.map(suggestion => ({
          ...suggestion,
          showAllForms: false // Initialize showAllForms property for each suggestion
        }));
        setSaltSuggestions(initialSaltSuggestions);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  //using search button searching the different slats
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

  //this is the function hide and more button "available_foms"
    const toggleFormsVisibility = (suggestionId) => {
    setSaltSuggestions(prevSuggestions => {
      return prevSuggestions.map(suggestion => {
        if (suggestion.id === suggestionId) {
          return { ...suggestion, showAllForms: !suggestion.showAllForms };
        }
        return suggestion;
      });
    });
    };


  //Here we filtering the pharmacy_id and price of slats
  const renderPharmacyInfo = (commonForm) => {
  if (commonForm) {
    const formDetails = saltSuggestions.reduce((acc, suggestion) => {    
      return suggestion.salt_forms_json?.[commonForm.Form]?.[commonForm.Strength]?.[commonForm.Packing] || acc;
    }, null);

    if (formDetails) {  
      const allPharmacies = Object.values(formDetails).filter(Boolean).flat();
      // if (allPharmacies.length) {
      //   return allPharmacies.map((pharmacy, index) => (
      //     <p 
      //     className='font-bold text-2xl'
      //     key={index}>
      //     From ₹{pharmacy.selling_price}
      //     </p>
      //   ));
      // }
      if (formDetails) {  
            const allPharmacies = Object.values(formDetails).filter(Boolean).flat();
            if (allPharmacies.length) {
              // Extracting all selling prices
              const sellingPrices = allPharmacies.map(pharmacy => pharmacy.selling_price);
              // Sorting selling prices in ascending order
              const sortedPrices = sellingPrices.sort((a, b) => a - b);
              // Selecting the lowest price
              const lowestPrice = sortedPrices[0];
              // Rendering lowest price
              const remainingPrices = sortedPrices.slice(1); // Exclude the lowest price
              return (
                <>
                  <p className='font-bold text-2xl'>From ₹{lowestPrice}</p>
                    {remainingPrices.map((price, index) => (
                      <p key={index} className=" font-bold text-2xl">
                        From ₹{price}
                      </p>
                    ))}
                </>
              );
            }
          }
    }
  }
  return <p className='p-4 border border-green-300 bg-slate-50 rounded-xl'>No Store Is Selling This Product Near You.</p>;
};

  return (

    <div className='mr-56 ml-56'>

      <h1 className='text-center text-2xl mt-8'>Cappsule web development test</h1> 

    <div className="relative mb-10 mt-10">
      <input
        type="text"
        className=" p-4 pr-10 w-full border border-gray-100 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-green-200"
        placeholder="Type your medicine name here"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {/* <div className=" absolute inset-y-0 left-0 flex items-center pointer-events-none">
        <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div> */}
    </div>


      <hr/>
      {filteredResults.length === 0 ? 

      <div className='w-full h-96 flex justify-center items-center text-2xl text-gray-500 font-semibold'>" Find Medicine With Amazing Discount "</div>
      
      : (filteredResults.length > 0 ? (
      filteredResults.map((suggestion, index) => (

        <div
          className="mb-10 mt-10 p-4 bg-white border border-gray-100 rounded-2xl shadow bg-gradient-to-r from-slate-50 from-60% to-green-100 to-80%"
          key={suggestion.id}>

          <div className='grid grid-cols-3'>
            <div className='content-center leading-10'>

              {/* salt name */}
              {/* <h2>{suggestion.sat}</h2> */}

            <div className='flex justify-between '>
                <div className='grid'>
                  <p>Form</p>
                  <p>Strength</p>
                  <p>Packing</p>
                </div>

              <div className='grid gap-2'>
                
                <div className='grid grid-cols-2 gap-2 '>
                  {suggestion.showAllForms
                    ? suggestion.available_forms.map((form, i) => (
                        <p
                         className='p-1 text-md font-semibold border cursor-pointer border-green-700 rounded-lg shadow-md hover:shadow-green-700'
                         key={i}>{form}</p>
                      ))
                    : suggestion.available_forms.slice(0, 2).map((form, i) => (
                        <p
                        className='p-1 text-md font-semibold border cursor-pointer border-green-700 rounded-lg shadow-md hover:shadow-green-700'
                        key={i}>{form}</p>
                      ))}
                  {suggestion.available_forms.length > 2 && (
                     <button className='font-semibold text-md text-blue-700' onClick={() => toggleFormsVisibility(suggestion.id)}>
                      {suggestion.showAllForms ? 'Hide' : 'More..'}
                    </button>
                  )}
                </div>

                <div>
                  <p className='p-1 text-md font-semibold border cursor-pointer border-green-700 rounded-lg shadow-md hover:shadow-green-700'>{suggestion.most_common.Strength}</p>
                </div>
                <div>
                  <p className='p-1 text-md font-semibold border cursor-pointer border-green-700 rounded-lg shadow-md hover:shadow-green-700'>{suggestion.most_common.Packing}</p>
                </div>
                
              </div>
            </div>
          </div>

          <div className='content-center text-center'>
            <h2  className='font-bold text-lg '>Salt {salts[index]}</h2>
            <h2 className='font-semibold text-md text-blue-700'>{suggestion.most_common.Form} | {suggestion.most_common.Strength} | {suggestion.most_common.Packing}</h2>
          </div>

          <div className="content-center text-center">
            {renderPharmacyInfo(suggestion.most_common)}
          </div>
          </div>

        </div>

      ))   
      ) : searchTerm && (
        <p className='text-center mt-56 text-2xl text-red-500'>" No Results Found "</p>
      ))}

    </div>
  );
}

export default Salt;
