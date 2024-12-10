export interface DegreeProgram {
  name: string;
  category?: string;
  subcategory?: string;
}

export const DEGREE_PROGRAMS: DegreeProgram[] = [
  // Law
  { name: "Juris Doctor", category: "Law" },

  // Graduate School - Doctoral
  { name: "Doctor Of Philosophy In Animal Science", category: "Graduate School", subcategory: "Doctoral" },
  { name: "Doctor Of Philosophy In Crop Science", category: "Graduate School", subcategory: "Doctoral" },
  { name: "Doctor Of Philosophy In Education Major In Educational Management", category: "Graduate School", subcategory: "Doctoral" },

  // Graduate School - Masters
  { name: "Maste Of Arts In Education Major In Filipino Language Teaching", category: "Graduate School", subcategory: "Masters" },
  { name: "Master In Agricultural Sciences Major In Animal Science", category: "Graduate School", subcategory: "Masters" },
  { name: "Master In Agricultural Sciences Major In Crop Science", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education In Biology", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education Major In Educational Management", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education Major In Elementary Education", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education Major In English Language Teaching", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education Major In Kindergarten Education", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education Major In Science Teaching", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education Major In Social Science", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Education Major In Teaching Mathematics", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Management", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Teaching Mathematics", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Teaching Vocational Education Major In Entrepreneurship", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Teaching Vocational Education Major In Home Economics Technology", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Arts In Teaching Vocational Education Major In Information And Communication Technology", category: "Graduate School", subcategory: "Masters" },
  { name: "Master Of Science In Criminal Justice Education With Specialization In Criminology", category: "Graduate School", subcategory: "Masters" },
  { name: "Master's In Engineering Major In Civil Engineering", category: "Graduate School", subcategory: "Masters" },

  // Undergraduate Programs
  { name: "Bachelor Of Science In Agriculture", category: "Undergraduate", subcategory: "College of Agriculture" },
  
  { name: "Bachelor Of Arts In Communication", category: "Undergraduate", subcategory: "College of Arts and Sciences" },
  { name: "Bachelor Of Arts In Political Science", category: "Undergraduate", subcategory: "College of Arts and Sciences" },
  { name: "Bachelor Of Science In Social Work", category: "Undergraduate", subcategory: "College of Arts and Sciences" },
  
  { name: "Bachelor Of Science In Accountancy", category: "Undergraduate", subcategory: "College of Business Management and Accountancy" },
  { name: "Bachelor Of Science In Accounting Information System", category: "Undergraduate", subcategory: "College of Business Management and Accountancy" },
  { name: "Bachelor Of Science In Entrepreneurship", category: "Undergraduate", subcategory: "College of Business Management and Accountancy" },
  { name: "Bachelor Of Science In Business Administration Major In Business Economics", category: "Undergraduate", subcategory: "College of Business Management and Accountancy" },
  { name: "Bachelor Of Science In Business Administration Major In Financial Management", category: "Undergraduate", subcategory: "College of Business Management and Accountancy" },
  { name: "Bachelor Of Science In Business Administration Major In Human Resource Management", category: "Undergraduate", subcategory: "College of Business Management and Accountancy" },
  { name: "Bachelor Of Science In Business Administration Major In Marketing Management", category: "Undergraduate", subcategory: "College of Business Management and Accountancy" },
  
  { name: "Associate in Computer Technology", category: "Undergraduate", subcategory: "College of Computer Studies" },
  { name: "Bachelor Of Science In Computer Science", category: "Undergraduate", subcategory: "College of Computer Studies" },
  { name: "Bachelor Of Science In Entertainment And Multimedia Computing", category: "Undergraduate", subcategory: "College of Computer Studies" },
  { name: "Bachelor Of Science In Information Technology", category: "Undergraduate", subcategory: "College of Computer Studies" },
  
  { name: "Bachelor Of Science In Criminology", category: "Undergraduate", subcategory: "College of Criminal Justice Education" },
  
  { name: "Bachelor Of Elementary Education", category: "Undergraduate", subcategory: "College of Education" },
  { name: "Bachelor Of Secondary Education Major In English", category: "Undergraduate", subcategory: "College of Education" },
  { name: "Bachelor Of Secondary Education Major In Filipino", category: "Undergraduate", subcategory: "College of Education" },
  { name: "Bachelor Of Secondary Education Major In Mathematics", category: "Undergraduate", subcategory: "College of Education" },
  { name: "Bachelor Of Secondary Education Major In Science", category: "Undergraduate", subcategory: "College of Education" },
  { name: "Bachelor Of Secondary Education Major In Social Studies", category: "Undergraduate", subcategory: "College of Education" },
  
  { name: "Bachelor Of Science In Civil Engineering", category: "Undergraduate", subcategory: "College of Engineering" },
  { name: "Bachelor Of Science In Computer Engineering", category: "Undergraduate", subcategory: "College of Engineering" },
  { name: "Bachelor Of Science In Electrical Engineering", category: "Undergraduate", subcategory: "College of Engineering" },
  
  { name: "Bachelor Of Science In Fisheries", category: "Undergraduate", subcategory: "College of Fisheries and Aquatic Sciences" },
  
  { name: "Bachelor Of Science In Hospitality Management", category: "Undergraduate", subcategory: "College of Hospitality Management" },
  { name: "Bachelor Of Science In Tourism Management", category: "Undergraduate", subcategory: "College of Hospitality Management" },
  
  { name: "Bachelor Of Science In Midwifery", category: "Undergraduate", subcategory: "College of Nursing and Allied Sciences" },
  { name: "Bachelor Of Science In Nursing", category: "Undergraduate", subcategory: "College of Nursing and Allied Sciences" },
  { name: "Bachelor Of Science In Nutrition & Dietetics", category: "Undergraduate", subcategory: "College of Nursing and Allied Sciences" },
  
  { name: "Bachelor Of Science In Biology", category: "Undergraduate", subcategory: "College of Science" },
  { name: "Bachelor Of Science In Environmental Science", category: "Undergraduate", subcategory: "College of Science" },
  
  { name: "Bachelor In Industrial Technology", category: "Undergraduate", subcategory: "College of Technology" },
];

export const getDegreesByCategory = () => {
  const categories = new Map<string, Map<string, string[]>>();
  
  DEGREE_PROGRAMS.forEach((program) => {
    if (!categories.has(program.category!)) {
      categories.set(program.category!, new Map());
    }
    
    const category = categories.get(program.category!)!;
    const subcategory = program.subcategory || "Other";
    
    if (!category.has(subcategory)) {
      category.set(subcategory, []);
    }
    
    category.get(subcategory)!.push(program.name);
  });
  
  return categories;
};