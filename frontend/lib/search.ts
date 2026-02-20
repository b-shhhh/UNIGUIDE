import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface University {
  country: string;
  university: string;
  course: string;
  degree_level: string;
  website: string;
  ielts_min: string;
  sat_required: string;
  sat_min: string;
  country_flag: string;
  university_logo: string;
}

export function getUniversityData(): University[] {
  const filePath = path.join(process.cwd(), 'universities.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });
}

export function findUniversities(query: string): University[] {
  const data = getUniversityData();
  const lowerQuery = query.toLowerCase();

  return data.filter((uni) => 
    uni.university.toLowerCase().includes(lowerQuery) ||
    uni.country.toLowerCase().includes(lowerQuery) ||
    uni.course.toLowerCase().includes(lowerQuery)
  ).slice(0, 5); // Return top 5 matches
}