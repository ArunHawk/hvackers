const fast_connection = require("../connections/fastconnection");
const { companyBoolean, excludeBoolean,designation_Boolean } = require("./companySearch_Services");

class BooleanSearch {
  
  static async advanceBoolean({ search, booleansearch, starvalues, itSkills, unavi, current_Location,minExp,maxExp,entireResume,company_boolean,company_names,company_search_in,
    exclude_boolean,exclude_company,exclude_search_in,designation_boolean,designation_names,designation_search_in,departmentRole,industry,
   gender,notice_period,workmode,employment_type,annual_salary,conditions,work_permit}) {
    const searchQuery = search.join(" ");
    const starValues = [];
    function isEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(searchQuery);
    }
    function checkSkills(obj, values) {
      return values.every(value =>
        Object.values(obj).some(fieldValue => {
          if (Array.isArray(fieldValue)) {
            return fieldValue.some(item => new RegExp(value, 'i').test(item));
          } else if (typeof fieldValue === 'string') {
            return new RegExp(value, 'i').test(fieldValue);
          }
          return false;
        })
      );
    }
    

    const dataStream = (results) => {
      const data = results.flat().map((e) => {
        return {
          "id": e._id.toString(),
          "skills": Array.isArray(e.skillset) ? e.skillset.map(skill => skill.skill ? skill.skill.toLowerCase() : null) : null,
          "first_name": typeof e.first_name === 'string' ? e.first_name.toLowerCase() : null,
          "last_name": typeof e.last_name === 'string' ? e.last_name.toLowerCase() : null,
          "state": typeof e.state === 'string' ? e.state.toLowerCase() : null,
          "city": typeof e.city === 'string' ? e.city.toLowerCase() : null,
          "prefered_location": typeof e.prefered_location === 'string' ? e.prefered_location.toLowerCase() : null,
          "resume_text": typeof e.resume_text === 'string' ? e.resume_text.toLowerCase() : null,
          "email": typeof e.email === 'string' ? e.email.toLowerCase() : null,
          "employment_details": Array.isArray(e.employment_details) ? e.employment_details.map(detail => typeof detail.job_role === 'string' ? detail.job_role.toLowerCase() : null) : null,
          "employment_skills": Array.isArray(e.employment_details) ? e.employment_details.map(detail => detail.job_skills ? detail.job_skills.toLowerCase() : null) : null,
          "current_location": typeof e.current_location === 'string' ? e.current_location.toLowerCase() : null,
          "experience": Array.isArray(e.skillset) ? e.skillset.map(skill => skill.exp ? skill.exp.toString() : null) : null,
        }
      });
      return data
    }
    

    if (!searchQuery && !starvalues && !current_Location 
      && !minExp && !maxExp && !itSkills && !unavi && !exclude_company
      && !designation_names && !company_names && !notice_period && !departmentRole && !industry
      && !gender && !workmode && !employment_type && !annual_salary && work_permit && !conditions) {
      return "Query Parameter is Missing";
    }
    // Split the input string into an array based on "AND", "OR", and "NOT" as delimiters

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
      function customArrayCaseInsensitive(arr) {
        return arr.map(item => new RegExp(`^${item}$`, 'i'));
      }
      let starRegx = makeArrayCaseInsensitive(search)
      let andBooleanWords= makeArrayCaseInsensitive(andArray);
      let orBooleanword= makeArrayCaseInsensitive(orArray);
      let excludedWord= makeArrayCaseInsensitive(notArray);
      let commonBooleanword= makeArrayCaseInsensitive(commonBoolean );
      let modifiedResults= makeArrayCaseInsensitive(modifiedData);
     
    const criteria = [];
      if((booleansearch == true) && (search.length >0)){
          if ((modifiedResults.length > 0) && (entireResume.EntireResume == false) ) {
            // modifiedResults.push(minExp.toString(),maxExp.toString())
            criteria.push({ 
            $or: [
              { "skillset.skill": { $all: modifiedResults.flat() } },
              { "employment_details.job_skills": { $all: modifiedResults.flat() } },
              { email: { $all: modifiedResults.flat() } },
              { first_name: { $in: modifiedResults.flat() } },
              { last_name: { $all: modifiedResults.flat() } },
              { current_location: { $all: modifiedResults.flat() } },
              { prefered_location: { $all: modifiedResults.flat() } },
              { state: { $all: modifiedResults.flat() } },
              { city: { $all: modifiedResults.flat() } },
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{first_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{first_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{last_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{last_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{current_Location: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{current_Location: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{city: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{city: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.exp":{$gt:minExp,$lt:maxExp}},{"skillset.skill": { $in: modifiedResults.flat()}}]}
            ]
          });
        }
        if(entireResume.EntireResume == true){
          criteria.push({resume_text:{$all:modifiedResults.flat()}})
        }
      }
        //notwords
        if (excludedWord.length > 0) {
            criteria.push({ 
              $and: [
                { current_location: { $nin: excludedWord.flat() }},
              { first_name: { $nin: excludedWord.flat() } },
              { last_name: { $nin: excludedWord.flat() } },
              { "skillset.skill": { $nin: excludedWord.flat() } },
              { prefered_location: { $nin: excludedWord.flat() } },
              { email: { $nin: excludedWord.flat() } },
              { city: { $nin: excludedWord.flat() } },
              { state: { $nin: excludedWord.flat() } },
              { "employment_details.job_role": { $nin: excludedWord.flat() } },
              { "employment_details.job_skills": { $nin: excludedWord.flat() } },
              {resume_text:{$all:excludedWord.flat()}}
            ]
          });
        }
    if((booleansearch == false) && (search.length >0)){
      if ((search.length > 0) && (entireResume.EntireResume == false)) {
         starValues.push(starvalues)
        criteria.push({ 
        $or: [
          { "skillset.skill": { $all: starRegx.flat() } },
          { "employment_details.job_skills": { $all: starRegx.flat() } },
          { email: { $all: starRegx.flat() } },
          { first_name: { $all: starRegx.flat() } },
          { last_name: { $all: starRegx.flat() } },
          { current_location: { $all: starRegx.flat() } },
          { prefered_location: { $all: starRegx.flat() } },
          { state: { $all: starRegx.flat() } },
          { city: { $all: starRegx.flat() } },
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{first_name: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{first_name: { $in: starRegx.flat() }}]},
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{last_name: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{last_name: { $in: starRegx.flat() }}]},
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{current_Location: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{current_Location: { $in: starRegx.flat() }}]},
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{city: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{city: { $in: starRegx.flat() }}]},
        ]
      });
    }
    if(entireResume.EntireResume == true){
      criteria.push({resume_text:{$all:starRegx.flat()}})
    }
  }
    if (current_Location.length > 0) {
      const loc = makeArrayCaseInsensitive(current_Location)
      if(entireResume.EntireResume == true){
        criteria.push({$and:[{resume_text:{$all:loc}},{ current_location: { $in: loc } }]})
      }else{
        criteria.push({ current_location: { $in: loc } });
      }
    }
    if(!(minExp == "") && !(maxExp == "") && search.length > 0){
      criteria.push({"skillset.exp":{$gt:minExp,$lt:maxExp}})
    }else if((!(minExp == "") && (maxExp =="")) || (!(maxExp == "")&& (minExp =="")) &&!(search.length >0)){
      if(!(minExp == "")){
        criteria.push({$and:[{"skillset.exp":{$gt:minExp}}]})
      }else if(!(maxExp == "")){
        criteria.push({$and:[{"skillset.exp":{$lt:maxExp}}]})
      }
    }else if((!(minExp == "") || !(maxExp == "")) && search.length > 0){
      if(!(minExp == "")){
        criteria.push({$and:[{"skillset.exp":{$gt:minExp}},{"skillset.skill": { $in: starRegx.flat()}}]})
      }else if(!(maxExp == "")){
        criteria.push({$and:[{"skillset.exp":{$lt:maxExp}},{"skillset.skill": { $in: starRegx.flat()}}]})
      }
    }
    else if((!(minExp == "") && !(maxExp == "")) && !(search.length > 0)){
      criteria.push({$and:[{"skillset.exp":{$gt: minExp,$lt:maxExp}}]})
    }
    
    if(itSkills.length > 0){
      console.log("hij")
      console.log(itSkills.length,"xx")
      
      itSkills.forEach(async (itSkill) => {
        const skillSet= itSkill.skill
        if(skillSet.length>0){
        if (itSkill?.mustHave === true) {
          const exp = parseInt(itSkill.experience) * 12;
          const years = parseInt(itSkill.experience)
          const skillRegex = new RegExp(itSkill.skill, 'i');
          const r = {$and:[{$or:[{"skillset.skill":skillRegex},{"employment_details.job_skills":skillRegex}]},{$or:[{ 'skillset.exp':{$gte:exp}},{'skillset.years':{$gte:years}}]}]};
          criteria.push(r)
          console.log("abc")

        }
        else if((itSkill?.mustHave === false)){
          const exp = parseInt(itSkill.experience) * 12;
          const years = parseInt(itSkill.experience)
          const skillRegex = new RegExp(itSkill.skill, 'i');
          const r = {$and:[{$or:[{"skillset.skill":skillRegex},{"employment_details.job_skills":skillRegex}]},{$or:[{ 'skillset.exp':{$gte:exp}},{'skillset.years':{$gte:years}}]}]};
          criteria.push(r)
          console.log("efg")

        }
        }
        
      });
    }
    //unaviwords
    if (unavi.length > 0) {
        criteria.push({ 
          $and: [
            { current_location: { $nin: unavi.flat() }},
          { first_name: { $nin: unavi.flat() } },
          { last_name: { $nin: unavi.flat() } },
          { "skillset.skill": { $nin: unavi.flat() } },
          { prefered_location: { $nin: unavi.flat() } },
          { email: { $nin: unavi.flat() } },
          { city: { $nin: unavi.flat() } },
          { state: { $nin: unavi.flat() } },
          { "employment_details.job_role": { $nin: unavi.flat() } },
          { "employment_details.job_skills": { $nin: unavi.flat() } },
          {resume_text:{$all:unavi.flat()}}
        ]
      });
    }

    if(company_boolean == true){
      const company_Boolean = await companyBoolean(company_names,company_boolean,company_search_in);
      criteria.push(company_Boolean)
    }
    if(exclude_boolean == true){
      const exclude_Boolean = await excludeBoolean(exclude_company,exclude_boolean,exclude_search_in);
      criteria.push(exclude_Boolean)
    }
    if(designation_boolean == true){
      const designationBoolean = await designation_Boolean(designation_names,designation_boolean,designation_search_in);
      criteria.push(designationBoolean)
    }
    if(departmentRole.length >0){
      const depart = makeArrayCaseInsensitive(departmentRole)
      criteria.push({$and:[{"resume_text":{$all:depart}},{"employment_details.company_name":{$in:depart}}]})
    }
    if(industry.length >0){
      const indus = makeArrayCaseInsensitive(industry)
      if((industry.length >0)&&(entireResume.EntireResume == true)){
        criteria.push({"resume_text":{$all:indus}})
      }else{
        criteria.push({"employment_details.industry_type":{$in:indus}})
      }
    }
    if(!gender == ""){
      function makeExactCaseInsensitivePattern(str) {
        return new RegExp(`^${str}$`, 'i');
      }
      const Gender = makeExactCaseInsensitivePattern(gender)
      criteria.push({gender:Gender})
    }
    if(!(workmode == "") && !(employment_type == "")){
      function makeArrayCaseInsensitive(arr) {
        return  new RegExp(arr, 'i');
      }
      const workMode = makeArrayCaseInsensitive(workmode);
      const employmentMode = makeArrayCaseInsensitive(employment_type)
      criteria.push({$and:[{"employment_details.employment_type":employmentMode},{"employment_details.work_model":workMode}]})
    }

    if(!(annual_salary.maximum_salary == "")){
      function makeArrayCaseInsensitive(arr) {
        return  new RegExp(arr, 'i');
      }
      const maximum_salary = makeArrayCaseInsensitive(annual_salary.maximum_salary)
      criteria.push({expected_ctc:maximum_salary})
    }

    if(notice_period.length >0){
      function makeArrayCustomCaseInsensitive(arr) {
        return arr.map(item => new RegExp(`^${item}$`, 'i'));
      }
      const noticePeriod = makeArrayCustomCaseInsensitive(notice_period);
      criteria.push({notice_period:{$in:noticePeriod}})
    }

    if(conditions.length >0){
      const anyConditionTrue = conditions.some(condition => Object.values(condition)[0]);
      if(anyConditionTrue){
          let query = { $and: [] };
          for (const condition of conditions) {
            for (const key in condition) {
              if (condition[key]) {
                const obj = {};
                obj[key] = { $exists: true };
                query.$and.push(obj);
              }
            }
          }
          criteria.push(query)
      }
    }

    if(work_permit.length >0){
      const permitLocation = customArrayCaseInsensitive(work_permit);
      criteria.push({resume_text:{$all:permitLocation}})
    }
    const query = {
      $and: criteria
    };
    console.log(query)
    try {
      const result = await fast_connection.models.candidate.find(query);
      const starCursion = (starValues.length > 0) ? starValues.flat().map((e)=>e.toLowerCase()) : search.map((e)=>e.toLowerCase());
      if(((andBooleanWords.length >0) && (booleansearch == true)) || (search.length > 0 && booleansearch == true)){
        const incursionWord = (andArray.flat().length > 0) ? andArray.flat().map((e) => e.toLowerCase()) : 
      modifiedData.flat().map((e) => e.toLowerCase());
      if(andArray.flat().length>0){
        const mustHaveDetails = dataStream(result).filter(obj => checkSkills(obj, incursionWord));
        const mustHaveIDs = mustHaveDetails.map((e) => e.id)
        const newOne = await fast_connection.models.candidate.find({ "_id": mustHaveIDs })
        return newOne.slice(0, 15);
      }else{
        return result.slice(0,15);
      }
      }
      else if(booleansearch == false && search.length > 0){
        const mustHaveDetails = dataStream(result).filter(obj => checkSkills(obj, starCursion));
        const mustHaveIDs = mustHaveDetails.map((e) => e.id)
        const newOne = await fast_connection.models.candidate.find({ "_id": mustHaveIDs })
        return newOne.slice(0, 15);
      }
      else{
        return result.slice(0,15)
      }
    } catch (err) {
      console.error("Error executing search:", err);
      throw err;
    }
  }
  static async BooleanascCandidate({ search, booleansearch, starvalues, itSkills, unavi, current_Location,minExp,maxExp,entireResume,company_boolean,company_names,company_search_in,
    exclude_boolean,exclude_company,exclude_search_in,designation_boolean,designation_names,designation_search_in,departmentRole,industry,
   gender,notice_period,workmode,employment_type,annual_salary,conditions,work_permit,skip,limit }) {
    const searchQuery = search.join(" ");
    const starValues = [];
    function isEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(searchQuery);
    }
    function checkSkills(obj, values) {
      return values.every(value =>
        Object.values(obj).some(fieldValue => {
          if (Array.isArray(fieldValue)) {
            return fieldValue.some(item => new RegExp(value, 'i').test(item));
          } else if (typeof fieldValue === 'string') {
            return new RegExp(value, 'i').test(fieldValue);
          }
          return false;
        })
      );
    }

    const dataStream = (results) => {
      const data = results.flat().map((e) => {
        return {
          "id": e._id.toString(),
          "skills": Array.isArray(e.skillset) ? e.skillset.map(skill => skill.skill ? skill.skill.toLowerCase() : null) : null,
          "first_name": typeof e.first_name === 'string' ? e.first_name.toLowerCase() : null,
          "last_name": typeof e.last_name === 'string' ? e.last_name.toLowerCase() : null,
          "state": typeof e.state === 'string' ? e.state.toLowerCase() : null,
          "city": typeof e.city === 'string' ? e.city.toLowerCase() : null,
          "prefered_location": typeof e.prefered_location === 'string' ? e.prefered_location.toLowerCase() : null,
          "resume_text": typeof e.resume_text === 'string' ? e.resume_text.toLowerCase() : null,
          "email": typeof e.email === 'string' ? e.email.toLowerCase() : null,
          "employment_details": Array.isArray(e.employment_details) ? e.employment_details.map(detail => typeof detail.job_role === 'string' ? detail.job_role.toLowerCase() : null) : null,
          "employment_skills": Array.isArray(e.employment_details) ? e.employment_details.map(detail => detail.job_skills ? detail.job_skills.toLowerCase() : null) : null,
          "current_location": typeof e.current_location === 'string' ? e.current_location.toLowerCase() : null,
          "expreience":Array.isArray(e.skillset) ? e.skillset.map(skill => skill.exp ? skill.exp.toString() : null) : null,
        }
      });
      return data
    }

    if (!searchQuery && !starvalues && !current_Location 
      && !minExp && !maxExp && !itSkills && !unavi && !exclude_company
      && !designation_names && !company_names && !notice_period && !departmentRole && !industry
      && !gender && !workmode && !employment_type && !annual_salary && work_permit && !conditions) {
      return "Query Parameter is Missing";
    }
    // Split the input string into an array based on "AND", "OR", and "NOT" as delimiters

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
    function customArrayCaseInsensitive(arr) {
      return arr.map(item => new RegExp(`^${item}$`, 'i'));
    }
    let starRegx = makeArrayCaseInsensitive(search)
    let andBooleanWords= makeArrayCaseInsensitive(andArray);
    let orBooleanword= makeArrayCaseInsensitive(orArray);
    let excludedWord= makeArrayCaseInsensitive(notArray);
    let commonBooleanword= makeArrayCaseInsensitive(commonBoolean );
    let modifiedResults= makeArrayCaseInsensitive(modifiedData);
    const criteria = [];
    if((booleansearch == true) && (search.length >0)){
          if ((modifiedResults.length > 0) && (entireResume.EntireResume == false) ) {
            // modifiedResults.push(minExp.toString(),maxExp.toString())
            criteria.push({ 
            $or: [
              { "skillset.skill": { $all: modifiedResults.flat() } },
              { "employment_details.job_skills": { $all: modifiedResults.flat() } },
              { email: { $all: modifiedResults.flat() } },
              { first_name: { $all: modifiedResults.flat() } },
              { last_name: { $all: modifiedResults.flat() } },
              { current_location: { $all: modifiedResults.flat() } },
              { prefered_location: { $all: modifiedResults.flat() } },
              { state: { $all: modifiedResults.flat() } },
              { city: { $all: modifiedResults.flat() } },
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{first_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{first_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{last_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{last_name: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{current_Location: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{current_Location: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.skill": { $in: modifiedResults.flat()}},{city: { $in: modifiedResults.flat() }}]},
              {$and:[{"employment_details.job_skills": { $in: modifiedResults.flat()}},{city: { $in: modifiedResults.flat() }}]},
              {$and:[{"skillset.exp":{$gt:minExp,$lt:maxExp}},{"skillset.skill": { $in: modifiedResults.flat()}}]}
            ]
          });
        }
        if(entireResume.EntireResume == true){
          criteria.push({resume_text:{$all:modifiedResults.flat()}})
        }
      }
       
     
        //notwords
        if (excludedWord.length > 0) {
          criteria.push({ 
            $and: [
              { current_location: { $nin: excludedWord.flat() }},
            { first_name: { $nin: excludedWord.flat() } },
            { last_name: { $nin: excludedWord.flat() } },
            { "skillset.skill": { $nin: excludedWord.flat() } },
            { prefered_location: { $nin: excludedWord.flat() } },
            { email: { $nin: excludedWord.flat() } },
            { city: { $nin: excludedWord.flat() } },
            { state: { $nin: excludedWord.flat() } },
            { "employment_details.job_role": { $nin: excludedWord.flat() } },
            { "employment_details.job_skills": { $nin: excludedWord.flat() } },
            {resume_text:{$all:excludedWord.flat()}}
          ]
        });
      }
  
      if((booleansearch == false) && (search.length >0)){
      if ((search.length > 0) && (entireResume.EntireResume == false)) {
         starValues.push(starvalues)
        criteria.push({ 
        $or: [
          { "skillset.skill": { $all: starRegx.flat() } },
          { "employment_details.job_skills": { $all: starRegx.flat() } },
          { email: { $all: starRegx.flat() } },
          { first_name: { $all: starRegx.flat() } },
          { last_name: { $all: starRegx.flat() } },
          { current_location: { $all: starRegx.flat() } },
          { prefered_location: { $all: starRegx.flat() } },
          { state: { $all: starRegx.flat() } },
          { city: { $all: starRegx.flat() } },
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{first_name: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{first_name: { $in: starRegx.flat() }}]},
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{last_name: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{last_name: { $in: starRegx.flat() }}]},
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{current_Location: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{current_Location: { $in: starRegx.flat() }}]},
          {$and:[{"skillset.skill": { $in: starRegx.flat()}},{city: { $in: starRegx.flat() }}]},
          {$and:[{"employment_details.job_skills": { $in: starRegx.flat()}},{city: { $in: starRegx.flat() }}]},
        ]
      });
    }
    if(entireResume.EntireResume == true){
      criteria.push({resume_text:{$all:starRegx.flat()}})
    }
  }
  if (current_Location.length > 0) {
    const loc = makeArrayCaseInsensitive(current_Location)
    if(entireResume.EntireResume == true){
      criteria.push({resume_text:{$all:loc}})
    }else{
      criteria.push({ current_location: { $in: loc } });
    }
  }
    if(!(minExp == "") && !(maxExp == "") && search.length > 0){
      criteria.push({"skillset.exp":{$gt:minExp,$lt:maxExp}})
    }else if((!(minExp == "") && (maxExp =="")) || (!(maxExp == "")&& (minExp =="")) &&!(search.length >0)){
      if(!(minExp == "")){
        criteria.push({$and:[{"skillset.exp":{$gt:minExp}}]})
      }else if(!(maxExp == "")){
        criteria.push({$and:[{"skillset.exp":{$lt:maxExp}}]})
      }
    }else if((!(minExp == "") || !(maxExp == "")) && search.length > 0){
      if(!(minExp == "")){
        criteria.push({$and:[{"skillset.exp":{$gt:minExp}},{"skillset.skill": { $in: starRegx.flat()}}]})
      }else if(!(maxExp == "")){
        criteria.push({$and:[{"skillset.exp":{$lt:maxExp}},{"skillset.skill": { $in: starRegx.flat()}}]})
      }
    }
    else if((!(minExp == "") && !(maxExp == "")) && !(search.length > 0)){
      criteria.push({$and:[{"skillset.exp":{$gt: minExp,$lt:maxExp}}]})
    }

    
    if(itSkills.length >0){
      itSkills.forEach(async (itSkill) => {
        const skillSet= itSkill.skill
        if(skillSet.length>0){
        console.log("123")
        if (itSkill?.mustHave === true) {
          const exp = parseInt(itSkill.experience) * 12;
          const years = parseInt(itSkill.experience)
          const skillRegex = new RegExp(itSkill.skill, 'i');
          const r = {$and:[{$or:[{"skillset.skill":skillRegex},{"employment_details.job_skills":skillRegex}]},{$or:[{ 'skillset.exp':{$gte:exp}},{'skillset.years':{$gte:years}}]}]};
          criteria.push(r)
          console.log("456")
        }
        
    else if((itSkills?.mustHave === false)){
      const exp = parseInt(itSkill.experience) * 12;
      const years = parseInt(itSkill.experience)
      const skillRegex = new RegExp(itSkill.skill, 'i');
      const r = {$and:[{$or:[{"skillset.skill":skillRegex},{"employment_details.job_skills":skillRegex}]},{$or:[{ 'skillset.exp':{$gte:exp}},{'skillset.years':{$gte:years}}]}]};
      criteria.push(r)
      console.log("789")

    }
    
    }
      });
    }

    
    
    //unaviwords
    if (unavi.length > 0) {
      criteria.push({ 
        $and: [
          { current_location: { $nin: unavi.flat() }},
        { first_name: { $nin: unavi.flat() } },
        { last_name: { $nin: unavi.flat() } },
        { "skillset.skill": { $nin: unavi.flat() } },
        { prefered_location: { $nin: unavi.flat() } },
        { email: { $nin: unavi.flat() } },
        { city: { $nin: unavi.flat() } },
        { state: { $nin: unavi.flat() } },
        { "employment_details.job_role": { $nin: unavi.flat() } },
        { "employment_details.job_skills": { $nin: unavi.flat() } },
        {resume_text:{$all:unavi.flat()}}
      ]
    });
  }

    if(company_boolean == true){
      const company_Boolean = await companyBoolean(company_names,company_boolean,company_search_in);
      criteria.push(company_Boolean)
    }
    if(exclude_boolean == true){
      const exclude_Boolean = await excludeBoolean(exclude_company,exclude_boolean,exclude_search_in);
      criteria.push(exclude_Boolean)
    }
    if(designation_boolean == true){
      const designationBoolean = await designation_Boolean(designation_names,designation_boolean,designation_search_in);
      criteria.push(designationBoolean)
    }
    if(departmentRole.length >0){
      const depart = makeArrayCaseInsensitive(departmentRole)
      criteria.push({$and:[{"resume_text":{$all:depart}},{"employment_details.company_name":{$in:depart}}]})
    }
    if(industry.length >0){
      const indus = makeArrayCaseInsensitive(industry)
      if((industry.length >0)&&(entireResume.EntireResume == true)){
        criteria.push({"resume_text":{$all:indus}})
      }else{
        criteria.push({"employment_details.industry_type":{$in:indus}})
      }
    }
    

    if(!gender == ""){
      function makeExactCaseInsensitivePattern(str) {
        return new RegExp(`^${str}$`, 'i');
      }
      const Gender = makeExactCaseInsensitivePattern(gender)
      criteria.push({gender:Gender})
    }
    if(!(workmode == "") && !(employment_type == "")){
      function makeArrayCaseInsensitive(arr) {
        return  new RegExp(arr, 'i');
      }
      const workMode = makeArrayCaseInsensitive(workmode);
      const employmentMode = makeArrayCaseInsensitive(employment_type)
      criteria.push({$and:[{"employment_details.employment_type":employmentMode},{"employment_details.work_model":workMode}]})
    }

    if(!(annual_salary.maximum_salary == "")){
      function makeArrayCaseInsensitive(arr) {
        return  new RegExp(arr, 'i');
      }
      const maximum_salary = makeArrayCaseInsensitive(annual_salary.maximum_salary)
      criteria.push({expected_ctc:maximum_salary})
    }

    if(notice_period.length >0){
      const noticePeriod = makeArrayCaseInsensitive(notice_period);
      criteria.push({notice_period:{$in:noticePeriod}})
    }

    if(conditions.length >0){
      const anyConditionTrue = conditions.some(condition => Object.values(condition)[0]);
      if(anyConditionTrue){
          let query = { $and: [] };
          for (const condition of conditions) {
            for (const key in condition) {
              if (condition[key]) {
                const obj = {};
                obj[key] = { $exists: true };
                query.$and.push(obj);
              }
            }
          }
          criteria.push(query)
      }
    }

    if(work_permit.length >0){
      const permitLocation = customArrayCaseInsensitive(work_permit);
      criteria.push({resume_text:{$all:permitLocation}})
    }

    const query = {
      $and: criteria
    };
    try {
      const result = await fast_connection.models.candidate.find(query);
      const starCursion = (starValues.length > 0) ? starValues.flat().map((e)=>e.toLowerCase()) : search.map((e)=>e.toLowerCase());
      if(((andBooleanWords.length >0) && (booleansearch == true)) || (search.length > 0 && booleansearch == true)){
        const incursionWord = (andArray.flat().length > 0) ? andArray.flat().map((e) => e.toLowerCase()) : 
      modifiedData.flat().map((e) => e.toLowerCase());
      if(andArray.flat().length>0){
        const mustHaveDetails = dataStream(result).filter(obj => checkSkills(obj, incursionWord));
        const mustHaveIDs = mustHaveDetails.map((e) => e.id)
        const newOne = await fast_connection.models.candidate.find({ "_id": mustHaveIDs })
        return newOne.slice(skip, limit + skip);
      }else{
        return result.slice(skip, limit + skip);
      }
      }
      else if(booleansearch == false && search.length > 0){
        const mustHaveDetails = dataStream(result).filter(obj => checkSkills(obj, starCursion));
        const mustHaveIDs = mustHaveDetails.map((e) => e.id)
        const newOne = await fast_connection.models.candidate.find({ "_id": mustHaveIDs })
        return newOne.slice(skip, limit + skip);
      }
      else{
        return result.slice(skip, limit + skip);
      }
    } catch (err) {
      console.error("Error executing search:", err);
      throw err;
    }
  }


  static async searchFeild(searchList) {
    try {
      const query = {};
      console.log(searchList, "ui")

      const allFields = searchList.allFields;
      console.log(allFields, "7")
      if (searchList.allFields.current_location && Array.isArray(searchList.allFields.current_location)) {
        const locationQuery = { $in: searchList.allFields.current_location };
        query.current_location = locationQuery;
      }



      // if (searchList.city) {
      //   query.city = allFields.city;
      // }

      // if (searchList?.skills && Array.isArray(searchList?.skills)) {
      //   const skillsQuery = [];

      //   for (const skill of searchList?.skills) {
      //     if (skill?.skill && skill?.minExp && skill?.minExp) {
      //       const skillRegex = new RegExp(skill?.skill, 'i');
      //       skillsQuery.push({
      //         skill: { $regex: skillRegex },
      //         exp: { $gte: skill?.minExp, $lte: skill?.minExp }
      //       });
      //     }
      //   }

      //   if (skillsQuery.length > 0) {
      //     query['skillset'] = { $elemMatch: { $or: skillsQuery } };
      //   }
      // }
      // if (typeof allFields.willing_to_relocate === 'boolean') {
      //   query.willing_to_relocate = allFields.willing_to_relocate;
      // }

      // if (allFields.prefered_location) {
      //   query.prefered_location = allFields.prefered_location;
      // }

      if (searchList.skills && Array.isArray(searchList.skills)) {
        const skillsQuery = [];

        for (const skill of searchList.skills) {
          if (skill.skill && skill.experience) {
            const skillRegex = new RegExp(skill.skill, 'i');
            console.log(typeof (skill.experience))
            const exp = (parseInt(skill.experience) * 12)
            console.log(exp)
            skillsQuery.push({
              skill: { $regex: skillRegex },
              exp: { $gte: exp }
            });
          }
        }

        if (skillsQuery.length > 0) {
          query['skillset'] = { $elemMatch: { $or: skillsQuery } };
        }
      }

      if (allFields?.expected_ctc) {
        query.expected_ctc = allFields.expected_ctc;
      }

      // if (allFields?.notice_period) {
      //   query.notice_period = allFields.notice_period;
      // }
      console.log(allFields.gender)
      if (allFields?.gender) {
        query.gender = allFields.gender;
      }

      // if (allFields.minSalary && allFields.maxSalary) {

      //   const minSalaryValue = parseFloat(allFields.minSalary.replace(/[^\d.]/g, ''));
      //   const maxSalaryValue = parseFloat(allFields.maxSalary.replace(/[^\d.]/g, ''));
      //   console.log(minSalaryValue, maxSalaryValue)

      //   if (!isNaN(minSalaryValue) && !isNaN(maxSalaryValue)) {
      //     console.log(query['expected_ctc'] = {
      //       $regex: new RegExp(`^${minSalaryValue}LPA$|^${maxSalaryValue}LPA$`),
      //       $gte: `${minSalaryValue}LPA`,
      //       $lte: `${maxSalaryValue}LPA`
      //     })
      //     query['expected_ctc'] = {
      //       $regex: new RegExp(`^${minSalaryValue}LPA$|^${maxSalaryValue}LPA$`),
      //       $gte: `${minSalaryValue}LPA`,
      //       $lte: `${maxSalaryValue}LPA`
      //     }
      //   }
      // }


      if (allFields?.work_model) {
        const work_modelRegex = new RegExp(allFields.work_model, 'i');
        query['employment_details.work_model'] = { $regex: work_modelRegex };
      }

      if (allFields?.job_role) {
        const jobRoleRegex = new RegExp(allFields.job_role, 'i');
        query['employment_details.job_role'] = { $regex: jobRoleRegex };
      }
      if (allFields?.designation) {
        const designationRegex = new RegExp(allFields.designation, 'i');
        query['employment_details.job_role'] = { $regex: designationRegex };
      }
      if (allFields?.industry_type) {
        const industryTypeRegex = new RegExp(allFields.industry_type, 'i');
        query['employment_details.industry_type'] = { $regex: industryTypeRegex };
      }
      if (allFields?.employment_type) {
        const employmentTypeRegex = new RegExp(allFields.employment_type, 'i');
        query['employment_details.employment_type'] = { $regex: employmentTypeRegex };
      }
      if (allFields?.company_name) {
        const companyNameRegex = new RegExp(allFields.company_name, 'i');
        query['employment_details.company_name'] = { $regex: companyNameRegex };
      }

      const result = await fast_connection.models.candidate.find(query);
      console.log(result)
      return result;
    } catch (error) {
      console.error('Error searching candidates:', error);
      throw error;
    }
  }

  static async resumeSearch(searchTerm) {
    try {
      // Search for candidates with matching resume_text or resume_url
      const results = await fast_connection.models.candidate.find({
        $or: [
          { resume_text: { $regex: searchTerm, $options: 'i' } },
          { resume_url: { $regex: searchTerm, $options: 'i' } }
        ]
      });

      // Loop through the results
      for (const candidate of results) {
        // Check if resume_data is empty
        if (!candidate.resume_data) {
          // Fetch the content from the resume_url and parse it as text
          const resumeContent = await fetchResumeContent(candidate.resume_url); // Implement fetchResumeContent function

          // Update the candidate's resume_data with the parsed content
          candidate.resume_data = resumeContent;

          // Save the updated candidate back to the database
          await candidate.save();
        }
      }

      // Return the results
      console.log(results.length);
      return results;
    } catch (error) {
      console.error(error);
      throw error;
    }
    // async function fetchResumeContent(resumeUrl) {
    //   try {
    //     // Fetch the resume content from the provided URL
    //     const response = await axios.get(resumeUrl, { responseType: 'arraybuffer' });
    //     const resumeBuffer = response.data;

    //     // Parse the resume content (assuming it's in DOCX format)
    //     const result = await mammoth.extractRawText({ buffer: resumeBuffer });
    //     const resumeText = result.value;
    //     console.log(resumeText)
    //     return resumeText;

    //   } catch (error) {
    //     console.error('Error fetching or parsing the resume:', error);
    //     throw error;
    //   }
    // }
  }


}

module.exports = BooleanSearch;
