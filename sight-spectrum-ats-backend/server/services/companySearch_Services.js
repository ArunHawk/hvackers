class CompnayBooleanSearch {

    static async companyBoolean(search,company_boolean,company_search_in){
        const searchQuery = search.join(" ");
        const regex = /\s+(AND|OR|NOT|and|or|not)\s+/;
        if (!searchQuery) {
          return "Query Parameter is Missing";
        }
      const separatedStrings = searchQuery.split(regex);
      const exclude=["and", "or", "not","AND", "OR", "NOT"];
      const commonBoolean =separatedStrings.filter(item => !exclude.includes(item));
      const andArray = [];
      const orArray = [];
      const notArray = [];
      let currentArray= [];
      if(separatedStrings[1]==="or" |separatedStrings[1]==="OR" ){
        currentArray = orArray;
      }
      else
      {
        currentArray = andArray;
      }
      for (const item of separatedStrings) {
        if (item === "AND" | item === "and" ) {
          currentArray = andArray;
        } else if (item === "OR" | item === "or" ) {
          currentArray = orArray;
        } else if (item === "NOT" | item === "not" ) {
          currentArray = notArray;
        } else {
          currentArray.push(item.trim());
        }
      }

      const modifiedData=[...andArray, ...orArray];

      function makeArrayCaseInsensitive(arr) {
        return arr.map(item => new RegExp(item, 'i'));
      }
      let starRegx = makeArrayCaseInsensitive(search)
      let andBooleanWords= makeArrayCaseInsensitive(andArray);
      let orBooleanword= makeArrayCaseInsensitive(orArray);
      let excludedWord= makeArrayCaseInsensitive(notArray);
      let commonBooleanword= makeArrayCaseInsensitive(commonBoolean );
      let modifiedResults= makeArrayCaseInsensitive(modifiedData);
      const companyTrue = (company_search_in.currentCompany == true) || (company_search_in.previousCompany === true);
      const companyValues = new RegExp(companyTrue,"i")
      const mandatoryWords = andBooleanWords.length > 0 ? andBooleanWords : modifiedResults;
      const queryOptions = andBooleanWords.length >0 ? {$all:mandatoryWords.flat()}:{$in:mandatoryWords.flat()};
      if((company_boolean == true) && (search.length >0)){
        if((company_search_in.currentOrPreviousCompany === true) && !(excludedWord.length >0)){
            return {"employment_details.company_name":queryOptions}
        }else if((company_search_in.currentOrPreviousCompany === true) && (excludedWord.length >0)){
            return {$and:[{"employment_details.company_name":queryOptions},{"employment_details.company_name":{$nin:excludedWord}}]}
        }else if((company_search_in.currentOrPreviousCompany === false) && !(excludedWord.length >0)){
            return {$and:[{"employment_details.company_name":queryOptions},{"employment_details.is_current":companyValues}]}
        }
        else if((company_search_in.currentOrPreviousCompany === false) && (excludedWord.length >0)) {
            return {$and:[{"employment_details.company_name":queryOptions},{"employment_details.is_current":companyValues},{"employment_details.company_name":{$nin:excludedWord}}]}
        }
        }
        if((company_boolean == false) && (search.length >0)){
            return{"employment_details.company_name":{$in:starRegx.flat()}}
        }
      }
    static async excludeBoolean(search,company_boolean,company_search_in){
        const searchQuery = search.join(" ");
        const regex = /\s+(AND|OR|NOT|and|or|not)\s+/;
        if (!searchQuery) {
          return "Query Parameter is Missing";
        }
      const separatedStrings = searchQuery.split(regex);
      const exclude=["and", "or", "not","AND", "OR", "NOT"];
      const commonBoolean =separatedStrings.filter(item => !exclude.includes(item));
      const andArray = [];
      const orArray = [];
      const notArray = [];
      let currentArray= [];
      if(separatedStrings[1]==="or" |separatedStrings[1]==="OR" ){
        currentArray = orArray;
      }
      else
      {
        currentArray = andArray;
      }
      for (const item of separatedStrings) {
        if (item === "AND" | item === "and" ) {
          currentArray = andArray;
        } else if (item === "OR" | item === "or" ) {
          currentArray = orArray;
        } else if (item === "NOT" | item === "not" ) {
          currentArray = notArray;
        } else {
          currentArray.push(item.trim());
        }
      }

      const modifiedData=[...andArray, ...orArray];

      function makeArrayCaseInsensitive(arr) {
        return arr.map(item => new RegExp(item, 'i'));
      }
      let starRegx = makeArrayCaseInsensitive(search)
      let andBooleanWords= makeArrayCaseInsensitive(andArray);
      let orBooleanword= makeArrayCaseInsensitive(orArray);
      let excludedWord= makeArrayCaseInsensitive(notArray);
      let commonBooleanword= makeArrayCaseInsensitive(commonBoolean );
      let modifiedResults= makeArrayCaseInsensitive(modifiedData);
      const companyTrue = (company_search_in.currentCompany == true) || (company_search_in.previousCompany === true);
      const companyValues = new RegExp(companyTrue,"i")
      const mandatoryWords = andBooleanWords.length > 0 ? andBooleanWords : modifiedResults;
      const queryOptions = andBooleanWords.length >0 ? {$nin:mandatoryWords.flat()}:{$nin:mandatoryWords.flat()};
      
      if((company_boolean == true) && (search.length >0)){
        if((company_search_in.currentOrPreviousCompany === true) && !(excludedWord.length >0)){
            return {"employment_details.company_name":queryOptions}
        }else if((company_search_in.currentOrPreviousCompany === true) && (excludedWord.length >0)){
            return {$and:[{"employment_details.company_name":queryOptions},{"employment_details.company_name":{$nin:excludedWord}}]}
        }else if((company_search_in.currentOrPreviousCompany === false) && !(excludedWord.length >0)){
            return {$and:[{"employment_details.company_name":queryOptions},{"employment_details.is_current":companyValues}]}
        }
        else if((company_search_in.currentOrPreviousCompany === false) && (excludedWord.length >0)) {
            return {$and:[{"employment_details.company_name":queryOptions},{"employment_details.is_current":companyValues},{"employment_details.company_name":{$nin:excludedWord}}]}
        }
        }
        if((company_boolean == false) && (search.length >0)){
            return{"employment_details.company_name":{$nin:starRegx.flat()}}
        }
      }
    static async designation_Boolean(search,company_boolean,company_search_in){
        const searchQuery = search.join(" ");
        if (!searchQuery) {
          return "Query Parameter is Missing";
        }
        const regex = /\s+(AND|OR|NOT|and|or|not)\s+/;
      const separatedStrings = searchQuery.split(regex);
      const exclude=["and", "or", "not","AND", "OR", "NOT"];
      const commonBoolean =separatedStrings.filter(item => !exclude.includes(item));
      const andArray = [];
      const orArray = [];
      const notArray = [];
      let currentArray= [];
      
      if(separatedStrings[1]==="or" |separatedStrings[1]==="OR" ){
        currentArray = orArray;
      }
      else
      {
        currentArray = andArray;
      }
      for (const item of separatedStrings) {
        if (item === "AND" | item === "and" ) {
          currentArray = andArray;
        } else if (item === "OR" | item === "or" ) {
          currentArray = orArray;
        } else if (item === "NOT" | item === "not" ) {
          currentArray = notArray;
        } else {
          currentArray.push(item.trim());
        }
      }

      const modifiedData=[...andArray, ...orArray];

      function makeArrayCaseInsensitive(arr) {
        return arr.map(item => new RegExp(item, 'i'));
      }
      let starRegx = makeArrayCaseInsensitive(search)
      let andBooleanWords= makeArrayCaseInsensitive(andArray);
      let orBooleanword= makeArrayCaseInsensitive(orArray);
      let excludedWord= makeArrayCaseInsensitive(notArray);
      let commonBooleanword= makeArrayCaseInsensitive(commonBoolean );
      let modifiedResults= makeArrayCaseInsensitive(modifiedData);

      const companyTrue = (company_search_in.currentCompany == true) || (company_search_in.previousCompany === true);
      const companyValues = new RegExp(companyTrue,"i")
      const mandatoryWords = andBooleanWords.length > 0 ? andBooleanWords : modifiedResults;
      const queryOptions = andBooleanWords.length >0 ? {$all:mandatoryWords.flat()}:{$in:mandatoryWords.flat()};
   
      if((company_boolean == true) && (search.length >0)){
        if((company_search_in.currentOrPreviousCompany === true) && !(excludedWord.length >0)){
            return {"employment_details.job_role":queryOptions}
        }else if((company_search_in.currentOrPreviousCompany === true) && (excludedWord.length >0)){
            return {$and:[{"employment_details.job_role":queryOptions},{"employment_details.job_role":{$nin:excludedWord}}]}
        }else if((company_search_in.currentOrPreviousCompany === false) && !(excludedWord.length >0)){
            return {$and:[{"employment_details.job_role":queryOptions},{"employment_details.is_current":companyValues}]}
        }
        else if((company_search_in.currentOrPreviousCompany === false) && (excludedWord.length >0)) {
            return {$and:[{"employment_details.job_role":queryOptions},{"employment_details.is_current":companyValues},{"employment_details.job_role":{$nin:excludedWord}}]}
        }
        }
        if((company_boolean == false) && (search.length >0)){
            return{"employment_details.job_role":{$in:starRegx.flat()}}
        }
      }
}

module.exports = CompnayBooleanSearch;